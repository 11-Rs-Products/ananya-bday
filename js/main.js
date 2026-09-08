import CONFIG from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    populateContent();
    setupWarningLogic();
    setupStickerArchiveLogic();
    setupAudioSystemPlaceholders();
    setupFinalReveal();
});

function initNavigation() {
    const nextBtns = document.querySelectorAll('.next-chapter-btn');
    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextId = e.target.getAttribute('data-next');
            goToChapter(nextId);
        });
    });

    document.getElementById('btn-enter-archives').addEventListener('click', () => {
        goToChapter('ch-warning');
    });

    document.getElementById('btn-secret-file').addEventListener('click', () => {
        goToChapter('ch-secret');
    });
}

function goToChapter(chapterId) {
    document.querySelectorAll('.chapter').forEach(ch => ch.classList.remove('active', 'hidden'));
    document.querySelectorAll('.chapter').forEach(ch => {
        if(ch.id !== chapterId) {
            ch.classList.add('hidden');
        } else {
            ch.classList.add('active');
        }
    });
    
    // Auto-scroll to top when chapter changes
    window.scrollTo(0,0);
}

function populateContent() {
    // Subject Profile
    const subContainer = document.getElementById('subject-content');
    let statsHtml = CONFIG.subject.stats.map(s => `
        <div class="stat-bar-container">
            <p>${s.label}</p>
            <div class="stat-bar"><div class="stat-fill" style="width: ${s.percentage}%"></div></div>
        </div>
    `).join('');
    
    subContainer.innerHTML = `
        <br>
        <h3>Known Aliases:</h3>
        <p>${CONFIG.subject.aliases.join(', ')}</p>
        <br>
        <h3>Occupation:</h3>
        <p>${CONFIG.subject.occupation}</p>
        <br>
        <h3>Special Abilities:</h3>
        <ul>${CONFIG.subject.specialAbilities.map(a => `<li>${a}</li>`).join('')}</ul>
        <br>
        <h3>Statistics:</h3>
        ${statsHtml}
        <br>
    `;

    // Witnesses
    const witContainer = document.getElementById('witnesses-container');
    CONFIG.witnesses.forEach(w => {
        witContainer.innerHTML += `
            <div class="witness-card" style="border:1px solid #eee; padding:10px; margin-bottom:10px;">
                <img src="${w.image}" alt="${w.name}" style="width:100px; height:100px; background:#ccc; border-radius:50%;">
                <h4>${w.name}</h4>
                <p><strong>${w.role}</strong></p>
                <p><em>${w.context}</em></p>
                <p>"${w.description}"</p>
            </div>
        `;
    });

    // Evidence Board
    const evContainer = document.getElementById('evidence-board');
    CONFIG.evidence.forEach(e => {
        evContainer.innerHTML += `
            <div class="polaroid">
                <img src="${e.image}" alt="Evidence" style="min-height: 150px; background:#eee;">
                <div class="polaroid-caption">
                    <strong>${e.title}</strong><br>
                    ${e.context}
                </div>
            </div>
        `;
    });

    // Serious Part Text
    const serContainer = document.getElementById('serious-text-container');
    CONFIG.seriousPart.text.forEach(t => {
        serContainer.innerHTML += `<p style="margin-bottom: 1rem;">${t}</p>`;
    });

    // Lore Timeline
    const loreContainer = document.getElementById('lore-timeline');
    CONFIG.last1sLore.forEach((l, index) => {
        loreContainer.innerHTML += `<div class="timeline-item"><strong>Stage ${index + 1}:</strong> ${l}</div>`;
    });

    // Future Part Text
    const futContainer = document.getElementById('future-text-container');
    CONFIG.futurePart.text.forEach(t => {
        futContainer.innerHTML += `<p style="margin-bottom: 1rem;">${t}</p>`;
    });
    const friendsGrid = document.getElementById('friends-grid');
    CONFIG.witnesses.forEach(w => {
        friendsGrid.innerHTML += `<div style="padding: 10px; border: 1px solid #fff;"><strong>${w.name}</strong></div>`;
    });

    // Reveal
    document.getElementById('reveal-title').innerHTML = CONFIG.birthdayReveal.title;
}

function setupWarningLogic() {
    const noBtn = document.getElementById('btn-warning-no');
    const yesBtn = document.getElementById('btn-warning-yes');
    const fuckYouMsg = document.getElementById('fuck-you-msg');

    noBtn.addEventListener('click', () => {
        // Show FUCK YOU
        fuckYouMsg.classList.remove('hidden');
        
        // Wait 1.5 seconds, then show YES
        setTimeout(() => {
            yesBtn.classList.remove('hidden');
        }, 1500);
    });

    yesBtn.addEventListener('click', () => {
        goToChapter('ch-subject');
    });
}

function setupStickerArchiveLogic() {
    const startBtn = document.getElementById('btn-start-stickers');
    const finishBtn = document.getElementById('btn-finish-stickers');
    const nextStickerBtn = document.getElementById('btn-next-sticker');
    const displayArea = document.getElementById('sticker-display-area');
    
    let currentStickerIndex = 0;

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        displayArea.classList.remove('hidden');
        playStickerScene(0);
    });

    nextStickerBtn.addEventListener('click', () => {
        currentStickerIndex++;
        if(currentStickerIndex < CONFIG.stickers.length) {
            playStickerScene(currentStickerIndex);
        } else {
            // Finished
            displayArea.classList.add('hidden');
            finishBtn.classList.remove('hidden');
        }
    });

    function playStickerScene(index) {
        const sticker = CONFIG.stickers[index];
        nextStickerBtn.classList.add('hidden');
        
        document.getElementById('sticker-category').innerText = `EXHIBIT: ${sticker.category}`;
        document.getElementById('current-sticker-img').src = sticker.image;
        document.getElementById('sticker-description').innerText = sticker.description;
        
        const audioStatus = document.getElementById('sticker-audio-status');
        audioStatus.classList.remove('hidden');
        audioStatus.innerText = `[AUDIO PLAYING: ${sticker.narrationText}]`;

        // Simulate audio duration (3 seconds placeholder)
        setTimeout(() => {
            audioStatus.classList.add('hidden');
            nextStickerBtn.classList.remove('hidden');
        }, 3000);
    }
}

function setupAudioSystemPlaceholders() {
    // Serious audio play button
    const playSeriousBtn = document.getElementById('btn-play-serious-audio');
    playSeriousBtn.addEventListener('click', () => {
        document.getElementById('serious-audio-status').innerText = "[AUDIO PLAYING: Motivation Messages...]";
        playSeriousBtn.disabled = true;
        
        setTimeout(() => {
            document.getElementById('serious-audio-status').innerText = "[Audio Finished]";
            playSeriousBtn.disabled = false;
        }, 3000);
    });
}

function setupFinalReveal() {
    const revealChapter = document.getElementById('ch-reveal');
    // We need an observer or event when this chapter becomes active to start loading bar
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.target.classList.contains('active')) {
                // It's active, wait for 3s CSS animation then reveal content
                setTimeout(() => {
                    document.getElementById('loading-sequence').classList.add('hidden');
                    document.getElementById('reveal-content').classList.remove('hidden');
                }, 3000);
            }
        });
    });

    observer.observe(revealChapter, { attributes: true, attributeFilter: ['class'] });

    document.getElementById('btn-play-bday-audio').addEventListener('click', () => {
        alert("[AUDIO PLAYING: Final Birthday Messages...]");
        document.getElementById('end-screen').classList.remove('hidden');
    });
}
