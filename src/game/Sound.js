class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Volume control
        this.masterGain.connect(this.ctx.destination);
        this.isMuted = false;
        this.bgmOscillators = [];
    }

    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, startTime = 0) {
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime + startTime;

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playAttack() {
        this.resume();
        // Swoosh / Hit sound
        this.playTone(150, 'sawtooth', 0.1);
        this.playTone(100, 'square', 0.1, 0.05);
    }

    playBuy() {
        this.resume();
        // Coin sound (Ding!)
        this.playTone(1200, 'sine', 0.1);
        this.playTone(1600, 'sine', 0.2, 0.1);
    }

    playHit() {
        this.resume();
        // Ouch sound
        this.playTone(100, 'sawtooth', 0.2);
    }

    playBGM() {
        if (this.bgmPlaying) return;
        this.resume();
        this.bgmPlaying = true;

        // Simple 8-bit loop
        const melody = [
            { f: 261.63, d: 0.2 }, { f: 293.66, d: 0.2 }, { f: 329.63, d: 0.2 },
            { f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.4 }
        ];

        let noteTime = 0;
        const loopLength = 2.0;

        // Schedule a loop function using setInterval is not precise for WebAudio,
        // but explicit scheduling is complex. Let's try a recursive scheduling approach 
        // or just a simple interval for this demo.

        this.bgmInterval = setInterval(() => {
            if (!this.bgmPlaying) return;
            const now = this.ctx.currentTime;

            melody.forEach((note, i) => {
                // Randomize slightly for "retro" feel or just play straight
                this.playTone(note.f, 'square', note.d, i * 0.4);
            });
        }, 2500); // Loop every 2.5s
    }

    stopBGM() {
        this.bgmPlaying = false;
        clearInterval(this.bgmInterval);
    }
}
window.SoundManager = SoundManager;
