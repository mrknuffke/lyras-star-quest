/**
 * Lyra's Star Quest - Web Audio Sound Synthesizer
 * Pure Web Audio API: 100% offline, zero external audio asset dependencies.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('lyra_sound_muted') === 'true';
    this.partyLoopTimer = null;
    this.partyBeatStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('lyra_sound_muted', this.isMuted);
    if (this.isMuted) {
      this.stopPartyBeats();
    }
    return this.isMuted;
  }

  // Gentle, tactile mechanical 'pop' on button touch
  playKeyClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio fallback gracefully
    }
  }

  // Cheerful starlight chime when Lyra solves a problem
  playCorrect(streak = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic pitch lift based on current session combo
      const baseFreq = 523.25; // C5
      const scale = [1, 1.25, 1.5, 1.667, 2.0]; // Major pentatonic ratios
      const noteOffset = Math.min(streak, 4);

      const notes = [
        baseFreq * (scale[noteOffset % scale.length] || 1),
        baseFreq * 1.5 * (scale[(noteOffset + 1) % scale.length] || 1.25)
      ];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch (e) {}
  }

  // Gentle low bloop when answer needs another try (encouraging, not jarring)
  playTryAgain() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(195, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Grand Cosmic Fanfare when 5-min Daily Quest completes!
  playCelebration() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = now + idx * 0.1;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.9);
      });
    } catch (e) {}
  }

  // Funky 8-Bit Disco synthesizer for Supernova Party Mode!
  startPartyBeats() {
    if (this.isMuted || this.partyLoopTimer) return;
    this.init();
    if (!this.ctx) return;

    const discoScale = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 440.0, 493.88];
    this.partyBeatStep = 0;

    const tick = () => {
      if (this.isMuted || !document.body.classList.contains('party-mode')) {
        this.stopPartyBeats();
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        const freq = discoScale[this.partyBeatStep % discoScale.length];
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
        this.partyBeatStep++;
      } catch (e) {}
    };

    tick();
    this.partyLoopTimer = setInterval(tick, 160);
  }

  stopPartyBeats() {
    if (this.partyLoopTimer) {
      clearInterval(this.partyLoopTimer);
      this.partyLoopTimer = null;
    }
  }
}

window.soundEngine = new SoundEngine();
