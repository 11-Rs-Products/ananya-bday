/**
 * js/main.js — Mithai Ki Dukan · Core Application Controller
 * Handles: navigation, content population, gentle entry logic,
 * sticker garden, quiet-corner text reveal, final birthday reveal.
 */

import CONFIG from './config.js?v=15';
import { initChaos } from './chaos.js?v=15';
import { initCRTAndThemes, initBGMPlayer, getConfetti } from './immersion.js?v=15';
import { initMiniRadio, radioEngine } from './radio.js?v=15';

// ── State ──────────────────────────────────────────────
let currentChapterId = 'ch-intro';
let currentStickerIndex = 0;

// ── Helpers ────────────────────────────────────────────
function shuffleArray(arr) {
    if (!Array.isArray(arr)) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Randomize images and stickers on load
    if (CONFIG.evidence) shuffleArray(CONFIG.evidence);
    if (CONFIG.stickers) shuffleArray(CONFIG.stickers);
    if (CONFIG.allStickers) shuffleArray(CONFIG.allStickers);

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
    bindSweetCompanion();
    bindEvidenceLightbox();
    initCRTAndThemes();
    initBGMPlayer();

    initMiniRadio();

    // Pause radio when any inline audio tag plays
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

    // Notify chaos / petal engine
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

    document.getElementById('btn-enter-archives')?.addEventListener('click', () => {
        goToChapter('ch-warning');
    });

    document.getElementById('btn-secret-file')?.addEventListener('click', () => {
        goToChapter('ch-secret');
        setTimeout(() => getConfetti().fire(160), 300);
    });

    document.getElementById('btn-cert-confetti')?.addEventListener('click', () => {
        getConfetti().fire(180);
    });

    document.getElementById('cert-display-img')?.addEventListener('click', () => {
        const lightbox = document.getElementById('evidence-lightbox');
        const lbImg = document.getElementById('lb-img');
        const lbCaption = document.getElementById('lb-caption');
        if (lightbox && lbImg) {
            lbImg.src = 'assets/images/cert.jpeg';
            if (lbCaption) lbCaption.textContent = 'Official Birthday Certificate — Mithai Ki Dukan ♡';
            lightbox.classList.remove('hidden');
        }
    });
}

// ── Gentle Entry / Warning ─────────────────────────────
function bindWarning() {
    const noBtn = document.getElementById('btn-warning-no');
    const yesBtn = document.getElementById('btn-warning-yes');
    const yesBtnOverlay = document.getElementById('btn-warning-yes-overlay');
    const overlay = document.getElementById('fuck-you-overlay');

    noBtn?.addEventListener('click', () => {
        // Show the gentle "oh no" overlay
        if (overlay) overlay.classList.remove('hidden');

        // After ~1.5s, reveal the YES button on the underlying card too
        setTimeout(() => {
            yesBtn?.classList.remove('hidden');
        }, 1500);

        noBtn.disabled = true;
        noBtn.style.opacity = '0.45';
    });

    const proceedToSubject = () => {
        if (overlay) overlay.classList.add('hidden');
        goToChapter('ch-subject');
    };

    yesBtn?.addEventListener('click', proceedToSubject);
    yesBtnOverlay?.addEventListener('click', proceedToSubject);
}

