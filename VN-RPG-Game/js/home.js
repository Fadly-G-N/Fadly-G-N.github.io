import { $, Auth, UI, GameState } from './core.js';

/**
 * Home Page Controller
 */
const initHome = () => {
    const user = Auth.checkAccess();
    if (!user) return;

    UI.renderUser(user);
    UI.initClock();

    // Render Stats
    const renderStats = () => {
        if ($("exp")) $("exp").innerHTML = `<span>EXP: </span>${GameState.stats.exp}`;
        if ($("plt")) $("plt").innerHTML = `<span>PLT: </span>${GameState.stats.plt}`;
        if ($("mny")) $("mny").innerHTML = `<span>MNY: </span>${GameState.stats.mny}`;
    };

    // Dialog System
    const showDialog = (name, text) => {
        if ($("dialogName")) $("dialogName").textContent = name;
        if ($("dialogText")) $("dialogText").textContent = text;
    };

    // Audio System (BGM)
    const initBGM = () => {
        const bgm = $("bgm");
        if (!bgm) return;
        
        const startAudio = () => {
            bgm.volume = 0.5;
            bgm.play().catch(() => {});
            ['click', 'touchstart'].forEach(ev => document.removeEventListener(ev, startAudio));
        };

        ['click', 'touchstart'].forEach(ev => document.addEventListener(ev, startAudio));
    };

    renderStats();
    showDialog("Developer", "Maaf saat ini game masih dalam tahap pembuatan.");
    initBGM();
};

document.addEventListener("DOMContentLoaded", initHome);
