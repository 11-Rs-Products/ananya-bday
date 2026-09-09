/**
 * js/chaos.js
 * The Chaos Engine — It is raining cats and dogs. Literally.
 * 35 cats and dogs fall from the sky continuously.
 * Random system popups appear and disappear.
 * Everything pauses gracefully on emotional chapters.
 */

const POPUP_MESSAGES = [
    { title: "WITS NEWSLETTER REJECTED", body: "WITS newsletter rejected by the council of niggaz" },
    { title: "SYSTEM WARNING", body: "PYTHON FAILED AGAIN" },
    { title: "INTERN UPDATE", body: "The dog accidentally unplugged something." },
    { title: "CLASSIFIED", body: "You were not meant to see this popup." },
    { title: "ALERT", body: "Evidence levels: critical. Proceed with caution." },
    { title: "BALLS DETECTED", body: "Unusual amount of balls found in this archive." },
    { title: "BALLS REPORT", body: "Current balls level: MAXIMUM." },
    { title: "BALLS REPORT", body: "Current balls level: MAXIMUM." },
    { title: "⚠️ BALLS WARNING", body: "Balls count exceeds safe threshold. Continuing anyway." },
    { title: "LAST1s BALLS DEPT.", body: "Filed under: Balls. Category: Balls. Priority: Balls." },
    { title: "ERROR: BALLS", body: "An unknown number of balls have gone missing. [FIND BALLS]" },
    { title: "INTERN REPORT", body: "The intern dropped the balls. All of them." },
    { title: "CAT ASSESSMENT", body: "The archivist has reviewed the balls. Verdict: balls." },
    { title: "BALLS AUDIT", body: "This document contains 47% more balls than legally required." },
    { title: "🐶 DOG ALERT", body: "Dog detected falling from sky. This is normal." },
    { title: "WEATHER UPDATE", body: "Current forecast: 100% chance of cats and dogs." },
    { title: "METEOROLOGY", body: "Scientists baffled by ongoing cat/dog precipitation." },
    { title: "🐾 PAWS ALERT", body: "Paw count exceeding acceptable limits per square metre." },
    { title: "RAIN REPORT", body: "It is raining. Cats. And dogs. Please shelter indoors." }
];

// The full cast of cats and dogs
const CHAOS_TEXTS = [
    "ERROR 404", "LAST1s", "???", "WHY", "AAAAAA", "SEND HELP",
    "wait what", "huh?", "bruh", "no thoughts", "404",
    "pagal hai vo aurat", "classified", "TOP SECRET", "DO NOT OPEN",
    "balls", "BALLS", "balls.", "balls???", "no balls",
    "absolute balls", "balls tbh", "balls detected", "maximum balls",
    "zero balls", "balls lol", "PURE BALLS", "balls energy",
    "nigga", "NIGGA", "nigga what", "nigga why", "nigga no",
    "pervert", "PERVERT", "certified pervert", "pervert detected",
    "pervert alert 🚨", "known pervert", "pervert on the loose"
];

const CATS = ["🐱", "😺", "😸", "🙀", "😻", "😾", "🐈", "🐈‍⬛", "😹", "😼"];
const DOGS = ["🐶", "🐕", "🦮", "🐩", "🐾", "🐕‍🦺", "🦴", "🐺"];
const RAIN_POOL = [...CATS, ...DOGS];

const RAIN_COUNT = 38;
const CALM_CHAPTERS = new Set(['ch-serious', 'ch-future', 'ch-reveal', 'ch-secret']);

let chaosActive = true;
let popupTimers = [];

export function initChaos() {
    injectRainCSS();
    spawnRain();
    startPopups();
    observeChapterChanges();
}

// ── Rain CSS ──────────────────────────────────────────────────────────
function injectRainCSS() {
    if (document.getElementById('rain-css')) return;
    const s = document.createElement('style');
    s.id = 'rain-css';
    // We define a generic fall keyframe; each drop gets custom CSS vars for drift and spin
    s.textContent = `
        .rain-drop {
            position: fixed;
            top: -100px;
            pointer-events: none;
            z-index: 1;
            user-select: none;
            will-change: transform, opacity;
            line-height: 1;
            display: block;
            font-family: 'Permanent Marker', cursive;
            white-space: nowrap;
            animation-name: catDogFall;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }
        @keyframes catDogFall {
            0%   { 
                transform: translateX(0) rotate(0deg); 
                opacity: 0; 
                top: -90px; 
            }
            8%   { opacity: var(--op, 0.55); }
            92%  { opacity: var(--op, 0.55); }
            100% { 
                transform: translateX(var(--drift, 0px)) rotate(var(--spin, 0deg));
                opacity: 0;
                top: 110vh;
            }
        }
    `;
    document.head.appendChild(s);
}

