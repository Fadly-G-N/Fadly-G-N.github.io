/**
 * core.js
 * Global Utility & Player System
 */

// =========================
// SELECTOR
// =========================
export const $ = (id) => document.getElementById(id);

// =========================
// AUTH SYSTEM
// =========================
export const Auth = {

    getUser: () => {
        return JSON.parse(
            localStorage.getItem("currentUser")
        );
    },

    logout: () => {

        localStorage.removeItem("currentUser");

        window.location.href =
            "./pages/login.html";
    },

    checkAccess: () => {

        const user = Auth.getUser();

        if (!user) {

            alert(
                "Silahkan login terlebih dahulu."
            );

            window.location.href =
                "./pages/login.html";

            return null;
        }

        return user;
    }
};

// =========================
// PLAYER SYSTEM
// =========================
export const Player = {

    // ambil data player
    getData: () => {

        const user = Auth.getUser();

        if (!user) return null;

        // default stats
        if (!user.stats) {

            user.stats = {
                exp: 0,
                lvl: 1,
                stm: 100,
                mny: 0
            };

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );
        }

        return user;
    },

    // simpan data
    saveData: (userData) => {

        // auto level
        userData.stats.lvl =
            Math.floor(
                userData.stats.exp / 100
            ) + 1;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(userData)
        );
    },

    // tambah exp
    addExp: (amount) => {

        const user = Player.getData();

        if (!user) return;

        user.stats.exp += amount;

        Player.saveData(user);
    },

    // tambah uang
    addMoney: (amount) => {

        const user = Player.getData();

        if (!user) return;

        user.stats.mny += amount;

        Player.saveData(user);
    },

    // kurangi stamina
    reduceStamina: (amount) => {

        const user = Player.getData();

        if (!user) return;

        user.stats.stm -= amount;

        if (user.stats.stm < 0) {
            user.stats.stm = 0;
        }

        Player.saveData(user);
    }
};

// =========================
// UI SYSTEM
// =========================
export const UI = {

    renderUser: (user) => {

        const nameEl = $("playerName");

        if (nameEl && user) {
            nameEl.textContent = user.name;
        }
    },

    initClock: () => {

        const elJam = $("jam");
        const elTanggal = $("tanggal");

        if (!elJam && !elTanggal) return;

        const hari = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"
        ];

        const bulan = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des"
        ];

        const updateWaktu = () => {

            const now = new Date();

            if (elJam) {

                elJam.textContent =
                    now.toTimeString()
                    .split(" ")[0];
            }

            if (elTanggal) {

                elTanggal.textContent =
                    `${hari[now.getDay()]}, ` +
                    `${now.getDate()} ` +
                    `${bulan[now.getMonth()]} ` +
                    `${now.getFullYear()}`;
            }
        };

        updateWaktu();

        setInterval(updateWaktu, 1000);
    }
};

// =========================
// LOGOUT LISTENER
// =========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        const logoutBtn = $("logoutBtn");

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                Auth.logout
            );
        }
    }
);