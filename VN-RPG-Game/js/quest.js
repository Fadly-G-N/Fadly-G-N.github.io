import { $, Auth, UI } from './core.js';

/**
 * Quest Page Controller
 */
const QUEST_DATA = [
    { id: 1, title: "Bantu Warga Desa", desc: "Kumpulkan 10 kayu dari hutan.", reward: { exp: 50, mny: 100 } },
    { id: 2, title: "Berburu Slime", desc: "Kalahkan 5 slime di pinggir desa.", reward: { exp: 30, mny: 70 } },
    { id: 3, title: "Cari Herbal", desc: "Temukan 3 tanaman herbal.", reward: { exp: 20, mny: 50 } }
];

const initQuestPage = () => {
    const user = Auth.checkAccess();
    if (!user) return;

    UI.renderUser(user);
    UI.initClock();

    const container = $("questList");
    if (!container) return;

    container.innerHTML = QUEST_DATA.map(q => `
        <article class="quest-card" data-id="${q.id}">
            <h2 class="quest-title">${q.title}</h2>
            <p class="quest-desc">${q.desc}</p>
            <div class="quest-reward">
                <span>EXP: +${q.reward.exp}</span>
                <span>MNY: +${q.reward.mny}</span>
            </div>
        </article>
    `).join("");
};

document.addEventListener("DOMContentLoaded", initQuestPage);
