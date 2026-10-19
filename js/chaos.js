/**
 * js/chaos.js — Mithai Ki Dukan · Petal Garden Engine
 *
 * Replaces the old "raining cats and dogs" chaos engine with:
 * - Gentle sakura petals drifting across the screen
 * - Occasional soft floating sweet emoji companions
 * - Subtle floral popup notes on select chapters
 * - Everything pauses gracefully on calm/reveal chapters
 */

// ── Gentle popup notes ────────────────────────────────────────────────
const POPUP_MESSAGES = [
    { title: "A little note", body: "From  friends who love you very much. ♡" },
    { title: "Today", body: "It's your birthday. Be happy today, you deserve it." },
    { title: "The gulab jamun says:", body: "You are sweet, warm, and worth celebrating." },
    { title: "A reminder", body: "Your friends are always here for you. Always." },
    { title: "The kaju katli says:", body: "You shine. Don't let anyone dim your light." },
    { title: "A thought", body: "Birthdays are a good excuse to eat mithai. Have some." },
    { title: "The jalebi says:", body: "Sweet, spiral, and absolutely one of a kind. That's you." },
    { title: "Today's forecast:", body: "100% chance of love, laughter, and celebration." },
    { title: "A small secret:", body: "We've been planning this for a while. Happy birthday. ♡" },
];

// ── Petal and sweet symbols ────────────────────────────────────────────
const SAKURA_PETALS = ['🌸', '✿', '🌺', '🌼', '✾', '❀', '🌷', '🌹'];
const SWEET_FLOATERS = ['🍮', '🍡', '🥮', '🍬'];

// Mix mostly petals, occasional sweets
const RAIN_POOL = [
    ...Array(6).fill(null).map((_, i) => SAKURA_PETALS[i % SAKURA_PETALS.length]),
    ...SAKURA_PETALS,
    SWEET_FLOATERS[0],
    SWEET_FLOATERS[1],
];

const RAIN_COUNT = 28;

// Chapters where we pause petals (calm / intimate moments)
const CALM_CHAPTERS = new Set(['ch-serious', 'ch-future']);

// Chapters where petals are especially visible (celebration)
const FESTIVE_CHAPTERS = new Set(['ch-reveal', 'ch-secret']);

let chaosActive = true;
let popupTimers = [];

export function initChaos() {
    injectRainCSS();
    spawnPetals();
    startGentlePopups();
    observeChapterChanges();
}

// ── Petal CSS ──────────────────────────────────────────────────────────
function injectRainCSS() {
    if (document.getElementById('rain-css')) return;
    const s = document.createElement('style');
    s.id = 'rain-css';
    s.textContent = `
        .rain-drop {
            position: fixed;
            top: -60px;
            pointer-events: none;
            z-index: 1;
            user-select: none;
            will-change: transform, opacity;
            line-height: 1;
            display: block;
            white-space: nowrap;
            animation-name: petalFall;
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            animation-fill-mode: forwards;
            filter: drop-shadow(0 1px 3px rgba(244,167,192,0.3));
        }
        @keyframes petalFall {
            0%   {
                transform: translateX(0) rotate(0deg) scale(var(--scale, 1));
                opacity: 0;
                top: -60px;
            }
            8%   { opacity: var(--op, 0.5); }
            92%  { opacity: var(--op, 0.5); }
            100% {
                transform: translateX(var(--drift, 0px)) rotate(var(--spin, 180deg)) scale(var(--scale, 1));
                opacity: 0;
                top: 110vh;
            }
        }
    `;
    document.head.appendChild(s);
}

// ── Spawn sakura petals ────────────────────────────────────────────────
function spawnPetals() {
    const layer = document.getElementById('chaos-layer');
    if (!layer) return;
    layer.innerHTML = '';

    for (let i = 0; i < RAIN_COUNT; i++) {
        const el = document.createElement('span');
        el.className = 'rain-drop chaos-element';

        const symbol = RAIN_POOL[Math.floor(Math.random() * RAIN_POOL.length)];
        el.textContent = symbol;

        // Randomise each petal
        const left = Math.random() * 110 - 5;              // -5% to 105%
        const size = 0.7 + Math.random() * 0.9;            // 0.7–1.6rem
        const dur = 8 + Math.random() * 16;               // 8–24s per drop
        const delay = -(Math.random() * dur);               // stagger start
        const drift = (Math.random() - 0.5) * 180;          // horizontal drift
        const spin = 90 + Math.random() * 270;             // rotation degrees
        const opacity = 0.25 + Math.random() * 0.35;          // 0.25–0.6
        const scale = 0.6 + Math.random() * 0.8;            // size variation

        el.style.cssText = `
            left: ${left}%;
            font-size: ${size}rem;
            animation-duration: ${dur}s;
            animation-delay: ${delay}s;
            animation-iteration-count: infinite;
            --drift: ${drift}px;
            --spin: ${spin}deg;
            --op: ${opacity};
            --scale: ${scale};
        `;

        layer.appendChild(el);
    }
}

// ── Gentle popup messages ──────────────────────────────────────────────
function startGentlePopups() {
    // Only show popups occasionally — not on every chapter
    scheduleNextPopup();
}

function scheduleNextPopup() {
    const delay = 35000 + Math.random() * 40000; // 35–75s between popups
    const t = setTimeout(() => {
        if (chaosActive && !CALM_CHAPTERS.has(getCurrentChapter())) {
            showPopup();
        }
        scheduleNextPopup();
    }, delay);
    popupTimers.push(t);
}

function getCurrentChapter() {
    const active = document.querySelector('.chapter.active');
    return active?.id || '';
}

function showPopup() {
    const msg = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
    const popup = document.createElement('div');
    popup.className = 'chaos-popup';

    // Random position in a comfortable area
    const top = 20 + Math.random() * 50;
    const side = Math.random() > 0.5 ? 'right' : 'left';
    const pos = 20 + Math.random() * 20;

    popup.style.cssText = `
        top: ${top}vh;
        ${side}: ${pos}px;
    `;

    popup.innerHTML = `
        <div class="popup-header">🌸 ${msg.title}</div>
        <div class="popup-body">${msg.body}</div>
    `;

    document.body.appendChild(popup);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        popup.classList.add('popping-out');
        setTimeout(() => popup.remove(), 400);
    }, 5000);
}

// ── Chapter change observer ────────────────────────────────────────────
function observeChapterChanges() {
    window.addEventListener('chapterChanged', e => {
        const { chapterId } = e.detail;
        const layer = document.getElementById('chaos-layer');
        if (!layer) return;

        if (CALM_CHAPTERS.has(chapterId)) {
            // Fade petals out on intimate/quiet chapters
            chaosActive = false;
            layer.style.opacity = '0';
        } else if (FESTIVE_CHAPTERS.has(chapterId)) {
            // Extra visible petals on celebration chapters
            chaosActive = true;
            layer.style.opacity = '0.8';
        } else {
            // Normal
            chaosActive = true;
            layer.style.opacity = '1';
        }
    });
}
