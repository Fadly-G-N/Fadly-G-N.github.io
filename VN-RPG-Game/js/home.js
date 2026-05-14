import {
    $,
    Auth,
    UI,
    Player
} from './core.js';

/**
 * home.js
 * Home Page Controller
 */

const initHome = () => {

    // cek login
    const user = Auth.checkAccess();

    if (!user) return;

    // ambil data terbaru
    const player = Player.getData();

    // render nama
    UI.renderUser(player);

    // render clock
    UI.initClock();

    // =========================
    // RENDER STATS
    // =========================
    const renderStats = () => {

        const data = Player.getData();

        if (!data) return;

        if ($("exp")) {

            $("exp").innerHTML =
                data.stats.exp;
        }

        if ($("lvl")) {

            $("lvl").innerHTML =
                data.stats.lvl;
        }

        if ($("stm")) {

            $("stm").innerHTML =
                data.stats.stm;
        }

        if ($("mny")) {

            $("mny").innerHTML =
                `<span>¥</span>${data.stats.mny}`;
        }
    };

    // =========================
    // DIALOG SYSTEM
    // =========================
    const showDialog = (
        name,
        text
    ) => {

        if ($("dialogName")) {

            $("dialogName").textContent =
                name;
        }

        if ($("dialogText")) {

            $("dialogText").textContent =
                text;
        }
    };

    // =========================
    // AUDIO SYSTEM
    // =========================
    const initBGM = () => {

        const bgm = $("bgm");

        if (!bgm) return;

        const startAudio = () => {

            bgm.volume = 0.5;

            bgm.play().catch(() => {});

            document.removeEventListener(
                "click",
                startAudio
            );

            document.removeEventListener(
                "touchstart",
                startAudio
            );
        };

        document.addEventListener(
            "click",
            startAudio
        );

        document.addEventListener(
            "touchstart",
            startAudio
        );
    };

    // =========================
    // INITIAL
    // =========================
    renderStats();

    showDialog(
        "Developer",
        "Maaf saat ini game masih dalam tahap pembuatan."
    );

    initBGM();

    // =========================
    // OPTIONAL TEST
    // =========================

    /*
    Player.addExp(25);
    Player.addMoney(100);
    Player.reduceStamina(5);

    renderStats();
    */
};

// =========================
// START
// =========================
document.addEventListener(
    "DOMContentLoaded",
    initHome
);