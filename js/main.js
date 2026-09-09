/**
 * js/main.js — Core application controller
 * Handles: navigation, content population, warning logic,
 * sticker archive, serious part text reveal, final reveal sequence.
 */

import CONFIG from './config.js?v=10';
import { initChaos } from './chaos.js?v=10';
import { initCRTAndThemes, initBGMPlayer, getConfetti } from './immersion.js?v=10';
import { initMiniRadio, radioEngine } from './radio.js?v=10';


// ── State ──────────────────────────────────────────────
let currentChapterId = 'ch-intro';
let currentStickerIndex = 0;

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initChaos();
    populateSubject();
    populateWitnesses();
    populateEvidence();
    populateSerious();
    populateLore();
    populateFuture();
    populateBirthdayReveal();
    bindNavigation();
    bindWarning();
    bindStickerArchive();
    bindRevealSequence();
    bindArchivistMascot();
    initCRTAndThemes();
    initBGMPlayer();

    initMiniRadio();
    
    // Pause radio engine when any audio tag is played
    document.addEventListener('play', (e) => {
        if (e.target.tagName === 'AUDIO' && radioEngine && radioEngine.isPlaying) {
            radioEngine.pause();
        }
    }, true);

});

// ── Navigation ─────────────────────────────────────────
function goToChapter(chapterId) {
    const prev = document.getElementById(currentChapterId);
    const next = document.getElementById(chapterId);
    if (!next) return;

    if (prev) {
        prev.classList.remove('active');
        prev.classList.add('hidden');
    }

    next.classList.remove('hidden');
    next.classList.add('active');
    currentChapterId = chapterId;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Notify chaos engine
    window.dispatchEvent(new CustomEvent('chapterChanged', { detail: { chapterId } }));

    // Chapter-specific triggers
    if (chapterId === 'ch-serious') triggerSeriousReveal();
    if (chapterId === 'ch-future') triggerFutureReveal();
}

function bindNavigation() {
    document.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', e => {
            const target = e.currentTarget.getAttribute('data-next');
            goToChapter(target);
        });
    });

    document.getElementById('btn-enter-archives').addEventListener('click', () => {
        goToChapter('ch-warning');
    });

    document.getElementById('btn-secret-file')?.addEventListener('click', () => {
        goToChapter('ch-secret');
    });
}

// ── Warning Screen Logic ───────────────────────────────
function bindWarning() {
    const noBtn = document.getElementById('btn-warning-no');
    const yesBtn = document.getElementById('btn-warning-yes');
    const fuckYouMsg = document.getElementById('fuck-you-msg');

    noBtn.addEventListener('click', () => {
        // Show FUCK YOU
        fuckYouMsg.classList.remove('hidden');

        // Disable NO to prevent spam (but don't hide it)
        noBtn.disabled = true;
        noBtn.style.opacity = '0.5';

        // After 1.5s reveal YES
        setTimeout(() => {
            yesBtn.classList.remove('hidden');
        }, 1500);
    });

    yesBtn.addEventListener('click', () => {
        goToChapter('ch-subject');
    });
}

