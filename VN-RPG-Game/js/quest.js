import {
    $,
    Auth,
    UI,
    Player
} from './core.js';

/**
 * quest.js
 * Quest Page Controller
 */

// =========================
// QUEST DATABASE
// =========================
let QUEST_DATA = [];

// =========================
// LOAD QUEST JSON
// =========================
const loadQuestData = async () => {

    try {

        const response = await fetch(
            './data/quest.json'
        );

        QUEST_DATA = await response.json();

        renderQuest();

    } catch (err) {

        console.error(
            'Gagal load quest:',
            err
        );
    }
};

// =========================
// RENDER QUEST
// =========================
const renderQuest = () => {

    const container = $('questList');

    if (!container) return;

    container.innerHTML = QUEST_DATA.map(
        (quest) => {

            return `
                <article
                    class="quest-card"
                    data-id="${quest.id}"
                >

                    <div class="quest-header">
                        <h2 class="quest-title">
                            ${quest.title}
                        </h2>
                    </div>

                    <p class="quest-desc">
                        ${quest.desc}
                    </p>

                    <div class="quest-reward">

                        <span>
                            EXP +${quest.reward.exp}
                        </span>

                        <span>
                            ¥ ${quest.reward.mny}
                        </span>

                        <span>
                            STM ${quest.reward.stm}
                        </span>

                    </div>

                    <button
                        class="quest-btn"
                        data-id="${quest.id}"
                    >
                        Mulai Quest
                    </button>

                </article>
            `;
        }
    ).join('');

    setupQuestButton();
};

// =========================
// QUEST BUTTON EVENT
// =========================
const setupQuestButton = () => {

    const buttons = document.querySelectorAll(
        '.quest-btn'
    );

    buttons.forEach((btn) => {

        btn.addEventListener(
            'click',
            () => {

                const questId = Number(
                    btn.dataset.id
                );

                const quest = QUEST_DATA.find(
                    q => q.id === questId
                );

                if (!quest) return;

                startQuest(quest);
            }
        );
    });
};

// =========================
// START QUEST
// =========================
const startQuest = (quest) => {

    // QUEST MINIGAME
    if (
        quest.type === 'minigame' &&
        quest.target
    ) {

        localStorage.setItem(
            'activeQuest',
            JSON.stringify(quest)
        );

        window.location.href =
            quest.target;

        return;
    }

    // QUEST NORMAL
    completeQuest(quest);
};

// =========================
// COMPLETE QUEST
// =========================
const completeQuest = (quest) => {

    // tambah reward
    Player.addExp(
        quest.reward.exp
    );

    Player.addMoney(
        quest.reward.mny
    );

    // stamina cost
    if (quest.reward.stm < 0) {

        Player.reduceStamina(
            Math.abs(
                quest.reward.stm
            )
        );
    }

    alert(
        `Quest selesai!\n\n` +
        `+${quest.reward.exp} EXP\n` +
        `+${quest.reward.mny} MNY`
    );
};

// =========================
// INIT PAGE
// =========================
const initQuestPage = async () => {

    const user = Auth.checkAccess();

    if (!user) return;

    UI.renderUser(user);

    UI.initClock();

    await loadQuestData();
};

// =========================
// START
// =========================
document.addEventListener(
    'DOMContentLoaded',
    initQuestPage
);