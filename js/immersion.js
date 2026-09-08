/**
 * js/immersion.js — Visual Polish & Immersion Suite
 * 1. Retro CRT scanline filter & theme mode controller
 * 2. Web Audio procedural 8-bit / Lo-Fi Birthday BGM tape player
 * 3. Physics-based high performance Canvas Confetti & Streamer Cannon
 */

// ════════════════════════════════════════════════════════════
// 1. THEMES & CRT SCANLINE CONTROLLER
// ════════════════════════════════════════════════════════════
const THEMES = [
    { id: 'theme-default', label: 'ORIGINAL' },
    { id: 'theme-dark',    label: 'DARK DOSSIER' },
    { id: 'theme-matrix',  label: 'CYBER MATRIX' }
];
let currentThemeIndex = 0;
let crtActive = false;

export function initCRTAndThemes() {
    const crtBtn = document.getElementById('btn-toggle-crt');
    const themeBtn = document.getElementById('btn-toggle-theme');
    const crtOverlay = document.getElementById('crt-overlay');

    // Restore saved CRT state
    const savedCRT = localStorage.getItem('last1s_crt') === 'true';
    if (savedCRT && crtBtn && crtOverlay) {
        crtActive = true;
        crtOverlay.classList.add('active');
        crtBtn.classList.add('active');
        crtBtn.querySelector('.hud-label').textContent = 'CRT: ON';
    }

    if (crtBtn && crtOverlay) {
        crtBtn.addEventListener('click', () => {
            crtActive = !crtActive;
            crtOverlay.classList.toggle('active', crtActive);
            crtBtn.classList.toggle('active', crtActive);
            crtBtn.querySelector('.hud-label').textContent = crtActive ? 'CRT: ON' : 'CRT: OFF';
            localStorage.setItem('last1s_crt', String(crtActive));
        });
    }

    // Restore saved Theme state
    const savedTheme = localStorage.getItem('last1s_theme');
    if (savedTheme) {
        const foundIdx = THEMES.findIndex(t => t.id === savedTheme);
        if (foundIdx !== -1) {
            currentThemeIndex = foundIdx;
            if (THEMES[currentThemeIndex].id !== 'theme-default') {
                document.body.classList.add(THEMES[currentThemeIndex].id);
            }
            if (themeBtn) {
                themeBtn.querySelector('.hud-label').textContent = THEMES[currentThemeIndex].label;
            }
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.remove(THEMES[currentThemeIndex].id);
            currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
            const nextTheme = THEMES[currentThemeIndex];
            if (nextTheme.id !== 'theme-default') {
                document.body.classList.add(nextTheme.id);
            }
            themeBtn.querySelector('.hud-label').textContent = nextTheme.label;
            localStorage.setItem('last1s_theme', nextTheme.id);
        });
    }
}

// ════════════════════════════════════════════════════════════
// 2. PROCEDURAL 8-BIT / LO-FI BGM SYNTHESIZER
// ════════════════════════════════════════════════════════════
class ChiptuneBGM {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.tempo = 126;
        this.step = 0;
        this.timer = null;

        // "Happy Birthday" 8-bit playful chiptune chord/melody sequence
        // Frequency in Hz
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
        const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;
        const REST = 0;

        this.melody = [
            // "Happy birthday to you"
            { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1.0 }, { note: G4, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: B4, dur: 2.0 },
            // "Happy birthday to you"
            { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1.0 }, { note: G4, dur: 1.0 }, { note: D5, dur: 1.0 }, { note: C5, dur: 2.0 },
            // "Happy birthday dear Ananya"
            { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: G5, dur: 1.0 }, { note: E5, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: B4, dur: 1.0 }, { note: A4, dur: 1.0 },
            // "Happy birthday to you"
            { note: F5, dur: 0.75 }, { note: F5, dur: 0.25 }, { note: E5, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: D5, dur: 1.0 }, { note: C5, dur: 2.0 }
        ];