// ── Populate: Subject Profile ──────────────────────────
function populateSubject() {
    const container = document.getElementById('subject-content');
    const { name, aliases, occupation, specialAbilities, stats } = CONFIG.subject;

    const abilitiesHtml = specialAbilities.map(a => `<li>${a}</li>`).join('');
    const statsHtml = stats.map(s => {
        if (s.overflow) {
            // Liquid dripping overflow bar
            return `
                <div class="stat-bar-container overflow-stat">
                    <div class="stat-bar-header">
                        <span class="stat-bar-label">
                            ${s.label}
                            <span class="overflow-label">⚠️ OVERFLOW (containment failed)</span>
                        </span>
                        <span class="stat-bar-value overflow-value">${s.percentage}%</span>
                    </div>
                    <div class="stat-overflow-wrapper">
                        <div class="stat-bar overflow-bar">
                            <div class="stat-fill overflow-fill" style="width:100%"></div>
                        </div>
                        <div class="liquid-drip-system" aria-hidden="true">
                            <div class="drip-hang hang-1"></div>
                            <div class="drip-hang hang-2"></div>
                            <div class="liquid-drop drop-1"></div>
                            <div class="liquid-drop drop-2"></div>
                            <div class="liquid-drop drop-3"></div>
                            <div class="liquid-drop drop-4"></div>
                            <div class="liquid-splash"></div>
                        </div>
                    </div>
                </div>
            `;
        }
        return `
            <div class="stat-bar-container">
                <div class="stat-bar-header">
                    <span class="stat-bar-label">${s.label}</span>
                    <span class="stat-bar-value">${s.percentage}%</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill" style="width:${Math.min(s.percentage, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <p style="margin-bottom:1.2rem;">
            <strong>FULL NAME:</strong> ${name}<br>
            <strong>KNOWN ALIASES:</strong> ${aliases.join(', ')}<br>
            <strong>OCCUPATION:</strong> ${occupation}
        </p>

        <h3>Special Abilities</h3>
        <ul style="margin-bottom:1.5rem;">${abilitiesHtml}</ul>

        <h3>Threat-Level Assessment</h3>
        ${statsHtml}
    `;
}

// ── Populate: Witnesses ────────────────────────────────
function populateWitnesses() {
    const container = document.getElementById('witnesses-container');
    container.innerHTML = '';

    CONFIG.witnesses.forEach(w => {
        container.innerHTML += `
            <div class="witness-card">
                <img src="${w.image}"
                     alt="Photo of ${w.name}"
                     onerror="this.style.display='none'">
                <h4>${w.name}</h4>
                <span class="role-tag">${w.role}</span>
                <p style="margin-top:0.5rem; font-size:0.8rem; opacity:0.65;">${w.context}</p>
                <p style="margin-top:0.5rem; font-style:italic; font-size:0.85rem;">"${w.description}"</p>
            </div>
        `;
    });
}

// ── Populate: Evidence Board ───────────────────────────
function populateEvidence() {
    const container = document.getElementById('evidence-board');
    container.innerHTML = '';

    CONFIG.evidence.forEach(ev => {
        container.innerHTML += `
            <div class="polaroid" tabindex="0" title="${ev.title}" onclick="openEvidence('${ev.id}')">
                <div class="photo-area">
                    <img src="${ev.image}" alt="${ev.title}"
                         onerror="this.parentElement.innerHTML='📷'">
                </div>
                <div class="polaroid-caption">
                    <strong>${ev.title}</strong><br>
                    ${ev.context}
                </div>
                <p class="evidence-label">${ev.importance}</p>
            </div>
        `;
    });
}

window.openEvidence = function(id) {
    const item = CONFIG.evidence.find(e => e.id === id);
    if (!item) return;
    // Simple expand — for now just an alert; can be upgraded to a modal
    alert(`${item.title}\n\n${item.context}\n\nImportance: ${item.importance}`);
};

// ── Populate: Serious Part ─────────────────────────────
function populateSerious() {
    const container = document.getElementById('serious-text-container');
    container.innerHTML = '';

    CONFIG.seriousPart.text.forEach(t => {
        const p = document.createElement('p');
        p.textContent = t;
        container.appendChild(p);
    });

    // Audio players
    const audioContainer = document.getElementById('serious-audio-players');
    CONFIG.seriousPart.audioFiles.forEach((path, i) => {
        audioContainer.innerHTML += buildAudioPlayer(path, `Motivation Message ${i + 1}`, `serious-audio-${i}`);
    });
}

function triggerSeriousReveal() {
    const paras = document.querySelectorAll('#serious-text-container p');
    paras.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 500);
    });
}

