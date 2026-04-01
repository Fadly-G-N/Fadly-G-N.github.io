/**
 * core.js - Global State & Shared Utilities
 * @author Professional Developer
 */

// Global State Management
export const GameState = {
    stats: { exp: 0, plt: 0, mny: 0 }
};

// Selectors Utility
export const $ = (id) => document.getElementById(id);

// Auth Module
export const Auth = {
    getUser: () => JSON.parse(localStorage.getItem("currentUser")),
    logout: () => {
        localStorage.removeItem("currentUser");
        window.location.href = "./pages/login.html";
    },
    checkAccess: () => {
        const user = Auth.getUser();
        if (!user) {
            alert("Silahkan login terlebih dahulu.");
            window.location.href = "./pages/login.html";
            return null;
        }
        return user;
    }
};

// UI Components
export const UI = {
    renderUser: (user) => {
        const nameEl = $("playerName");
        if (nameEl && user) nameEl.textContent = user.name;
    },
    initClock: () => {
        const elJam = $("jam");
        const elTanggal = $("tanggal");
        if (!elJam && !elTanggal) return;

        const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
        const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

        const updateWaktu = () => {
            const now = new Date();
            if (elJam) elJam.textContent = now.toTimeString().split(' ')[0];
            if (elTanggal) {
                elTanggal.textContent = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
            }
        };

        setInterval(updateWaktu, 1000);
        updateWaktu();
    }
};

// Setup Logout Listener
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = $("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", Auth.logout);
});
