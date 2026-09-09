/**
 * js/radio.js — Mini Radio Sound Deck & Audio Engine
 * Integrated retro audio software box at bottom-left corner.
 */

// ════════════════════════════════════════════════════════════
// 1. PLAYLIST CONFIGURATION & MP3 AUDIO PLAYER
// Songs from /songs/ directory (Dhurandhar OST & The Weeknd)
// ════════════════════════════════════════════════════════════
export const RADIO_PLAYLIST = [
    {
        id: 'track-1',
        title: "Aari Aari",
        artist: "Dhurandhar The Revenge",
        src: "songs/Aari Aari Dhurandhar The Revenge 320 Kbps.mp3",
        icon: "🔥"
    },
    {
        id: 'track-2',
        title: "Blinding Lights",
        artist: "The Weeknd",
        src: "songs/The_Weeknd_-_Blinding_Lights_(mp3.pm).mp3",
        icon: "⚡"
    },
    {
        id: 'track-3',
        title: "Starboy",
        artist: "The Weeknd ft. Daft Punk",
        src: "songs/The_Weeknd_ft._Daft_Punk_-_Starboy_(mp3.pm).mp3",
        icon: "⭐"
    },
    {
        id: 'track-4',
        title: "Didi",
        artist: "Dhurandhar The Revenge",
        src: "songs/Didi Dhurandhar The Revenge 320 Kbps.mp3",
        icon: "💃"
    },
    {
        id: 'track-5',
        title: "High For This",
        artist: "The Weeknd",
        src: "songs/TheWeeknd_-_High_For_This_(mp3.pm).mp3",
        icon: "🌙"
    },
    {
        id: 'track-6',
        title: "Main Aur Tu",
        artist: "Dhurandhar The Revenge",
        src: "songs/Main Aur Tu Dhurandhar The Revenge 320 Kbps.mp3",
        icon: "💖"
    },
    {
        id: 'track-7',
        title: "Lutt Le Gaya",
        artist: "Dhurandhar",
        src: "songs/Lutt Le Gaya Dhurandhar 320 Kbps.mp3",
        icon: "🎬"
    },
    {
        id: 'track-8',
        title: "Ez Ez",
        artist: "Dhurandhar",
        src: "songs/Ez Ez Dhurandhar 320 Kbps.mp3",
        icon: "✨"
    },
    {
        id: 'track-9',
        title: "Hum Pyaar Karne Wale",
        artist: "Dhurandhar The Revenge",
        src: "songs/Hum Pyaar Karne Wale Dhurandhar The Revenge 320 Kbps.mp3",
        icon: "🎶"
    },
    {
        id: 'track-10',
        title: "Rang De Lal Oye Oye",
        artist: "Dhurandhar The Revenge",
        src: "songs/Rang De Lal Oye Oye Dhurandhar The Revenge 320 Kbps.mp3",
        icon: "🔴"
    }
];

class MiniRadioEngine {
    constructor() {
        this.ctx = null;
        this.audioEl = new Audio();
        this.audioEl.crossOrigin = "anonymous";
        this.sourceNode = null;
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.7;
        this.audioEl.volume = this.volume;

        this.analyser = null;
        this.dataArray = null;
        this.masterGain = null;
        this.onProgressUpdate = null;
        this.onStateChange = null;

        // Bind HTML5 audio element events
        this.audioEl.addEventListener('timeupdate', () => {
            if (this.onProgressUpdate && this.audioEl.duration) {
                this.onProgressUpdate(this.audioEl.currentTime, this.audioEl.duration);
            }
        });

        this.audioEl.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.audioEl.addEventListener('play', () => {
            this.isPlaying = true;
            if (this.onStateChange) this.onStateChange(true, this.currentTrackIndex);
        });

        this.audioEl.addEventListener('pause', () => {
            this.isPlaying = false;
            if (this.onStateChange) this.onStateChange(false, this.currentTrackIndex);
        });
    }

    initAudioContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            try {
                this.sourceNode = this.ctx.createMediaElementSource(this.audioEl);
                this.sourceNode.connect(this.masterGain);
            } catch (e) {
                console.warn("MediaElementSource notice:", e);
            }

            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        this.audioEl.volume = this.isMuted ? 0 : this.volume;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.setVolume(this.volume);
        return this.isMuted;
    }

    playTrack(index) {
        this.initAudioContext();

        if (index < 0 || index >= RADIO_PLAYLIST.length) return;

        const track = RADIO_PLAYLIST[index];

        // If same track is playing, toggle pause/play
        if (this.currentTrackIndex === index) {
            if (this.audioEl.paused) {
                this.audioEl.play().catch(err => console.warn("Audio play error:", err));
            } else {
                this.audioEl.pause();
            }
            return;
        }

        this.currentTrackIndex = index;
        this.audioEl.src = encodeURI(track.src);
        this.audioEl.play().catch(err => console.warn("Audio play error:", err));

        if (this.onStateChange) {
            this.onStateChange(true, this.currentTrackIndex);
        }
    }

    pause() {
        this.audioEl.pause();
    }

    resume() {
        if (this.currentTrackIndex >= 0) {
            this.audioEl.play().catch(err => console.warn("Audio resume error:", err));
        } else {
            this.playTrack(0);
        }
    }

    nextTrack() {
        const nextIdx = (this.currentTrackIndex + 1) % RADIO_PLAYLIST.length;
        this.playTrack(nextIdx);
    }

    prevTrack() {
        let prevIdx = this.currentTrackIndex - 1;
        if (prevIdx < 0) prevIdx = RADIO_PLAYLIST.length - 1;
        this.playTrack(prevIdx);
    }

    seek(percent) {
        if (this.audioEl && this.audioEl.duration) {
            this.audioEl.currentTime = (percent / 100) * this.audioEl.duration;
        }
    }

    getVisualizerData() {
        if (this.analyser && this.isPlaying) {
            this.analyser.getByteFrequencyData(this.dataArray);
            return this.dataArray;
        }
        return null;
    }
}

// Global Singleton Instance
export const radioEngine = new MiniRadioEngine();

// ════════════════════════════════════════════════════════════
// 2. UI CONTROLLER & EVENT BINDINGS
// ════════════════════════════════════════════════════════════
let isExpanded = false;
let isScrubbing = false;
let animFrameId = null;

export function initMiniRadio() {
    const radioWidget = document.getElementById('mini-radio-widget');
    const radioToggleBtn = document.getElementById('radio-toggle-btn');
    const radioCloseBtn = document.getElementById('radio-close-btn');

    if (!radioWidget || !radioToggleBtn) return;

    // Build Playlist Items dynamically
    renderPlaylistItems();

    // Toggle expand/collapse
    radioToggleBtn.addEventListener('click', (e) => {
        // Avoid toggling if child control was clicked specifically
        if (isExpanded && e.target.closest('#radio-software-deck')) return;
        toggleRadioExpand();
    });

    if (radioCloseBtn) {
        radioCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleRadioExpand(false);
        });
    }

    // Master Controls
    const btnPlay = document.getElementById('radio-btn-play');
    const btnPrev = document.getElementById('radio-btn-prev');
    const btnNext = document.getElementById('radio-btn-next');
    const btnMute = document.getElementById('radio-btn-mute');
    const volSlider = document.getElementById('radio-volume-slider');
    const progressBar = document.getElementById('radio-progress-bar');

    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            if (radioEngine.isPlaying) {
                radioEngine.pause();
            } else {
                radioEngine.resume();
            }
        });
    }

    if (btnPrev) btnPrev.addEventListener('click', () => radioEngine.prevTrack());
    if (btnNext) btnNext.addEventListener('click', () => radioEngine.nextTrack());

    if (btnMute) {
        btnMute.addEventListener('click', () => {
            const muted = radioEngine.toggleMute();
            btnMute.textContent = muted ? '🔇' : '🔊';
        });
    }

    if (volSlider) {
        volSlider.addEventListener('input', (e) => {
            radioEngine.setVolume(parseFloat(e.target.value));
        });
    }

    if (progressBar) {
        progressBar.addEventListener('mousedown', () => isScrubbing = true);
        progressBar.addEventListener('touchstart', () => isScrubbing = true, {passive: true});
        progressBar.addEventListener('mouseup', () => isScrubbing = false);
        progressBar.addEventListener('touchend', () => isScrubbing = false);
        
        progressBar.addEventListener('input', (e) => {
            radioEngine.seek(parseFloat(e.target.value));
        });
        progressBar.addEventListener('change', (e) => {
            radioEngine.seek(parseFloat(e.target.value));
            isScrubbing = false;
        });
    }

    // Connect Engine Callbacks
    radioEngine.onProgressUpdate = (currentSec, totalSec) => {
        updateProgressUI(currentSec, totalSec);
    };

    radioEngine.onStateChange = (isPlaying, trackIndex) => {
        updateStateUI(isPlaying, trackIndex);
    };

    // Start Visualizer Canvas Loop
    startVisualizerLoop();
}

function toggleRadioExpand(forceState) {
    const radioWidget = document.getElementById('mini-radio-widget');
    if (!radioWidget) return;

    if (typeof forceState === 'boolean') {
        isExpanded = forceState;
    } else {
        isExpanded = !isExpanded;
    }

    if (isExpanded) {
        radioWidget.classList.remove('collapsed');
        radioWidget.classList.add('expanded');
        document.body.classList.add('radio-open');

        // Immediately dismiss any popups sitting near the bottom-left / center-left area
        document.querySelectorAll('.sys-popup.popup-bottom-left, .sys-popup.popup-center-left').forEach(p => p.remove());
    } else {
        radioWidget.classList.remove('expanded');
        radioWidget.classList.add('collapsed');
        document.body.classList.remove('radio-open');
    }
}