// ── Populate: Lore Timeline ────────────────────────────
function populateLore() {
    const container = document.getElementById('lore-timeline');
    container.innerHTML = '';

    CONFIG.last1sLore.forEach((item, i) => {
        const emoji = ['🌱', '🤔', '🏆', '🎪', '😅', '⭐', '🎂'][i] || '→';
        container.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div>
                    <span style="font-size:1.2rem;">${emoji}</span>
                    <strong> ${item}</strong>
                </div>
            </div>
        `;
    });
}

// ── Populate: Future ───────────────────────────────────
function populateFuture() {
    const textContainer = document.getElementById('future-text-container');
    textContainer.innerHTML = '';
    CONFIG.futurePart.text.forEach(t => {
        const p = document.createElement('p');
        p.textContent = t;
        textContainer.appendChild(p);
    });

    const grid = document.getElementById('friends-grid');
    grid.innerHTML = '';
    CONFIG.witnesses.forEach(w => {
        grid.innerHTML += `<div class="friend-tag">${w.name}</div>`;
    });
}

function triggerFutureReveal() {
    const paras = document.querySelectorAll('#future-text-container p');
    paras.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 600);
    });

    // Friends appear after text
    const tags = document.querySelectorAll('#friends-grid .friend-tag');
    tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { tag.style.opacity = '1'; }, (paras.length * 600) + i * 300);
    });
}

// ── Populate: Birthday Reveal ──────────────────────────
function populateBirthdayReveal() {
    document.getElementById('reveal-title').setAttribute('data-text', CONFIG.birthdayReveal.title);

    const container = document.getElementById('bday-audio-players');
    CONFIG.birthdayReveal.audioFiles.forEach((path, i) => {
        container.innerHTML += buildAudioPlayer(path, `Birthday Wish ${i + 1}`, `bday-audio-${i}`);
    });
}

// ── Sticker Archive & Vault Logic ──────────────────────
function bindStickerArchive() {
    const startActions   = document.getElementById('sticker-start-actions');
    const startBtn       = document.getElementById('btn-start-stickers');
    const jumpVaultBtn   = document.getElementById('btn-jump-vault');
    const skipVaultBtn   = document.getElementById('btn-skip-vault');
    const finishBtn      = document.getElementById('btn-finish-stickers');
    const nextBtn        = document.getElementById('btn-next-sticker');
    const prevBtn        = document.getElementById('btn-prev-sticker');
    const displayArea    = document.getElementById('sticker-display-area');
    const vaultArea      = document.getElementById('sticker-vault-area');
    const randomBtn      = document.getElementById('btn-random-sticker');

    currentStickerIndex = 0;

    // Start curated investigation
    startBtn?.addEventListener('click', () => {
        startActions?.classList.add('hidden');
        displayArea?.classList.remove('hidden');
        playSticker(0);
    });

    // Jump directly to all 69 stickers
    jumpVaultBtn?.addEventListener('click', () => {
        startActions?.classList.add('hidden');
        displayArea?.classList.add('hidden');
        revealVault();
    });

    // Skip to vault from within exhibit
    skipVaultBtn?.addEventListener('click', () => {
        revealVault();
    });

    // Previous exhibit
    prevBtn?.addEventListener('click', () => {
        if (currentStickerIndex > 0) {
            currentStickerIndex--;
            playSticker(currentStickerIndex);
        }
    });

    // Next exhibit
    nextBtn?.addEventListener('click', () => {
        currentStickerIndex++;
        if (currentStickerIndex < CONFIG.stickers.length) {
            playSticker(currentStickerIndex);
        } else {
            // Reached the end of curated exhibits -> reveal full vault!
            revealVault();
        }
    });

    function revealVault() {
        displayArea?.classList.add('hidden');
        vaultArea?.classList.remove('hidden');
        vaultArea?.scrollIntoView({ behavior: 'smooth' });
    }

    function playSticker(index) {
        const sticker = CONFIG.stickers[index];
        if (!sticker) return;

        const imgWrapper   = document.getElementById('sticker-img-wrapper');
        const imgEl        = document.getElementById('current-sticker-img');
        const placeholderEl= document.getElementById('sticker-placeholder-emoji');
        const categoryEl   = document.getElementById('sticker-category');
        const descEl       = document.getElementById('sticker-description');
        const exhibitEl    = document.getElementById('sticker-exhibit-num');

        // Reset
        nextBtn?.classList.add('hidden');
        if (prevBtn) {
            if (index > 0) {
                prevBtn.classList.remove('hidden');
            } else {
                prevBtn.classList.add('hidden');
            }
        }

        imgWrapper?.classList.remove('revealed');

        if (exhibitEl) exhibitEl.textContent = ;
        if (categoryEl) categoryEl.textContent = sticker.category;
        if (descEl) descEl.textContent = sticker.description;

        // Update button text on last exhibit
        if (nextBtn) {
            if (index === CONFIG.stickers.length - 1) {
                nextBtn.innerHTML = 'UNLOCK FULL VAULT (69 STICKERS) &rarr;';
            } else {
                nextBtn.innerHTML = 'NEXT EXHIBIT &rarr;';
            }
        }

        revealImage(imgWrapper, imgEl, placeholderEl, sticker.image);
        nextBtn?.classList.remove('hidden');
    }

    function revealImage(imgWrapper, imgEl, placeholderEl, imageSrc) {
        if (!imgWrapper || !imgEl) return;
        imgWrapper.classList.add('revealed');
        if (imageSrc) {
            imgEl.src = imageSrc;
            imgEl.style.display = 'block';
            if (placeholderEl) placeholderEl.style.display = 'none';
        }
    }


    // Populate all 69 stickers in the vault grid
    populateStickerVault();

    // Random sticker picker button
    randomBtn?.addEventListener('click', () => {
        const stickers = CONFIG.allStickers || [];
        if (!stickers.length) return;
        const randIndex = Math.floor(Math.random() * stickers.length);
        openStickerLightbox(stickers[randIndex], randIndex);
    });

    // Lightbox handlers
    bindStickerLightbox();
}

// ── Populate 69-Sticker Vault ──────────────────────────
function populateStickerVault() {
    const grid = document.getElementById('sticker-vault-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allStickers = CONFIG.allStickers || [];
    allStickers.forEach((path, idx) => {
        const card = document.createElement('div');
        card.className = 'vault-sticker-card';
        // Give each card a subtle organic tilt between -4deg and +4deg
        const rot = (Math.sin(idx * 1.7) * 4).toFixed(1);
        card.style.setProperty('--rot', `${rot}deg`);
        card.title = `Sticker #${idx + 1} — Click to inspect`;
        card.innerHTML = `
            <span class="vault-card-num">#${idx + 1}</span>
            <img src="${path}" alt="Classified Sticker ${idx + 1}" loading="lazy">
        `;
        card.addEventListener('click', () => {
            openStickerLightbox(path, idx);
        });
        grid.appendChild(card);
    });
}

