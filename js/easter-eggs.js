/**
 * Lyra's Star Quest - Easter Eggs & Particle Effects
 * Confetti bursts, Supernova Party Mode, Konami Code, and secret word detectors.
 */

class EasterEggController {
  constructor() {
    this.canvas = document.getElementById('confettiCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.isPartyMode = false;
    this.partyTimer = null;
    this.mascotTapCount = 0;
    this.lastMascotTap = 0;
    this.keyBuffer = [];

    this.konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    this.secretWords = {
      'party': () => this.triggerPartyMode(),
      'galaxy': () => this.triggerGalaxyShower(),
      'nova': () => this.triggerNovaWink(),
      'star': () => this.burstConfetti(80)
    };

    this.initCanvas();
    this.setupListeners();
    this.animateParticles();
  }

  initCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  setupListeners() {
    // Tap Nova Mascot 5 times to trigger Supernova Party Mode
    const mascot = document.getElementById('mascotBtn');
    if (mascot) {
      mascot.addEventListener('click', () => {
        const now = Date.now();
        if (now - this.lastMascotTap < 1200) {
          this.mascotTapCount++;
        } else {
          this.mascotTapCount = 1;
        }
        this.lastMascotTap = now;

        if (this.mascotTapCount >= 5) {
          this.mascotTapCount = 0;
          this.triggerPartyMode();
        } else {
          this.showMascotMessage(this.getRandomCheer());
        }
      });
    }

    // Keyboard listener for Konami code and secret words
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in a text field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      this.keyBuffer.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (this.keyBuffer.length > 25) this.keyBuffer.shift();

      // Check Konami Code
      const konamiSlice = this.keyBuffer.slice(-this.konamiCode.length);
      if (konamiSlice.length === this.konamiCode.length &&
          konamiSlice.every((val, idx) => val.toLowerCase() === this.konamiCode[idx].toLowerCase())) {
        this.triggerPartyMode();
        this.keyBuffer = [];
        return;
      }

      // Check Secret Words
      const bufferString = this.keyBuffer.join('');
      for (const [word, action] of Object.entries(this.secretWords)) {
        if (bufferString.endsWith(word)) {
          action();
          this.keyBuffer = [];
          break;
        }
      }
    });
  }

  getRandomCheer() {
    const cheers = [
      "You're a math superstar, Lyra! 🌟",
      "Keep shining bright! ✨",
      "High five! You got this! ✋",
      "Cosmic brain power! 🧠⚡",
      "Star power activated! 🚀",
      "I believe in you! 💖"
    ];
    return cheers[Math.floor(Math.random() * cheers.length)];
  }

  showMascotMessage(text, duration = 3000) {
    const bubble = document.getElementById('mascotSpeech');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('show-speech');
    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => {
      bubble.classList.remove('show-speech');
    }, duration);
  }

  triggerPartyMode() {
    this.isPartyMode = !this.isPartyMode;
    const body = document.body;
    const glasses = document.getElementById('partyGlasses');

    if (this.isPartyMode) {
      body.classList.add('party-mode');
      if (glasses) glasses.classList.remove('hidden');
      this.showMascotMessage("🪩 SUPERNOVA PARTY MODE ACTIVATED!! 🚀", 6000);
      this.burstConfetti(150);

      if (window.soundEngine) {
        window.soundEngine.startPartyBeats();
      }

      // Automatically calm down after 15 seconds so she can focus
      clearTimeout(this.partyTimer);
      this.partyTimer = setTimeout(() => {
        if (this.isPartyMode) this.triggerPartyMode();
      }, 15000);
    } else {
      body.classList.remove('party-mode');
      if (glasses) glasses.classList.add('hidden');
      this.showMascotMessage("Great party! Ready to solve more stars! ⭐", 3000);
      if (window.soundEngine) {
        window.soundEngine.stopPartyBeats();
      }
    }
  }

  triggerGalaxyShower() {
    this.showMascotMessage("🌌 Galactic Star Shower Incoming!", 3500);
    this.burstConfetti(120, ['#00f5d4', '#7209b7', '#f72585', '#ffd166', '#ffffff']);
  }

  triggerNovaWink() {
    this.showMascotMessage("😉 *Wink* Nova gives you +1000 Lucky Points!", 3000);
    this.burstConfetti(40);
  }

  // Particle explosion
  burstConfetti(count = 60, customColors = null) {
    if (!this.canvas) return;
    const colors = customColors || [
      '#ffd166', '#06d6a0', '#118ab2', '#073b4c', '#f72585', '#7209b7', '#00f5d4', '#ff70a6'
    ];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: originX + (Math.random() - 0.5) * 80,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.012 + 0.008,
        isStar: Math.random() > 0.4
      });
    }
  }

  animateParticles() {
    const render = () => {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; // Gravity
          p.vx *= 0.985;
          p.rotation += p.rotSpeed;
          p.life -= p.decay;

          if (p.life <= 0 || p.y > this.canvas.height + 20) {
            this.particles.splice(i, 1);
            continue;
          }

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.life);
          this.ctx.fillStyle = p.color;

          if (p.isStar) {
            // Draw a cute 5-point star
            this.drawStar(this.ctx, 0, 0, 5, p.size, p.size / 2);
          } else {
            // Rounded confetti rectangle
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          }

          this.ctx.restore();
        }
      }
      requestAnimationFrame(render);
    };
    render();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

window.easterEggs = new EasterEggController();
