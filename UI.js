/* =========================
   GLOBAL STATE
========================= */
const GameState = {
  stats: {
    exp: 0,
    plt: 0,
    mny: 0
  }
};

/* =========================
   STORAGE
========================= */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
}

/* =========================
   AUTH CHECK
========================= */
const user = getCurrentUser();

if (!user) {
  alert("silahkan login terlebih dahulu..., kami tidak mengumpulkan data pribadi anda")
  window.location.href = "./page/signin.html";
}

/* =========================
   DISPLAY USER
========================= */
const nameEl = document.getElementById("playerName");

if (nameEl && user) {
  nameEl.textContent = user.name;
}

/* =========================
   LOGOUT BUTTON
========================= */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "./page/login.html";
  });
}

/* =========================
   UTIL
========================= */
function $(id) {
  return document.getElementById(id);
}

/* =========================
   PAGE DETECTOR
========================= */
function getCurrentPage() {
  return document.body.className || "";
}

/* =========================
   =========================
   HOME PAGE SYSTEM
   =========================
========================= */
function initHomePage() {
  if (!getCurrentPage().includes("home-page")) return;

  /* ---------- STATS ---------- */
  const expEl = $("exp");
  const pltEl = $("plt");
  const mnyEl = $("mny");

  function renderStats() {
    if (expEl) expEl.innerHTML = `<span>EXP: </span>${GameState.stats.exp}`;
    if (pltEl) pltEl.innerHTML = `<span>PLT: </span>${GameState.stats.plt}`;
    if (mnyEl) mnyEl.innerHTML = `<span>MNY: </span>${GameState.stats.mny}`;
  }

  renderStats();

  /* ---------- DIALOG ---------- */
  const dialogText = $("dialogText");
  const dialogName = $("dialogName");

  function showDialog(name, text) {
    if (dialogName) dialogName.textContent = name;
    if (dialogText) dialogText.textContent = text;
  }

  showDialog(
    "Developer",
    "Maaf saat ini game masih dalam tahap pembuatan, sistem masih dikembangkan."
  );

  /* ---------- BGM ---------- */
  const bgm = $("bgm");

  function startBGM() {
    if (!bgm) return;
    bgm.volume = 0.5;
    bgm.play().catch(() => {});

    document.removeEventListener("click", startBGM);
    document.removeEventListener("touchstart", startBGM);
  }

  document.addEventListener("click", startBGM);
  document.addEventListener("touchstart", startBGM);
}

/* =========================
   =========================
   CLOCK SYSTEM (GLOBAL)
   =========================
========================= */
function initClock() {
  const elJam = $("jam");
  const elTanggal = $("tanggal");

  if (!elJam && !elTanggal) return;

  const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  function updateWaktu() {
    const now = new Date();

    const jam = String(now.getHours()).padStart(2, "0");
    const menit = String(now.getMinutes()).padStart(2, "0");
    const detik = String(now.getSeconds()).padStart(2, "0");

    const tgl = now.getDate();
    const hr = hari[now.getDay()];
    const bln = bulan[now.getMonth()];
    const thn = now.getFullYear();

    if (elJam) elJam.textContent = `${jam}:${menit}:${detik}`;
    if (elTanggal) elTanggal.textContent = `${hr}, ${tgl} ${bln} ${thn}`;
  }

  setInterval(updateWaktu, 1000);
  updateWaktu();
}

/* =========================
   =========================
   QUEST PAGE SYSTEM
   =========================
========================= */
function initQuestPage() {
  if (!getCurrentPage().includes("quest-page")) return;

  const container = $("questList");
  if (!container) return;

  const questData = [
    {
      id: 1,
      title: "Bantu Warga Desa",
      desc: "Kumpulkan 10 kayu dari hutan untuk membantu pembangunan rumah warga.",
      reward: { exp: 50, mny: 100 }
    },
    {
      id: 2,
      title: "Berburu Slime",
      desc: "Kalahkan 5 slime yang mengganggu area sekitar desa.",
      reward: { exp: 30, mny: 70 }
    },
    {
      id: 3,
      title: "Cari Herbal",
      desc: "Temukan 3 tanaman herbal untuk penyembuhan.",
      reward: { exp: 20, mny: 50 }
    }
  ];

  container.innerHTML = questData.map(q => `
    <article class="quest-card" data-id="${q.id}">
      <h2 class="quest-title">${q.title}</h2>
      <p class="quest-desc">${q.desc}</p>
      <div class="quest-reward">
        <span>EXP: +${q.reward.exp}</span>
        <span>MNY: +${q.reward.mny}</span>
      </div>
    </article>
  `).join("");
}

/* =========================
   INIT ALL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initQuestPage();
  initClock();
});