// ── Populate: Subject Profile ──────────────────────────
function populateSubject() {
    const tableContainer = document.getElementById('subject-info-table');
    const extraContainer = document.getElementById('subject-extra-content');
    const legacyContainer = document.getElementById('subject-content');
    if (!tableContainer && !extraContainer && !legacyContainer) return;
    const { name, aliases, occupation, specialAbilities, stats } = CONFIG.subject;

    const sweetIcons = ['🌸', '🍮', '✿', '🌿', '🌺'];

    const abilitiesHtml = specialAbilities.map((a, i) => `
        <li>
            <span class="ability-icon">${sweetIcons[i % sweetIcons.length]}</span>
            <span>${a}</span>
        </li>
    `).join('');

    const statsHtml = stats.map(s => {
        if (s.overflow) {
            return `
                <div class="stat-bar-container overflow-stat">
                    <div class="stat-bar-header">
                        <span class="stat-bar-label">
                            ${s.label}
                            <span class="overflow-label">✨ overflowing with love</span>
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



    const tableHtml = `
        <span class="label">Full name</span>
        <span class="value">${name}</span>
        <span class="label">Also known as</span>
        <span class="value">${aliases.join(', ')}</span>
        <span class="label">Known for</span>
        <span class="value">${occupation}</span>
    `;

    const extraHtml = `
        <div class="subject-extra-card">
            <h3 style="margin-bottom:0.8rem; font-style:italic;">What makes her wonderful</h3>
            <ul class="subject-abilities-list">${abilitiesHtml}</ul>
        </div>

        <div class="subject-extra-card">
            <p class="stats-heading">A little assessment</p>
            ${statsHtml}
        </div>
    `;

    const nameElement = document.querySelector('.dossier-subject-name');
    if (nameElement) {
        nameElement.textContent = name;
    }

    if (tableContainer) {
        tableContainer.innerHTML = tableHtml;
    }
    if (extraContainer) {
        extraContainer.innerHTML = extraHtml;
    }

    if (legacyContainer && !tableContainer) {
        legacyContainer.innerHTML = `
            <div class="subject-info-card">
                <div class="subject-info-grid">${tableHtml}</div>
            </div>
            ${extraHtml}
        `;
    }
}

// ── Populate: Witnesses / Friends ──────────────────────
function populateWitnesses() {
    const container = document.getElementById('witnesses-container');
    if (!container) return;
    container.innerHTML = '';

    const sweetEmojis = ['🌸', '🍡', '🍮', '🌺', '✿', '🌿'];

    CONFIG.witnesses.forEach((w, i) => {
        container.innerHTML += `
            <div class="witness-card">
                <img src="${w.image}"
                     alt="Photo of ${w.name}"
                     onerror="this.style.display='none'">
                <h4>${w.name}</h4>
                <span class="role-tag">${w.role}</span>
            </div>
        `;
    });
}

// ── Populate: Evidence / Memory Garden & One-by-One Showcase ──
let currentShowcaseIndex = 0;
let showcaseAutoplayTimer = null;

function populateEvidence() {
    initPhotoShowcase();
    populateEvidenceGrid();
}

function initPhotoShowcase() {
    const list = CONFIG.evidence || [];
    if (!list.length) return;

    const imgEl = document.getElementById('showcase-img');
    const titleEl = document.getElementById('showcase-title');
    const captionEl = document.getElementById('showcase-caption');
    const counterEl = document.getElementById('showcase-counter');
    const badgeEl = document.getElementById('showcase-badge');
    const prevBtn = document.getElementById('showcase-prev');
    const nextBtn = document.getElementById('showcase-next');
    const dotsWrap = document.getElementById('showcase-dots');
    const thumbsWrap = document.getElementById('showcase-thumbnails');
    const autoBtn = document.getElementById('showcase-autoplay-btn');
    const toggleBtn = document.getElementById('showcase-view-toggle');
    const singleView = document.getElementById('showcase-single-view');
    const gridView = document.getElementById('evidence-board');

    if (!imgEl) return;

    // Build Dots
    if (dotsWrap) {
        dotsWrap.innerHTML = list.map((item, i) => `
            <button class="showcase-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Go to photo ${i + 1}"></button>
        `).join('');

        dotsWrap.querySelectorAll('.showcase-dot').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                showPhotoAtIndex(idx);
            });
        });
    }

    // Build Thumbnails
    if (thumbsWrap) {
        thumbsWrap.innerHTML = list.map((item, i) => {
            const isTunTun = item.id.startsWith('tuntun');
            return `
                <div class="showcase-thumb-item ${i === 0 ? 'active' : ''} ${isTunTun ? 'is-tuntun' : ''}" data-idx="${i}" title="${item.title}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
            `;
        }).join('');

        thumbsWrap.querySelectorAll('.showcase-thumb-item').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                showPhotoAtIndex(idx);
            });
        });
    }

    function showPhotoAtIndex(idx, direction = 'next') {
        if (idx < 0) idx = list.length - 1;
        if (idx >= list.length) idx = 0;
        currentShowcaseIndex = idx;
        const item = list[idx];

        imgEl.classList.add('animating');
        setTimeout(() => {
            imgEl.src = item.image;
            imgEl.alt = item.title;
            if (titleEl) titleEl.textContent = item.title;
            if (captionEl) captionEl.textContent = item.context || '';
            if (counterEl) counterEl.textContent = `Photo ${idx + 1} of ${list.length}`;

            // Badge styling
            if (badgeEl) {
                if (item.id.startsWith('tuntun')) {
                    badgeEl.className = 'showcase-badge';
                    badgeEl.textContent = '🌸 Tun Tun Special';
                } else {
                    badgeEl.className = 'showcase-badge badge-memory';
                    badgeEl.textContent = '🌿 Memory Archive';
                }
            }

            imgEl.classList.remove('animating');
        }, 150);

        // Update Dots
        if (dotsWrap) {
            dotsWrap.querySelectorAll('.showcase-dot').forEach((d, i) => {
                d.classList.toggle('active', i === idx);
            });
        }

        // Update Thumbnails & scroll into view
        if (thumbsWrap) {
            thumbsWrap.querySelectorAll('.showcase-thumb-item').forEach((t, i) => {
                const isActive = (i === idx);
                t.classList.toggle('active', isActive);
                if (isActive) {
                    t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }
    }

    // Prev / Next Listeners
    if (prevBtn) {
        prevBtn.onclick = () => {
            stopAutoplay();
            showPhotoAtIndex(currentShowcaseIndex - 1, 'prev');
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            stopAutoplay();
            showPhotoAtIndex(currentShowcaseIndex + 1, 'next');
        };
    }

    // Lightbox on photo click
    imgEl.onclick = () => {
        const item = list[currentShowcaseIndex];
        if (item) openEvidenceLightbox(item.id);
    };

    // Keyboard navigation when chapter is active
    window.addEventListener('keydown', (e) => {
        const evidenceCh = document.getElementById('ch-evidence');
        if (!evidenceCh || evidenceCh.classList.contains('hidden')) return;
        const lightbox = document.getElementById('evidence-lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) return;

        if (e.key === 'ArrowLeft') {
            stopAutoplay();
            showPhotoAtIndex(currentShowcaseIndex - 1, 'prev');
        } else if (e.key === 'ArrowRight') {
            stopAutoplay();
            showPhotoAtIndex(currentShowcaseIndex + 1, 'next');
        }
    });

    // Autoplay toggle
    function stopAutoplay() {
        if (showcaseAutoplayTimer) {
            clearInterval(showcaseAutoplayTimer);
            showcaseAutoplayTimer = null;
            if (autoBtn) {
                autoBtn.classList.remove('active');
                autoBtn.innerHTML = '<span class="play-icon">▶</span> Auto';
            }
        }
    }

    if (autoBtn) {
        autoBtn.onclick = () => {
            if (showcaseAutoplayTimer) {
                stopAutoplay();
            } else {
                autoBtn.classList.add('active');
                autoBtn.innerHTML = '<span class="play-icon">⏸</span> Pause';
                showcaseAutoplayTimer = setInterval(() => {
                    showPhotoAtIndex(currentShowcaseIndex + 1, 'next');
                }, 3200);
            }
        };
    }

    // Grid View vs Single View toggle
    if (toggleBtn && singleView && gridView) {
        toggleBtn.onclick = () => {
            const isGrid = !gridView.classList.contains('hidden');
            if (isGrid) {
                gridView.classList.add('hidden');
                singleView.classList.remove('hidden');
                if (dotsWrap) dotsWrap.classList.remove('hidden');
                if (thumbsWrap) thumbsWrap.classList.remove('hidden');
                toggleBtn.innerHTML = '<span>▦</span> All Photos';
            } else {
                stopAutoplay();
                gridView.classList.remove('hidden');
                singleView.classList.add('hidden');
                if (dotsWrap) dotsWrap.classList.add('hidden');
                if (thumbsWrap) thumbsWrap.classList.add('hidden');
                toggleBtn.innerHTML = '<span>🔲</span> Single View';
            }
        };
    }

    // Initialize first photo
    showPhotoAtIndex(0);
}

function populateEvidenceGrid() {
    const container = document.getElementById('evidence-board');
    if (!container) return;
    container.innerHTML = '';

    CONFIG.evidence.forEach((ev, i) => {
        const isTunTun = ev.id.startsWith('tuntun');
        container.innerHTML += `
            <div class="polaroid" tabindex="0" title="Click to enlarge"
                 onclick="openEvidenceLightbox('${ev.id}')"
                 onkeydown="if(event.key==='Enter')openEvidenceLightbox('${ev.id}')">
                <div class="photo-area">
                    <img src="${ev.image}" alt="${ev.title}"
                         onerror="this.parentElement.innerHTML='🌸'">
                </div>
                <div class="polaroid-caption">${isTunTun ? '🌸 ' : ''}${ev.title}</div>
            </div>
        `;
    });
}

// ── Evidence Lightbox ──────────────────────────────────
function bindEvidenceLightbox() {
    const lightbox = document.getElementById('evidence-lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');

    if (!lightbox) return;

    lbClose?.addEventListener('click', () => lightbox.classList.add('hidden'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.add('hidden');
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            lightbox.classList.add('hidden');
        }
    });
}

window.openEvidenceLightbox = function (id) {
    const item = CONFIG.evidence.find(e => e.id === id);
    if (!item) return;
    const lightbox = document.getElementById('evidence-lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    if (!lightbox || !lbImg) return;
    lbImg.src = item.image;
    if (lbCaption) lbCaption.textContent = item.context || item.title;
    lightbox.classList.remove('hidden');
};

// (legacy global kept for any inline onclick in evidence board)
window.openEvidence = window.openEvidenceLightbox;

// ── Populate: Quiet Corner / Serious Part ──────────────
function populateSerious() {
    const container = document.getElementById('serious-text-container');
    if (!container) return;
    container.innerHTML = '';

    CONFIG.seriousPart.text.forEach(t => {
        const p = document.createElement('p');
        p.textContent = t;
        container.appendChild(p);
    });

    // Audio players
    const audioContainer = document.getElementById('serious-audio-players');
    if (audioContainer) {
        CONFIG.seriousPart.audioFiles.forEach((path, i) => {
            audioContainer.innerHTML += buildAudioPlayer(path, `A voice message for you`, `serious-audio-${i}`);
        });
    }
}

function triggerSeriousReveal() {
    const paras = document.querySelectorAll('#serious-text-container p');
    paras.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 500);
    });
}

// ── Populate: Lore / Mithai Ki Dukan Story ─────────────
function populateLore() {
    const container = document.getElementById('lore-timeline');
    if (!container) return;
    container.innerHTML = '';

    const recipe = CONFIG.rasgullaRecipe || [];
    const recipeEmojis = ['🥛', '🍋', '🍶', '🧺', '✨', '⚪', '🍯', '🔥', '💧', '🍧'];

    recipe.forEach((item, i) => {
        const emoji = recipeEmojis[i % recipeEmojis.length];
        container.innerHTML += `
            <div class="lore-recipe-item">
                <span class="lore-recipe-step-badge">${item.step || `Step ${i + 1}`}</span>
                <span class="lore-recipe-emoji">${emoji}</span>
                <span class="lore-recipe-name">${item.title}</span>
                <span class="lore-recipe-desc">${item.desc}</span>
            </div>
        `;
    });
}

// ── Populate: Future ───────────────────────────────────
function populateFuture() {
    const textContainer = document.getElementById('future-text-container');
    if (!textContainer) return;
    textContainer.innerHTML = '';

    CONFIG.futurePart.text.forEach(t => {
        const p = document.createElement('p');
        p.textContent = t;
        textContainer.appendChild(p);
    });

    const grid = document.getElementById('friends-grid');
    if (!grid) return;
    grid.innerHTML = '';
    CONFIG.witnesses.forEach(w => {
        grid.innerHTML += `<div class="friend-tag">${w.name} ♡</div>`;
    });
}

function triggerFutureReveal() {
    const paras = document.querySelectorAll('#future-text-container p');
    paras.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 600);
    });

    const tags = document.querySelectorAll('#friends-grid .friend-tag');
    tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        tag.style.transform = 'translateY(8px)';
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, (paras.length * 600) + i * 300);
    });
}

// ── Populate: Birthday Reveal ──────────────────────────
function populateBirthdayReveal() {
    // Title is already in HTML; update data-text for any typewriter effect
    const titleEl = document.getElementById('reveal-title');
    if (titleEl) {
        titleEl.setAttribute('data-text', CONFIG.birthdayReveal.title);
    }

    const container = document.getElementById('bday-audio-players');
    if (!container) return;
    CONFIG.birthdayReveal.audioFiles.forEach((path, i) => {
        container.innerHTML += buildAudioPlayer(path, `Birthday wish ${i + 1}`, `bday-audio-${i}`);
    });
}

// ── Sticker Garden Logic ────────────────────────────────
function bindStickerArchive() {
    const startActions = document.getElementById('sticker-start-actions');
    const startBtn = document.getElementById('btn-start-stickers');
    const jumpVaultBtn = document.getElementById('btn-jump-vault');
    const skipVaultBtn = document.getElementById('btn-skip-vault');
    const nextBtn = document.getElementById('btn-next-sticker');
    const prevBtn = document.getElementById('btn-prev-sticker');
    const displayArea = document.getElementById('sticker-display-area');
    const vaultArea = document.getElementById('sticker-vault-area');
    const randomBtn = document.getElementById('btn-random-sticker');

    currentStickerIndex = 0;

    startBtn?.addEventListener('click', () => {
        startActions?.classList.add('hidden');
        displayArea?.classList.remove('hidden');
        playSticker(0);
    });

    jumpVaultBtn?.addEventListener('click', () => {
        startActions?.classList.add('hidden');
        displayArea?.classList.add('hidden');
        revealVault();
    });

    skipVaultBtn?.addEventListener('click', () => {
        revealVault();
    });

    prevBtn?.addEventListener('click', () => {
        if (currentStickerIndex > 0) {
            currentStickerIndex--;
            playSticker(currentStickerIndex);
        }
    });

    nextBtn?.addEventListener('click', () => {
        currentStickerIndex++;
        if (currentStickerIndex < CONFIG.stickers.length) {
            playSticker(currentStickerIndex);
        } else {
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

        const imgWrapper = document.getElementById('sticker-img-wrapper');
        const imgEl = document.getElementById('current-sticker-img');
        const placeholderEl = document.getElementById('sticker-placeholder-emoji');
        const categoryEl = document.getElementById('sticker-category');
        const descEl = document.getElementById('sticker-description');
        const exhibitEl = document.getElementById('sticker-exhibit-num');

        // Reset visibility
        nextBtn?.classList.add('hidden');
        if (prevBtn) {
            prevBtn.classList.toggle('hidden', index === 0);
        }

        imgWrapper?.classList.remove('revealed');

        if (exhibitEl) exhibitEl.textContent = `Exhibit ${index + 1} of ${CONFIG.stickers.length}`;
        if (categoryEl) categoryEl.textContent = sticker.category || '';
        if (descEl) descEl.textContent = sticker.description || '';

        if (nextBtn) {
            if (index === CONFIG.stickers.length - 1) {
                nextBtn.innerHTML = `See all ${CONFIG.allStickers.length} stickers →`;
            } else {
                nextBtn.innerHTML = 'Continue →';
            }
        }

        revealImage(imgWrapper, imgEl, placeholderEl, sticker.image);
        nextBtn?.classList.remove('hidden');
    }

    function revealImage(imgWrapper, imgEl, placeholderEl, imageSrc) {
        if (!imgWrapper || !imgEl) return;
        // Small delay for the fade-in reveal effect
        requestAnimationFrame(() => {
            imgWrapper.classList.add('revealed');
            if (imageSrc) {
                imgEl.src = imageSrc;
                imgEl.style.display = 'block';
                if (placeholderEl) placeholderEl.style.display = 'none';
            }
        });
    }

    // Populate the complete vault grid
    populateStickerVault();

    randomBtn?.addEventListener('click', () => {
        const stickers = CONFIG.allStickers || [];
        if (!stickers.length) return;
        const randIndex = Math.floor(Math.random() * stickers.length);
        openStickerLightbox(stickers[randIndex], randIndex);
    });

    bindStickerLightbox();
}

// ── Populate Sticker Vault ──────────────────────────────
function populateStickerVault() {
    const grid = document.getElementById('sticker-vault-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allStickers = CONFIG.allStickers || [];
    allStickers.forEach((path, idx) => {
        const card = document.createElement('div');
        card.className = 'vault-sticker-card';
        // Gentle organic tilt
        const rot = (Math.sin(idx * 1.7) * 3).toFixed(1);
        card.style.setProperty('--rot', `${rot}deg`);
        card.title = `Sticker #${idx + 1}`;
        card.innerHTML = `
            <span class="vault-card-num">#${idx + 1}</span>
            <img src="${path}" alt="Sticker ${idx + 1}" loading="lazy">
        `;
        card.addEventListener('click', () => openStickerLightbox(path, idx));
        grid.appendChild(card);
    });
}

// ── Sticker Lightbox ────────────────────────────────────
let activeLightboxIndex = 0;

function openStickerLightbox(path, index) {
    activeLightboxIndex = index;
    const modal = document.getElementById('sticker-lightbox');
    const img = document.getElementById('lightbox-img');
    const count = document.getElementById('lightbox-counter');
    if (!modal || !img) return;

    img.src = path;
    if (count) count.textContent = `Sticker #${index + 1} of ${(CONFIG.allStickers || []).length}`;
    modal.classList.remove('hidden');
}

function closeStickerLightbox() {
    document.getElementById('sticker-lightbox')?.classList.add('hidden');
}

function bindStickerLightbox() {
    const modal = document.getElementById('sticker-lightbox');
    const closeBtn = document.getElementById('lightbox-close');

    closeBtn?.addEventListener('click', closeStickerLightbox);
    modal?.addEventListener('click', e => {
        if (e.target === modal) closeStickerLightbox();
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeStickerLightbox();
        }
    });
}