// ── Sticker Lightbox Modal ─────────────────────────────
let activeLightboxIndex = 0;

function openStickerLightbox(path, index) {
    activeLightboxIndex = index;
    const modal = document.getElementById('sticker-lightbox');
    const img   = document.getElementById('lightbox-img');
    const count = document.getElementById('lightbox-counter');
    if (!modal || !img) return;

    img.src = path;
    if (count) count.textContent = `STICKER #${index + 1} OF ${(CONFIG.allStickers || []).length}`;
    modal.classList.remove('hidden');
}

function closeStickerLightbox() {
    const modal = document.getElementById('sticker-lightbox');
    modal?.classList.add('hidden');
}

function bindStickerLightbox() {
    const modal = document.getElementById('sticker-lightbox');
    const closeBtn = document.getElementById('lightbox-close');

    closeBtn?.addEventListener('click', closeStickerLightbox);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeStickerLightbox();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeStickerLightbox();
        }
    });
}

// ── Final Reveal Sequence ──────────────────────────────
function bindRevealSequence() {
    const revealChapter = document.getElementById('ch-reveal');
    let triggered = false;

    window.addEventListener('chapterChanged', (e) => {
        if (e.detail.chapterId === 'ch-reveal' && !triggered) {
            triggered = true;
            startRevealSequence();
        }
    });

    document.getElementById('btn-show-end')?.addEventListener('click', () => {
        document.getElementById('end-screen').classList.remove('hidden');
        document.getElementById('btn-show-end').classList.add('hidden');
    });

    document.getElementById('btn-fire-confetti')?.addEventListener('click', () => {
        getConfetti().fire(130);
    });
}

function startRevealSequence() {
    const loadingEl = document.getElementById('loading-sequence');
    const revealEl  = document.getElementById('reveal-content');
    const fileMsg   = document.getElementById('file-found-msg');
    const showEndBtn= document.getElementById('btn-show-end');

    const statusMessages = [
        'Decrypting classified birthday archives...',
        'Loading evidence database...',
        'Compiling six years of chaos...',
        'Almost there...',
        'FILE FOUND ✓'
    ];

    let msgIndex = 0;
    const statusEl = document.getElementById('loading-status');
    const msgInterval = setInterval(() => {
        if (msgIndex < statusMessages.length) {
            statusEl.textContent = statusMessages[msgIndex++];
        } else {
            clearInterval(msgInterval);
        }
    }, 600);

    // After 3 seconds, hide loading and show reveal
    setTimeout(() => {
        loadingEl.classList.add('hidden');
        revealEl.classList.remove('hidden');

        // Launch Celebration Confetti Cannon!
        getConfetti().fire(180);

        // Typewriter effect for "FILE FOUND" message
        typeWriter(fileMsg, `> FILE FOUND: BIRTHDAY_GIRL.EXE`, 50, () => {
            showEndBtn.style.display = 'inline-flex';
        });
    }, 3100);
}

function typeWriter(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
        }
    }, speed);
}

// ── Audio Player Builder ───────────────────────────────
/**
 * Builds an accessible <audio> player UI.
 * Falls back gracefully if file doesn't exist.
 */