        this.bassline = [
            C4/2, C4/2, G4/2, G4/2, C4/2, C4/2, G4/2, G4/2,
            G4/2, G4/2, D4/2, D4/2, C4/2, C4/2, G4/2, G4/2,
            C4/2, C4/2, E4/2, E4/2, F4/2, F4/2, F4/2, F4/2,
            F4/2, F4/2, C4/2, C4/2, G4/2, G4/2, C4/2, C4/2
        ];
    }

    initAudio() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playNote(freq, duration, type = 'square', gainValue = 0.04) {
        if (!freq || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gainValue, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.95);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    playDrum(isKick = true) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (isKick) {
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        } else {
            // Snare / Hi-hat blip
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    start() {
        this.initAudio();
        this.isPlaying = true;
        this.step = 0;

        let melodyIndex = 0;
        let noteTimer = 0;

        const beatMs = (60 / this.tempo) * 1000 / 2; // 8th notes

        this.timer = setInterval(() => {
            if (!this.isPlaying) return;

            // Bass note
            const bassNote = this.bassline[this.step % this.bassline.length];
            this.playNote(bassNote, (beatMs / 1000) * 0.9, 'triangle', 0.06);

            // Drum beat
            this.playDrum(this.step % 4 === 0);

            // Melody
            if (noteTimer <= 0) {
                const cur = this.melody[melodyIndex % this.melody.length];
                const noteDurSeconds = cur.dur * (60 / this.tempo);
                this.playNote(cur.note, noteDurSeconds * 0.85, 'square', 0.035);
                noteTimer = cur.dur * 2; // in 8th notes
                melodyIndex++;
            }
            noteTimer--;
            this.step++;
        }, beatMs);
    }

    stop() {
        this.isPlaying = false;
        if (this.timer) clearInterval(this.timer);
    }
}

export function initBGMPlayer() {
    const bgm = new ChiptuneBGM();
    const bgmBtn = document.getElementById('btn-toggle-bgm');
    const cassetteTape = document.getElementById('hud-cassette');

    if (!bgmBtn) return;

    bgmBtn.addEventListener('click', () => {
        if (bgm.isPlaying) {
            bgm.stop();
            bgmBtn.classList.remove('active');
            if (cassetteTape) cassetteTape.classList.remove('playing');
            bgmBtn.querySelector('.hud-label').textContent = 'BGM: OFF';
        } else {
            bgm.start();
            bgmBtn.classList.add('active');
            if (cassetteTape) cassetteTape.classList.add('playing');
            bgmBtn.querySelector('.hud-label').textContent = 'BGM: ON';
        }
    });
}

// ════════════════════════════════════════════════════════════
// 3. CANVAS CELEBRATION CONFETTI & STREAMER CANNON
// ════════════════════════════════════════════════════════════
export class ConfettiCannon {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        this.colors = ['#ff2d55', '#ffd60a', '#06d6a0', '#1c1c2e', '#ff007f', '#4cc9f0', '#ffffff'];
        this.emojis = ['🎂', '🎉', '🎈', '⭐', '💖', '🐱', '🐶', '✨'];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    fire(count = 140) {
        if (!this.canvas) return;
        this.resize();

        // Left cannon burst
        for (let i = 0; i < count / 2; i++) {
            this.particles.push(this.createParticle(0, window.innerHeight, 1));
        }
        // Right cannon burst
        for (let i = 0; i < count / 2; i++) {
            this.particles.push(this.createParticle(window.innerWidth, window.innerHeight, -1));
        }

        if (!this.animationFrame) {
            this.loop();
        }
    }

    createParticle(x, y, dir) {
        const isEmoji = Math.random() < 0.22;
        const angle = (Math.PI / 4) + (Math.random() * (Math.PI / 4)); // 45 to 90 deg upwards
        const velocity = 15 + Math.random() * 22;

        return {
            x,
            y,
            vx: Math.cos(angle) * velocity * dir + (Math.random() - 0.5) * 5,
            vy: -Math.sin(angle) * velocity,
            gravity: 0.45 + Math.random() * 0.25,
            drag: 0.985,
            size: 8 + Math.random() * 8,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            isEmoji,
            emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
            opacity: 1,
            life: 1
        };
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.life -= 0.005;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.isEmoji) {
                this.ctx.font = `${p.size * 1.8}px sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(p.emoji, 0, 0);
            } else if (p.shape === 'rect') {
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
            } else {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();

            if (p.y > this.canvas.height + 50 || p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(() => this.loop());
        } else {
            this.animationFrame = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

let globalConfettiInstance = null;
export function getConfetti() {
    if (!globalConfettiInstance) {
        globalConfettiInstance = new ConfettiCannon();
    }
    return globalConfettiInstance;
}