function renderPlaylistItems() {
    const container = document.getElementById('radio-playlist-items');
    if (!container) return;

    container.innerHTML = '';

    RADIO_PLAYLIST.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item item-${index}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="track-info-col">
                <span class="track-icon">${track.icon}</span>
                <div class="track-meta">
                    <span class="track-title">${track.title}</span>
                    <span class="track-artist">${track.artist}</span>
                </div>
            </div>
            <div class="track-action-col">
                <button class="track-play-symbol-btn" aria-label="Play ${track.title}" title="Play Track">
                    <span class="play-symbol">▶</span>
                </button>
            </div>
        `;

        // Click play button or row to play track
        const playBtn = item.querySelector('.track-play-symbol-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            radioEngine.playTrack(index);
        });

        item.addEventListener('click', () => {
            radioEngine.playTrack(index);
        });

        container.appendChild(item);
    });
}

function updateStateUI(isPlaying, trackIndex) {
    const btnPlay = document.getElementById('radio-btn-play');
    const lcdStatus = document.getElementById('lcd-status-text');
    const lcdTitle = document.getElementById('lcd-track-title');
    const lcdArtist = document.getElementById('lcd-track-artist');
    const miniStatus = document.getElementById('radio-mini-status');
    const miniEq = document.getElementById('radio-mini-eq');

    if (btnPlay) btnPlay.textContent = isPlaying ? '⏸' : '▶';

    if (lcdStatus) {
        lcdStatus.textContent = isPlaying ? 'PLAYING ▶' : 'PAUSED';
        lcdStatus.classList.toggle('playing', isPlaying);
    }

    if (miniEq) {
        miniEq.classList.toggle('playing', isPlaying);
    }

    if (trackIndex >= 0 && trackIndex < RADIO_PLAYLIST.length) {
        const track = RADIO_PLAYLIST[trackIndex];
        if (lcdTitle) lcdTitle.textContent = track.title;
        if (lcdArtist) lcdArtist.textContent = track.artist;
        if (miniStatus) miniStatus.textContent = isPlaying ? `▶ ${track.title}` : track.title;
    }

    // Update playlist highlight & play symbols
    document.querySelectorAll('.playlist-item').forEach((item, idx) => {
        const playSym = item.querySelector('.play-symbol');
        if (idx === trackIndex) {
            item.classList.add('active');
            if (isPlaying) {
                item.classList.add('playing');
                if (playSym) playSym.textContent = '⏸';
            } else {
                item.classList.remove('playing');
                if (playSym) playSym.textContent = '▶';
            }
        } else {
            item.classList.remove('active', 'playing');
            if (playSym) playSym.textContent = '▶';
        }
    });
}

function updateProgressUI(currentSec, totalSec) {
    const curTimeEl = document.getElementById('radio-current-time');
    const durTimeEl = document.getElementById('radio-duration-time');
    const progressBar = document.getElementById('radio-progress-bar');

    if (curTimeEl) curTimeEl.textContent = formatTime(currentSec);
    if (durTimeEl) durTimeEl.textContent = formatTime(totalSec);

    if (progressBar && totalSec > 0 && !isScrubbing) {
        progressBar.value = (currentSec / totalSec) * 100;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ════════════════════════════════════════════════════════════
// 3. AUDIO VISUALIZER CANVAS ANIMATION
// ════════════════════════════════════════════════════════════
function startVisualizerLoop() {
    const canvas = document.getElementById('radio-visualizer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const numBars = 18;
    const barWidth = (canvas.width / numBars) - 3;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = radioEngine.getVisualizerData();

        for (let i = 0; i < numBars; i++) {
            let barHeight = 4;
            if (radioEngine.isPlaying && data && data.length > 0) {
                const value = data[i % data.length] || 0;
                barHeight = Math.max(4, (value / 255) * canvas.height * 1.2);
            } else if (radioEngine.isPlaying) {
                // Procedural pulse fallback if web audio data is restricted
                barHeight = Math.max(4, Math.sin(Date.now() * 0.008 + i) * 12 + 16);
            }

            const x = i * (barWidth + 3);
            const y = canvas.height - barHeight;

            // Neon cyan / pink gradient bar
            const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
            grad.addColorStop(0, '#06d6a0');
            grad.addColorStop(0.6, '#ffd60a');
            grad.addColorStop(1, '#ff2d55');

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barWidth, barHeight);
        }

        animFrameId = requestAnimationFrame(render);
    }

    render();
}
