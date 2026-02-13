let Dexp = 0
let Dplt = 0
let Dmny = 0

const DisplayExp = document.getElementById("exp")
const DisplayPlt = document.getElementById("plt")
const DisplayMny = document.getElementById("mny")

function renderStats() {
  DisplayExp.innerHTML = `<span>EXP: </span>${Dexp}`
  DisplayPlt.innerHTML = `<span>PLT: </span>${Dplt}`
  DisplayMny.innerHTML = `<span>MNY: </span>${Dmny}`
}

renderStats()

const dialogText = document.getElementById("dialogText");
const dialogName = document.getElementById("dialogName");

function showDialog(name, text) {
  dialogName.textContent = name;
  dialogText.textContent = text;
}

/* Contoh */
showDialog("Dev. Admin F", "Maaf saat ini game masih dalam tahap pembuatan, hampir semua fitur belum di buat.");