// ── Birthday Reveal Sequence ────────────────────────────
function bindRevealSequence() {
    let triggered = false;

    window.addEventListener('chapterChanged', e => {
        if (e.detail.chapterId === 'ch-reveal' && !triggered) {
            triggered = true;
            startRevealSequence();
        }
    });

    document.getElementById('btn-show-end')?.addEventListener('click', () => {
        document.getElementById('end-screen')?.classList.remove('hidden');
        document.getElementById('btn-show-end')?.classList.add('hidden');
    });

    document.getElementById('btn-fire-confetti')?.addEventListener('click', () => {
        getConfetti().fire(130);
    });
}

function startRevealSequence() {
    const loadingEl = document.getElementById('loading-sequence');
    const revealEl = document.getElementById('reveal-content');
    const fileMsg = document.getElementById('file-found-msg');
    const showEndBtn = document.getElementById('btn-show-end');

    const statusMessages = [
        'Gathering all the love…',
        'Arranging the sakura petals…',
        'Adding a little sweetness…',
        'Almost ready…',
        '🌸 Ready for you! 🌸'
    ];

    let msgIndex = 0;
    const statusEl = document.getElementById('loading-status');
    const msgInterval = setInterval(() => {
        if (msgIndex < statusMessages.length) {
            if (statusEl) statusEl.textContent = statusMessages[msgIndex++];
        } else {
            clearInterval(msgInterval);
        }
    }, 600);

    // After 3.2 seconds, show reveal
    setTimeout(() => {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (revealEl) revealEl.classList.remove('hidden');

        // Confetti celebration
        getConfetti().fire(180);

        // Gentle typewriter for the welcome message
        if (fileMsg) {
            typeWriter(fileMsg, '✿ A birthday message, made just for you ✿', 40, () => {
                if (showEndBtn) showEndBtn.style.display = 'inline-flex';
            });
        }
    }, 3200);
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

// ── Audio Player Builder ────────────────────────────────
function buildAudioPlayer(src, label, id) {
    return `
        <div class="audio-player-wrapper" id="${id}-wrapper">
            <p class="audio-player-label">${label}</p>
            <audio id="${id}"
                   src="${src}"
                   controls
                   preload="none"
                   aria-label="${label}">
                Your browser does not support audio.
            </audio>
        </div>
    `;
}

// ── Sweet Companion (replaces Archivist Mascot) ─────────
function bindSweetCompanion() {
    const widget = document.getElementById('archivist-widget');
    const bubbleText = document.getElementById('archivist-text');
    const avatar = document.getElementById('archivist-avatar');

    if (!widget || !bubbleText || !avatar) return;

    let clickCount = 0;

    const SWEET_NOTES = [
        "Every sweet has a story. This one is yours. ♡",
        " friends made this with a lot of love. You deserve it.",
        "The gulab jamun says: you are wonderful. ♡",
        "Did you know? 92 stickers were collected just for you.",
        "We've been your friends for a whole year, and we plan to keep going.",
        "The kaju katli says: don't worry about tomorrow today. ♡",
        "You make every moment a little sweeter, you know.",
        "The jalebi says: life is circular, come back to what brings you joy.",
        "You are loved. Very, very much. That's all.",
        "Happy birthday, Ananya. From all  of us. ♡"
    ];

    const SWEET_AVATARS = ['🍮', '🍡', '🥮', '🍬', '🌸', '🍮', '✿', '🌺'];
    const SPARK_EMOJIS = ['🌸', '✿', '🌺', '🍮', '💕', '⭐'];

    function spawnSpark(e) {
        const rect = widget.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.className = 'archivist-spark';
        spark.textContent = SPARK_EMOJIS[Math.floor(Math.random() * SPARK_EMOJIS.length)];

        const x = e?.clientX || (rect.left + rect.width / 2);
        const y = e?.clientY || (rect.top + rect.height / 2);
        const tx = (Math.random() - 0.5) * 100;
        const ty = -40 - Math.random() * 60;
        const tr = (Math.random() - 0.5) * 90;

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.setProperty('--tr', `${tr}deg`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
    }

    function handleInteraction(e) {
        clickCount++;

        // Rotate avatar
        avatar.textContent = SWEET_AVATARS[Math.floor(Math.random() * SWEET_AVATARS.length)];
        avatar.classList.remove('react-click');
        void avatar.offsetWidth;
        avatar.classList.add('react-click');

        // Update message
        const noteIndex = (clickCount - 1) % SWEET_NOTES.length;
        bubbleText.textContent = SWEET_NOTES[noteIndex];

        // Sparks
        const sparkCount = Math.min(2 + Math.floor(clickCount / 3), 5);
        for (let i = 0; i < sparkCount; i++) {
            setTimeout(() => spawnSpark(e), i * 60);
        }
    }

    widget.addEventListener('click', handleInteraction);
    widget.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction(e);
        }
    });
}
