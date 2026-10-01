/**
 * Star Quest - Easter Eggs, Silliness & Creature Animations
 * Galloping unicorns, floating space cats, silly mascot hats, secret words,
 * and a rich library of gentle, encouraging growth-mindset praises.
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
    this.currentHatIndex = 0;
    this.keyBuffer = [];

    this.konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];

    this.secretWords = {
      'unicorn': () => this.spawnGallopingUnicorn(),
      'cat': () => this.spawnFlyingCat(),
      'meow': () => this.spawnFlyingCat(),
      'caticorn': () => { this.spawnGallopingUnicorn(); this.spawnFlyingCat(); },
      'rainbow': () => this.burstConfetti(100, ['#ff4d8d', '#ff9a00', '#ffd100', '#06d6a0', '#00f5d4', '#7209b7']),
      'party': () => this.triggerPartyMode(),
      'galaxy': () => this.triggerGalaxyShower(),
      'star': () => this.burstConfetti(80)
    };

    // 35+ diverse, gentle, warm, buddy-specific growth mindset encouragements
    this.mistakeEncouragements = [
      "🎮 Respawn! Every pro gamer tries again!",
      "🌱 Brain stretch! That was a super brave try!",
      "🐯 Derpy says: 'Oops! I trip over my own paws ALL the time! Try again!'",
      "🐯 Derpy does a goofy dance for your effort! You've got this!",
      "🐯 Derpy believes in you SO much! Rawr!",
      "🧟‍♀️ Brainy says: 'Mmm, brain stretches! Your brain just got STRONGER!'",
      "🧟‍♀️ Brainy shuffles over for a high-five! Try once more!",
      "🧟‍♀️ Brainy says: 'Slow and steady wins! Zombies know!'",
      "🧛‍♀️ Luna says: 'Let's count it again together, girl! Batty high-five! 🦇'",
      "🧛‍♀️ Luna twirls her sparkly cape: 'Mistakes are how we LEARN!'",
      "🧛‍♀️ Luna says: 'Even vampire girls practice their math every night!'",
      "👾 Pixel says: 'Glitch detected! Rebooting for another try!'",
      "👾 Beep boop! Extra life unlocked! Go again!",
      "🦄 Celeste says: 'Every guess makes your magic glow brighter!'",
      "🐱 Barnaby purrs: 'Pawsome try! You are super close!'",
      "💡 Nice thinking! Tap 'Show Me' for a power-up hint!",
      "🕹️ Practice round! Bosses take a couple of tries!",
      "⚡ Charging up your next try... READY!",
      "🧠 Fun brain fact: your neurons just grew stronger!",
      "🎯 Right around the target! Take another shot!",
      "🧩 Puzzle pieces are clicking into place! Try once more!",
      "🛡️ Shields up! Mistakes can't stop you!",
      "💾 Progress saved! Now try that level again!",
      "🏃‍♀️ Speedrunners fall all the time. Then they get faster!",
      "🌟 You are doing amazing, {name}! Keep going!",
      "💪 Hard levels are where the best XP is!",
      "🔄 Plot twist! Let's try a different answer!",
      "🚀 Three, two, one... ready for your next try!",
      "💖 You are so smart and so loved! You can do this!",
      "✨ Big brain power! Give it one more whirl!",
      "🎲 Roll again! You're super close!",
      "🌈 Power-up recharged! What do you think it is?"
    ];

    this.lastEncouragementIndex = -1;

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

        this.cycleMascotHat();

        if (this.mascotTapCount >= 5) {
          this.mascotTapCount = 0;
          this.triggerPartyMode();
        } else {
          const activeBuddy = window.app ? window.app.currentBuddy : 'unicorn';
          if (activeBuddy === 'cat' && window.soundEngine) {
            window.soundEngine.playCatMeow();
          } else if ((activeBuddy === 'unicorn' || activeBuddy === 'caticorn') && window.soundEngine) {
            window.soundEngine.playUnicornSparkle();
          }
          this.showMascotMessage(this.getRandomSillyMessage());
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      this.keyBuffer.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (this.keyBuffer.length > 25) this.keyBuffer.shift();

      const konamiSlice = this.keyBuffer.slice(-this.konamiCode.length);
      if (konamiSlice.length === this.konamiCode.length &&
          konamiSlice.every((val, idx) => val.toLowerCase() === this.konamiCode[idx].toLowerCase())) {
        this.triggerPartyMode();
        this.keyBuffer = [];
        return;
      }

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

  cycleMascotHat() {
    this.currentHatIndex = (this.currentHatIndex + 1) % 4;
    const glasses = document.getElementById('partyGlasses');
    const horn = document.getElementById('mascotHorn');
    const catEars = document.getElementById('mascotCatEars');

    if (glasses) glasses.classList.add('hidden');
    if (horn) horn.classList.add('hidden');
    if (catEars) catEars.classList.add('hidden');

    if (this.currentHatIndex === 1 && glasses) {
      glasses.classList.remove('hidden');
    } else if (this.currentHatIndex === 2 && horn) {
      horn.classList.remove('hidden');
    } else if (this.currentHatIndex === 3 && catEars) {
      catEars.classList.remove('hidden');
    }
  }

  getRandomSillyMessage() {
    const messages = [
      "🐯 Derpy says: 'I tried to eat a star once. It was spicy!'",
      "🧟‍♀️ Brainy says: 'Math makes my brain go BRAAAINS!'",
      "🧛‍♀️ Luna: 'One fact! Two facts! THREE FACTS! I love counting!'",
      "👾 Pixel says: 'High score incoming! Beep boop!'",
      "🎮 Achievement unlocked: Tapped your buddy!",
      "🦄 *Neigh!* Unicorn starlight power is with you, {name}!",
      "🐱 *Purrrrr* You are pawsitively awesome!",
      "✨ Did you know 7 × 8 is 56? Secret galaxy fact!",
      "🌈 Brain muscles expanding at warp speed!",
      "🐾 Cat high-five! High-four? Whatever, amazing job!",
      "🥞 Silly thought: what if stars were made of warm pancakes?",
      "🚀 We are zooming straight toward Math Mastery!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Returns a fresh, diverse growth-mindset message every time
  getMistakeEncouragement() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.mistakeEncouragements.length);
    } while (newIndex === this.lastEncouragementIndex && this.mistakeEncouragements.length > 1);

    this.lastEncouragementIndex = newIndex;
    return withName(this.mistakeEncouragements[newIndex]);
  }

  showMascotMessage(text, duration = 3500) {
    const bubble = document.getElementById('mascotSpeech');
    if (!bubble) return;
    bubble.textContent = withName(text);
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
      this.showMascotMessage("🪩 UNICORN & CAT DISCO PARTY ACTIVATED!! 🦄🐱", 6000);
      this.burstConfetti(160);
      this.spawnGallopingUnicorn();
      this.spawnFlyingCat();

      if (window.soundEngine) {
        window.soundEngine.startPartyBeats();
      }

      clearTimeout(this.partyTimer);
      this.partyTimer = setTimeout(() => {
        if (this.isPartyMode) this.triggerPartyMode();
      }, 15000);
    } else {
      body.classList.remove('party-mode');
      if (glasses) glasses.classList.add('hidden');
      this.showMascotMessage("Great disco dance! Ready for more math stars! ⭐", 3000);
      if (window.soundEngine) {
        window.soundEngine.stopPartyBeats();
      }
    }
  }

  spawnGallopingUnicorn() {
    if (window.soundEngine) window.soundEngine.playUnicornSparkle();
    this.showMascotMessage("🦄 Look! A wild magical unicorn appeared! ✨", 3000);

    const unicorn = document.createElement('div');
    unicorn.className = 'galloping-unicorn-overlay';
    unicorn.innerHTML = `
      <span class="creature-emoji">🦄</span>
      <div class="creature-rainbow-trail">🌈✨💫⭐💖</div>
    `;
    document.body.appendChild(unicorn);

    setTimeout(() => {
      if (unicorn.parentNode) unicorn.parentNode.removeChild(unicorn);
    }, 4500);

    this.burstConfetti(60, ['#f72585', '#7209b7', '#00f5d4', '#ffd166', '#ffffff']);
  }

  spawnFlyingCat() {
    if (window.soundEngine) window.soundEngine.playCatMeow();
    this.showMascotMessage("🐱 *Meow!* Space Cat is floating past! 🪐", 3000);

    const cat = document.createElement('div');
    cat.className = 'floating-cat-overlay';
    cat.innerHTML = `
      <span class="creature-emoji">🐱🚀</span>
      <div class="creature-rainbow-trail">🐾✨⭐💫🐾</div>
    `;
    document.body.appendChild(cat);

    setTimeout(() => {
      if (cat.parentNode) cat.parentNode.removeChild(cat);
    }, 4500);

    this.burstConfetti(40, ['#ffd166', '#ff70a6', '#00f5d4']);
  }

  triggerGalaxyShower() {
    this.showMascotMessage("🌌 Galactic Star Shower Incoming!", 3500);
    this.burstConfetti(120, ['#00f5d4', '#7209b7', '#f72585', '#ffd166', '#ffffff']);
  }

  // Gentle particle explosion (hearts, stars, pastels)
  burstConfetti(count = 60, customColors = null) {
    if (!this.canvas) return;
    const colors = customColors || [
      '#ffd166', '#06d6a0', '#f472b6', '#a855f7', '#00f5d4', '#fde047', '#ffffff'
    ];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: originX + (Math.random() - 0.5) * 80,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.014 + 0.008,
        isStar: Math.random() > 0.35,
        isHeart: Math.random() > 0.7
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
          p.vy += 0.20;
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
            this.drawStar(this.ctx, 0, 0, 5, p.size, p.size / 2);
          } else if (p.isHeart) {
            this.drawHeart(this.ctx, 0, 0, p.size);
          } else {
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

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }
}

window.easterEggs = new EasterEggController();
