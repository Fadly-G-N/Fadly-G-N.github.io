// ==========================================================================
// 1. DOM SELECTION (Menangkap elemen HTML)
// ==========================================================================
const lblType = document.getElementById('lbl-type');
const lblGate = document.getElementById('lbl-gate');
const lblVolt = document.getElementById('lbl-volt');
const lblWatt = document.getElementById('lbl-watt');
const lblCurrent = document.getElementById('lbl-current');
const lblResist = document.getElementById('lbl-resist');
const systemStatus = document.getElementById('system-status');

const lampImg = document.getElementById('lamp1');
const btnInputA = document.getElementById('btn-input-a');
const btnInputB = document.getElementById('btn-input-b');
const voltageSlider = document.getElementById('voltage-slider');

// ==========================================================================
// 2. STATE MANAGEMENT & DATA DEFAULT
// ==========================================================================
// Data spesifikasi jenis lampu yang bisa dipilih
const LAMP_TEMPLATES = {
    'PIJAR': { name: 'Lampu Pijar', resistance: 48, maxWatt: 60 },
    'LED': { name: 'LED', resistance: 220, maxWatt: 5 },
    'NEON': { name: 'Neon', resistance: 120, maxWatt: 15 }
};

// State utama aplikasi (mengambil data dari localStorage jika ada)
const appState = {
    voltageSource: parseFloat(voltageSlider.value),
    isInputA_On: false,
    isInputB_On: false,
    // Ambil jenis gerbang dari localStorage, jika kosong default ke 'AND'
    currentGate: localStorage.getItem('selectedGate') || 'AND',
    // Ambil jenis lampu dari localStorage, jika kosong default ke 'PIJAR'
    currentLampType: localStorage.getItem('selectedLampType') || 'PIJAR',
    isBroken: false
};

// ==========================================================================
// 3. FUNGSI LOGIKA GERBANG (Logical Gates Core)
// ==========================================================================
function checkLogicGate(gate, a, b) {
    switch (gate) {
        case 'AND': return a && b;
        case 'OR':  return a || b;
        case 'NOT': return !a; // NOT biasanya hanya memakai 1 input (input A)
        case 'NAND':return !(a && b);
        case 'NOR': return !(a || b);
        case 'XOR': return a !== b;
        default:    return false;
    }
}

// ==========================================================================
// 4. FUNGSI UTAMA KALKULASI FISIKA & UPDATE UI
// ==========================================================================
function updateSimulation() {
    // 1. Ambil spesifikasi lampu yang sedang aktif
    const lampSpec = LAMP_TEMPLATES[appState.currentLampType];
    
    // 2. Tentukan apakah gerbang logika meloloskan arus (Output = 1 atau 0)
    const isGateOutputTrue = checkLogicGate(appState.currentGate, appState.isInputA_On, appState.isInputB_On);
    
    // 3. Jalankan kalkulasi Fisika Murni
    // Jika gerbang bernilai TRUE dan lampu belum pecah, lampu dapat tegangan
    let voltKeLampu = (isGateOutputTrue && !appState.isBroken) ? appState.voltageSource : 0;
    
    // Rumus Hukum Ohm: I = V / R
    let current = voltKeLampu / lampSpec.resistance;
    
    // Rumus Daya Listrik: P = V * I
    let watt = voltKeLampu * current;

    // 4. Validasi Batas Maksimal Daya (Overload & Broken Check)
    if (watt > lampSpec.maxWatt && !appState.isBroken) {
        appState.isBroken = true;
        voltKeLampu = 0;
        current = 0;
        watt = 0;
    }

    // 5. UPDATE TAMPILAN INFORMASI (Teks UI)
    lblType.textContent = lampSpec.name;
    lblGate.textContent = appState.currentGate;
    lblVolt.textContent = voltKeLampu.toFixed(1);
    lblWatt.textContent = watt.toFixed(1);
    lblCurrent.textContent = current.toFixed(2);
    lblResist.textContent = lampSpec.resistance;

    // 6. UPDATE VISUAL LAMPU & STATUS SISTEM
    if (appState.isBroken) {
        systemStatus.textContent = "SISTEM RUSAK: LAMPU MELEDAK! (OVERLOAD)";
        systemStatus.className = "logic-stat broken";
        lampImg.className = "broken";
        // Ubah gambar ke off atau jika ada gambar pecah silakan diganti jalurnya
        lampImg.src = "./assets/images/off.gif"; 
        document.documentElement.style.setProperty('--kecerahan', 0);
    } else {
        systemStatus.textContent = isGateOutputTrue ? "Aliran Listrik Aktif" : "Sistem Normal (Lampu Mati)";
        systemStatus.className = "logic-stat normal";
        lampImg.className = "";
        
        if (voltKeLampu > 0) {
            lampImg.src = "./assets/images/on.gif"; // Asumsi ada file on.gif
            
            // Hitung rasio kecerahan berdasarkan voltase saat ini dibanding voltase maksimal slider (440V)
            // Ini akan ditembak ke CSS Variables (--kecerahan)
            const brightnessRatio = voltKeLampu / 440;
            document.documentElement.style.setProperty('--kecerahan', brightnessRatio);
        } else {
            lampImg.src = "./assets/images/off.gif";
            document.documentElement.style.setProperty('--kecerahan', 0);
        }
    }
}

// ==========================================================================
// 5. EVENT LISTENERS (Merespon Aksi User)
// ==========================================================================

// Respons saat Saklar A diklik
btnInputA.addEventListener('click', () => {
    if (appState.isBroken) return; // Kunci saklar jika sudah rusak
    
    appState.isInputA_On = !appState.isInputA_On;
    btnInputA.setAttribute('data-state', appState.isInputA_On ? 'on' : 'off');
    btnInputA.textContent = `Saklar A: ${appState.isInputA_On ? 'ON' : 'OFF'}`;
    
    updateSimulation();
});

// Respons saat Saklar B diklik
btnInputB.addEventListener('click', () => {
    if (appState.isBroken) return;
    
    appState.isInputB_On = !appState.isInputB_On;
    btnInputB.setAttribute('data-state', appState.isInputB_On ? 'on' : 'off');
    btnInputB.textContent = `Saklar B: ${appState.isInputB_On ? 'ON' : 'OFF'}`;
    
    updateSimulation();
});

// Respons saat Slider Voltase digeser
voltageSlider.addEventListener('input', (e) => {
    appState.voltageSource = parseFloat(e.target.value);
    updateSimulation();
});

// ==========================================================================
// 6. INISIALISASI AWAL (Saat Halaman Pertama Kali Dimuat)
// ==========================================================================
// Set nilai awal slider sesuai state
voltageSlider.value = appState.voltageSource;

// Jalankan simulasi pertama kali
updateSimulation();