function buildAudioPlayer(src, label, id) {
    return `
        <div style="margin: 0.8rem 0; text-align: center;" id="${id}-wrapper">
            <p style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 0.4rem;">${label}</p>
            <audio id="${id}"
                   src="${src}"
                   controls
                   style="width: min(300px, 90vw);"
                   preload="none"
                   aria-label="${label}">
                Your browser does not support audio.
            </audio>
        </div>
    `;
}

// ── Interactive Archivist Mascot ───────────────────────
function bindArchivistMascot() {
    const widget = document.getElementById('archivist-widget');
    const bubbleText = document.getElementById('archivist-text');
    const bubbleTag = document.getElementById('archivist-tag');
    const bubbleCount = document.getElementById('archivist-count');
    const avatar = document.getElementById('archivist-avatar');

    if (!widget || !bubbleText || !avatar) return;

    let clickCount = 0;
    let quoteIndex = 0;

    const ARCHIVIST_QUOTES = [
        "Psst... I have catalogued every sticker in this database. 98% are completely unhinged.",
        "Archivist Log: Extreme balls detected in sector 4. Proceed at your own peril.",
        "I was hired to maintain order among the six witnesses. I have miserably failed.",
        "CLASSIFIED INTEL: The WITS newsletter was rejected, but this archive is 100% verified.",
        "Warning: The subject's sticker deployment rate exceeds international safety standards.",
        "My surveillance report indicates zero normal conversations have occurred here.",
        "Meow. (Archivist Translation: Prepare your emotional stability for the final chapter).",
        "Top Secret: Six people spent way too much time compiling this evidence for Ananya.",
        "File #042 status: 100% chance of falling cats, dogs, and questionable memories.",
        "Stop interrogating me and hit 'ENTER THE ARCHIVES' already!"
    ];

    const AVATARS = ["🕵️🐱", "🔍😸", "⚡🙀", "🕶️😼", "📂😹", "🚨😾", "👑😺", "🛸🐱"];
    const PARTICLES = ["🐾", "✨", "🔍", "⭐", "📂", "🐱", "🐶"];

    // Procedural Web Audio Synth for retro squeaks/meows
    let audioCtx = null;
    function playArchivistBeep(frequency = 580, type = 'sine') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            
            // Cute pitch sweep (meow / chirp effect)
            const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(frequency, now);
            osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + 0.18);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {
            // Audio context not allowed or unsupported; graceful ignore
        }
    }

    // Spawn cute floating particle
    function spawnSpark(e) {
        const rect = widget.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.className = 'archivist-spark';
        spark.textContent = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];

        const x = (e?.clientX || rect.left + rect.width / 2);
        const y = (e?.clientY || rect.top + rect.height / 2);

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const tx = (Math.random() - 0.5) * 120;
        const ty = -40 - Math.random() * 60;
        const tr = (Math.random() - 0.5) * 90;

        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.setProperty('--tr', `${tr}deg`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 750);
    }

    function handleInteraction(e) {
        clickCount++;
        quoteIndex = (quoteIndex + 1) % ARCHIVIST_QUOTES.length;

        // Sound tone variation based on clicks
        const baseFreq = 520 + (clickCount % 5) * 70;
        playArchivistBeep(baseFreq, clickCount % 3 === 0 ? 'triangle' : 'sine');

        // Avatar change & reaction animation
        avatar.textContent = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        avatar.classList.remove('react-click');
        void avatar.offsetWidth; // trigger reflow
        avatar.classList.add('react-click');

        // Update bubble text & count
        if (bubbleCount) bubbleCount.textContent = `CLICKS: ${clickCount}`;
        if (bubbleTag) {
            const logNum = String(clickCount).padStart(3, '0');
            bubbleTag.textContent = clickCount >= 10 ? `🚨 ARCHIVIST OVERLOAD #${logNum}` : `ARCHIVIST LOG #${logNum}`;
        }

        // Special milestone messages
        if (clickCount === 5) {
            bubbleText.textContent = "⚠️ EVIDENCE OVERLOAD: The Archivist is getting overwhelmed by your curiosity!";
        } else if (clickCount >= 10 && clickCount % 5 === 0) {
            bubbleText.textContent = "💥 MAXIMUM CHAOS REACHED: Enter the archives before the cat explodes!";
        } else {
            bubbleText.textContent = ARCHIVIST_QUOTES[quoteIndex];
        }

        // Spawn multiple particles
        for (let i = 0; i < (clickCount >= 5 ? 4 : 2); i++) {
            setTimeout(() => spawnSpark(e), i * 60);
        }
    }

    widget.addEventListener('click', handleInteraction);
    widget.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction(e);
        }
    });
}

