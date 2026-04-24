let allScenes = {};
let sceneData = {};
let currentSceneId = "";
let dialogIndex = 0;
let isTyping = false;
let typingInterval;

let playerStats = {
    nama: "Arka",
    trust: 0,
    mental: 50,
    sword: 0,
    tactics: 0
};

const elNarasi = document.getElementByclass('narasi');
const elNama = document.getElementByclass('nama-karakter');
const elDialog = document.getElementByclass('teks-dialog');
const elContainer = document.getElementByclass('scene-container');
const elBtnNext = document.getElementByclass('btn-next');
const elPilihan = document.getElementByclass('pilihan-container');

function loadStats() {
    const save = localStorage.getItem('rpgvn_save');
    if (save) playerStats = JSON.parse(save);
}

function saveStats() {
    localStorage.setItem('rpgvn_save', JSON.stringify(playerStats));
}

async function initGame() {
    loadStats();

    const urlParams = new URLSearchParams(window.location.search);
    currentSceneId = urlParams.get('id') || 'prolog';

    const res = await fetch('./data/sceneData.json');
    allScenes = await res.json();

    loadScene(currentSceneId);
}

function loadScene(id) {
    sceneData = allScenes[id];
    dialogIndex = 0;

    elContainer.style.backgroundImage = sceneData.background;

    typeWriter(sceneData.narasi, elNarasi, () => {
        showDialog(0);
    });
}

function typeWriter(text, el, callback) {
    if(isTyping) return;
    isTyping = true;

    let i = 0;
    el.innerHTML = "";

    typingInterval = setInterval(() => {
        if(i < text.length) {
            el.innerHTML += text[i++];
        } else {
            clearInterval(typingInterval);
            isTyping = false;
            callback && callback();
        }
    }, 20);
}

function showDialog(i) {
    if(i >= sceneData.dialogs.length) {
        if(sceneData.pilihan) return showChoices();
        if(sceneData.nextScene) return loadScene(sceneData.nextScene);
        return;
    }

    const d = sceneData.dialogs[i];

    elNama.innerText = d.nama;
    typeWriter(d.teks, elDialog);
}

function showChoices() {
    elBtnNext.style.display = 'none';
    elPilihan.innerHTML = '';
    elPilihan.style.display = 'flex';

    sceneData.pilihan.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'btn-pilihan';
        btn.innerText = p.teks;

        btn.onclick = () => {
            if(p.effects){
                for(let k in p.effects){
                    playerStats[k] += p.effects[k];
                }
                saveStats();
            }
            loadScene(p.next);
        };

        elPilihan.appendChild(btn);
    });
}

function nextDialog(){
    if(isTyping){
        clearInterval(typingInterval);
        isTyping = false;
        return;
    }

    dialogIndex++;
    showDialog(dialogIndex);
}

elBtnNext.onclick = nextDialog;

window.onload = initGame;