// ── Spawn Rain Drops ─────────────────────────────────────────────────
function spawnRain() {
    const container = document.getElementById('chaos-layer');
    if (!container) return;

    for (let i = 0; i < RAIN_COUNT; i++) {
        // Stagger each drop's start time across a 6-second window
        const initialDelay = (i / RAIN_COUNT) * 6000 + Math.random() * 1500;
        setTimeout(() => spawnOneDrop(container), initialDelay);
    }
}

function spawnOneDrop(container) {
    const el = document.createElement('div');
    el.classList.add('rain-drop');
    container.appendChild(el);
    scheduleDrop(el);
}

function scheduleDrop(el) {
    if (!chaosActive) {
        // Retry after 1s if chaos is paused
        setTimeout(() => scheduleDrop(el), 1000);
        return;
    }

    // 20% chance of a text word falling instead of a cat/dog
    const useText = Math.random() < 0.2;
    const content = useText
        ? CHAOS_TEXTS[Math.floor(Math.random() * CHAOS_TEXTS.length)]
        : RAIN_POOL[Math.floor(Math.random() * RAIN_POOL.length)];
    const size = useText
        ? (0.6 + Math.random() * 0.8)                  // text: 0.6rem – 1.4rem
        : (1.3 + Math.random() * 2.8);                 // emoji: 1.3rem – 4.1rem
    const leftPos = -5 + Math.random() * 110;
    const duration = 1.6 + Math.random() * 4;
    const drift = (Math.random() - 0.5) * 120;
    const spin = useText ? 0 : (Math.random() - 0.5) * 900; // text stays upright
    const opacity = 0.25 + Math.random() * 0.45;

    // Reset animation by removing and re-adding the element trick
    el.style.cssText = `
        position: fixed;
        top: -90px;
        left: ${leftPos}vw;
        font-size: ${size}rem;
        pointer-events: none;
        z-index: 1;
        user-select: none;
        will-change: transform, opacity;
        line-height: 1;
        --drift: ${drift}px;
        --spin: ${spin}deg;
        --op: ${opacity};
        animation: none;
    `;
    el.textContent = content;

    // Force reflow so animation restart works
    void el.offsetWidth;

    el.style.animation = `catDogFall ${duration}s linear forwards`;

    // When this drop finishes falling, recycle it with a small random gap
    const recycleDelay = duration * 1000 + Math.random() * 400;
    setTimeout(() => scheduleDrop(el), recycleDelay);
}

// ── System Popups ─────────────────────────────────────────────────────
function startPopups() {
    const ALL_POSITIONS = [
        'popup-top-left',
        'popup-top-right',
        'popup-bottom-right',
        'popup-center-right',
        'popup-bottom-left',
        'popup-center-left'
    ];

    function showPopup() {
        if (!chaosActive) return;

        const isRadioExpanded = document.body.classList.contains('radio-open') ||
            document.getElementById('mini-radio-widget')?.classList.contains('expanded');

        // If radio box is expanded, filter out bottom-left and center-left positions to avoid overlap
        let availablePositions = ALL_POSITIONS;
        if (isRadioExpanded) {
            availablePositions = ['popup-top-left', 'popup-top-right', 'popup-bottom-right', 'popup-center-right'];
        }

        const msg = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
        const pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];

        // Remove any existing popup in that position to avoid stacking
        document.querySelector(`.sys-popup.${pos}`)?.remove();

        const popup = document.createElement('div');
        popup.className = `sys-popup ${pos}`;
        popup.innerHTML = `
            <div class="popup-title">
                <span>${msg.title}</span>
                <span class="popup-close">✕</span>
            </div>
            <p>${msg.body}</p>
        `;
        document.body.appendChild(popup);

        popup.addEventListener('click', () => popup.remove());
        const t = setTimeout(() => popup.parentNode && popup.remove(), 4200);
        popupTimers.push(t);
    }

    function scheduleNext() {
        if (chaosActive) {
            showPopup();
        }
        // Increased frequency: next popup in 3.5 to 6 seconds
        const delay = 3500 + Math.random() * 2500;
        const t = setTimeout(scheduleNext, delay);
        popupTimers.push(t);
    }

    // First popup appears in 1.8s
    const initTimer = setTimeout(scheduleNext, 1800);
    popupTimers.push(initTimer);
}

// ── Chapter Awareness ─────────────────────────────────────────────────
function observeChapterChanges() {
    const container = document.getElementById('chaos-layer');

    window.addEventListener('chapterChanged', (e) => {
        const chapterId = e.detail.chapterId;

        if (CALM_CHAPTERS.has(chapterId)) {
            // STOP the rain — fade out and pause
            chaosActive = false;
            container.style.transition = 'opacity 1.2s ease';
            container.style.opacity = '0';
            document.querySelectorAll('.sys-popup').forEach(p => p.remove());
        } else {
            // RESUME the rain
            chaosActive = true;
            container.style.transition = 'opacity 0.5s ease';
            container.style.opacity = '1';
        }
    });
}
