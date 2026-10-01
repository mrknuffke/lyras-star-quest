/**
 * Star Quest - Quest Badge Maker
 * Logs each daily quest session, then draws a one-of-a-kind badge picture
 * with a full report, randomized praise, a tip, and ideas for next time.
 * The finished badge can be saved as a PNG (share sheet on iPad, download elsewhere).
 */

const OP_INFO = {
  add: { icon: '➕', name: 'Adding', mode: 'Just Adding' },
  sub: { icon: '➖', name: 'Subtracting', mode: 'Just Subtracting' },
  mul: { icon: '✖️', name: 'Multiplying', mode: 'Just Multiplying' }
};

const METALS = {
  gold:  { name: '🟨 Legendary', light: '#fff3b0', mid: '#ffd166', dark: '#c98a12', ribbon: '#f72585', sky: ['#2a0f4f', '#0b0220'] },
  silver: { name: '🟦 Epic', light: '#ffffff', mid: '#c7d2fe', dark: '#6b7bb8', ribbon: '#00b4d8', sky: ['#0f2a4f', '#020b20'] },
  rose:  { name: '🟪 Rare', light: '#ffe4ec', mid: '#f9a8c9', dark: '#c0507e', ribbon: '#a855f7', sky: ['#3d0f45', '#12021c'] }
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Seeded random so a saved badge redraws exactly the same picture in the gallery
function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

class BadgeMaker {
  constructor() {
    this.storageKey = 'lyra_session_log_v1';
    this.galleryKey = 'lyra_badge_gallery_v1';
    this.log = this.load();
    this.rand = Math.random;
  }

  todayStr() {
    return localDateStr();
  }

  emptyLog() {
    return {
      date: this.todayStr(),
      solved: 0,
      firstTry: 0,
      stretches: 0,
      helpUses: 0,
      bestCombo: 0,
      totalMs: 0,
      ops: {},
      missed: {},
      mastered: []
    };
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey));
      if (saved && saved.date === this.todayStr()) return saved;
    } catch (e) {}
    return this.emptyLog();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.log));
    } catch (e) {}
  }

  reset() {
    this.log = this.emptyLog();
    this.save();
  }

  // Start a fresh log when the day rolls over mid-session
  ensureToday() {
    if (this.log.date !== this.todayStr()) this.log = this.emptyLog();
  }

  opStats(opType) {
    if (!this.log.ops[opType]) this.log.ops[opType] = { solved: 0, firstTry: 0 };
    return this.log.ops[opType];
  }

  factLabel(problem) {
    return `${problem.num1} ${problem.opSymbol} ${problem.num2}`;
  }

  // =========================================================================
  // Session logging (called from app.js)
  // =========================================================================

  recordCorrect(problem, { firstTry, ms, combo, boxBefore, boxAfter }) {
    this.ensureToday();
    const op = this.opStats(problem.opType);
    this.log.solved++;
    op.solved++;
    if (firstTry) {
      this.log.firstTry++;
      op.firstTry++;
    }
    this.log.totalMs += Math.min(ms, 60000); // Ignore long breaks away from the screen
    this.log.bestCombo = Math.max(this.log.bestCombo, combo);

    const label = this.factLabel(problem);
    if (boxAfter === 3 && boxBefore !== 3 && !this.log.mastered.includes(label)) {
      this.log.mastered.push(label);
    }
    this.save();
  }

  recordMistake(problem) {
    this.ensureToday();
    this.log.stretches++;
    const entry = this.log.missed[problem.factKey] || { count: 0 };
    entry.count++;
    entry.label = this.factLabel(problem);
    entry.answer = problem.answer;
    entry.problem = {
      opType: problem.opType,
      opSymbol: problem.opSymbol,
      num1: problem.num1,
      num2: problem.num2,
      answer: problem.answer
    };
    this.log.missed[problem.factKey] = entry;
    this.save();
  }

  recordHelp() {
    this.ensureToday();
    this.log.helpUses++;
    this.save();
  }

  // =========================================================================
  // Report: stats, praise, tip, and next-time ideas
  // =========================================================================

  buildReport({ streak, minutes, buddy, difficulty, drill = null }) {
    const log = this.log;
    const accuracy = log.solved > 0 ? Math.round((log.firstTry / log.solved) * 100) : null;
    const avgSec = log.solved > 0 ? log.totalMs / log.solved / 1000 : null;

    let metal = 'rose';
    if (accuracy !== null && accuracy >= 90 && log.solved >= 10) metal = 'gold';
    else if (accuracy !== null && accuracy >= 70) metal = 'silver';

    const opsPracticed = Object.keys(log.ops).filter(k => log.ops[k].solved > 0);
    const missed = Object.values(log.missed).sort((a, b) => b.count - a.count);

    const report = {
      id: Date.now(),
      seed: Math.floor(Math.random() * 4294967296),
      date: log.date,
      player: playerName() || 'Player',
      minutes,
      streak,
      buddy,
      difficulty,
      drill,
      metal,
      solved: log.solved,
      accuracy,
      avgSec,
      bestCombo: log.bestCombo,
      stretches: log.stretches,
      helpUses: log.helpUses,
      mastered: log.mastered.slice(),
      ops: opsPracticed.map(k => ({ key: k, ...OP_INFO[k], ...log.ops[k] })),
      missed: missed.slice(0, 6)
    };

    report.title = this.makeTitle(report, opsPracticed);
    report.praise = this.makePraise(report);
    report.tip = this.makeTip(report, opsPracticed);
    report.nextTime = this.makeNextTime(report);
    return report;
  }

  makeTitle(report, opsPracticed) {
    const adjectives = {
      gold: ['Legendary', 'Final Boss', 'Supernova', 'Pro Gamer', 'Max Level'],
      silver: ['Epic', 'Speedrun', 'Power-Up', 'Turbo', 'High Score'],
      rose: ['Rising', 'Unstoppable', 'Brave', 'Level-Up', 'Respawn']
    };
    const nouns = {
      mul: ['Times-Table Boss', 'Multiplication Champion', 'Array Ace'],
      add: ['Addition Ace', 'Sum Speedrunner', 'Plus Pro'],
      sub: ['Subtraction Ninja', 'Take-Away Pro', 'Difference Detective'],
      mixed: ['Math Gamer', 'Number Ninja', 'Combo Queen']
    };
    const key = opsPracticed.length === 1 ? opsPracticed[0] : 'mixed';
    // Drill titles: "7s Table Boss", "6s & 7s Table Boss", "Doubles Boss" (long combos fall back to normal titles)
    const drill = report.drill;
    if (drill && key === drill.op && drill.picks.length <= 3) {
      const suffix = drill.op === 'mul' ? 'Table Boss' : 'Boss';
      return `${pick(adjectives[report.metal])} ${drill.label} ${suffix}`;
    }
    return `${pick(adjectives[report.metal])} ${pick(nouns[key])}`;
  }

  makePraise(report) {
    const special = [];
    if (report.mastered.length > 0) {
      special.push(`You maxed out ${report.mastered.length === 1 ? 'a fact' : `${report.mastered.length} facts`} today! Achievement unlocked! 🌟`);
    }
    if (report.bestCombo >= 10) {
      special.push(`A ${report.bestCombo}x COMBO?! That's a high-score streak! 🔥`);
    }
    if (report.accuracy !== null && report.accuracy >= 90 && report.solved >= 10) {
      special.push(`${report.accuracy}% on the first try. That's a near-flawless run! ✨`);
    }
    if (report.solved >= 30) {
      special.push(`${report.solved} facts in ${report.minutes} minutes. Speedrunner energy! 🏃‍♀️💨`);
    }
    if (report.stretches >= 3) {
      special.push(`${report.stretches} respawns today, and you never quit. Every one made your brain stronger! 💪🧠`);
    }
    if (report.drill && report.solved >= 5) {
      const what = report.drill.op === 'mul' ? `the ${report.drill.label}` : report.drill.label;
      special.push(`You trained ${what} like a true boss fighter! 🎯`);
    }
    if (report.streak >= 3) {
      special.push(`${report.streak}-day streak! Daily login bonus: LEGENDARY! 🔥`);
    }

    const general = [
      'GG, {name}! You showed up and played hard. That is the most important math skill of all! 💖',
      `${report.buddy.name} did a victory dance watching you play today! ${report.buddy.emoji}`,
      'Every fact you practice is XP for your brain. Level UP! ⚡',
      'You kept going even when the level got tricky. That is what champions do! 🏆',
      'The whole squad is cheering: Derpy, Brainy, Luna, and Pixel! 🐯🧟‍♀️🧛‍♀️👾',
      'Today\'s practice makes tomorrow\'s levels easier. You are unlocking superpowers! 🎮',
      'Wow, {name}! You made those numbers do exactly what you wanted! 🎯'
    ];

    const lines = [];
    if (special.length > 0) lines.push(pick(special));
    const remaining = shuffle(general);
    while (lines.length < 2) lines.push(remaining.pop());
    return lines.map(withName);
  }

  makeTip(report, opsPracticed) {
    if (report.missed.length > 0 && window.mathEngine) {
      const tricky = report.missed[0];
      const help = window.mathEngine.getHelpExplanation(tricky.problem);
      return `For ${tricky.label} = ${tricky.answer}: ${help.tip}`;
    }

    const tips = {
      mul: [
        '💡 9s trick: the digits of a 9s answer add up to 9 (9 × 4 = 36, and 3 + 6 = 9)!',
        '💡 Turn-around facts: 3 × 8 is the same as 8 × 3. Learn one, get one free!',
        '💡 4s are double-doubles: double the number, then double it again!',
        '💡 5s always end in 0 or 5, just like the minutes on a clock!'
      ],
      add: [
        '💡 Make a 10: for 8 + 5, move 2 over to make 10 + 3 = 13!',
        '💡 Doubles are your friends: if you know 6 + 6, then 6 + 7 is just one more!',
        '💡 Start with the bigger number and count on from there!'
      ],
      sub: [
        '💡 Think addition: for 13 − 5, ask "5 plus what makes 13?"',
        '💡 Taking away 9? Take away 10, then add 1 back!',
        '💡 Count up from the smaller number to the bigger one!'
      ]
    };
    const op = opsPracticed.length > 0 ? pick(opsPracticed) : 'mul';
    return pick(tips[op]);
  }

  makeNextTime(report) {
    const ideas = [];
    const levelUp = { gentle: '🎮 Normal', medium: '👾 Boss Mode' };
    const strongRun = report.accuracy !== null && report.accuracy >= 90 && report.solved >= 15;

    const drill = report.drill;
    const lastTable = drill && drill.op === 'mul' ? Math.max(...drill.picks) : null;
    if (strongRun && lastTable !== null && lastTable < 12) {
      ideas.push(`You crushed the ${drill.label}! Ready to add the ${lastTable + 1}s next? 🎯`);
    } else if (strongRun && drill && drill.op !== 'mul') {
      ideas.push(`You crushed ${drill.label}! Try adding another fact group to your drill! 🎯`);
    } else if (strongRun && levelUp[report.difficulty]) {
      ideas.push(`Feeling strong? Try ${levelUp[report.difficulty]} for a new challenge!`);
    }

    const weakest = report.ops
      .filter(o => o.solved >= 3)
      .map(o => ({ ...o, pct: o.firstTry / o.solved }))
      .sort((a, b) => a.pct - b.pct)[0];
    if (weakest && weakest.pct < 0.85 && report.ops.length > 1) {
      ideas.push(`Spend a quest on "${weakest.mode}" to help those facts grow!`);
    }

    if (report.missed.length > 0) {
      const facts = report.missed.slice(0, 3).map(m => `${m.label} = ${m.answer}`).join(', ');
      ideas.push(`Warm up by saying these out loud: ${facts}`);
    }

    if (report.stretches >= 3 && report.helpUses === 0) {
      ideas.push('Stuck on one? Tap 💡 Show Me! It is a power-up, not a cheat!');
    }

    if (report.avgSec !== null && report.avgSec > 5 && report.solved >= 5) {
      ideas.push(`Your average was ${report.avgSec.toFixed(1)} seconds per fact. Can you make it a little smoother next time?`);
    }

    ideas.push(`Come back tomorrow to grow your streak to 🔥 ${report.streak + 1}!`);

    // Keep the first idea (most specific) and add one random other
    const [first, ...rest] = ideas;
    return rest.length > 0 ? [first, pick(rest)] : [first];
  }

  // =========================================================================
  // Badge Picture (Canvas)
  // =========================================================================

  async loadFonts() {
    try {
      await Promise.all([
        document.fonts.load('700 60px Fredoka'),
        document.fonts.load('600 30px Outfit')
      ]);
    } catch (e) {}
  }

  async render(canvas, report) {
    await this.loadFonts();

    // Draw onto a tall scratch canvas, then crop to the real height
    const W = 1080;
    const scratch = document.createElement('canvas');
    scratch.width = W;
    scratch.height = 3600;
    const ctx = scratch.getContext('2d');
    const metal = METALS[report.metal];

    this.rand = seededRandom(report.seed);
    const height = this.drawAll(ctx, W, report, metal);

    canvas.width = W;
    canvas.height = height;
    canvas.getContext('2d').drawImage(scratch, 0, 0);
    canvas.setAttribute('aria-label',
      `${report.title} badge. ${report.solved} facts solved. ${report.praise.join(' ')} Tip: ${report.tip}`);
  }

  // Gallery thumbnail: just the sky, medal, and title banner
  async renderThumb(canvas, report) {
    await this.loadFonts();
    const W = 1080;
    const H = 900;
    const scratch = document.createElement('canvas');
    scratch.width = W;
    scratch.height = H;
    this.rand = seededRandom(report.seed);
    this.drawAll(scratch.getContext('2d'), W, report, METALS[report.metal], { artOnly: true });

    canvas.width = 360;
    canvas.height = 300;
    canvas.getContext('2d').drawImage(scratch, 0, 0, W, H, 0, 0, 360, 300);
  }

  drawAll(ctx, W, report, metal, { artOnly = false } = {}) {
    const sky = ctx.createLinearGradient(0, 0, 0, 3600);
    sky.addColorStop(0, metal.sky[0]);
    sky.addColorStop(0.35, metal.sky[1]);
    sky.addColorStop(1, '#05010f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 3600);

    this.drawNebula(ctx, W, metal);
    this.drawStarfield(ctx, W, 3600);

    // Header
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '600 32px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(`✦ ${this.badgeOwner(report)}'s Star Quest  •  ${this.prettyDate(report.date)} ✦`, W / 2, 70);

    this.drawMedallion(ctx, W / 2, 440, report, metal);

    // Badge title on a ribbon banner
    let y = this.drawBanner(ctx, W / 2, 800, report.title, metal);
    if (artOnly) return y;

    ctx.fillStyle = metal.light;
    ctx.font = '600 30px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(`${metal.name} Badge  •  ${report.minutes}-Minute Quest`, W / 2, y + 50);
    y += 100;

    y = this.drawStatTiles(ctx, W, y, report, metal);
    y = this.drawOpBars(ctx, W, y, report, metal);
    y = this.drawSection(ctx, W, y, '🏆 Highlights', report.praise, metal);
    if (report.mastered.length > 0) {
      y = this.drawChips(ctx, W, y, '🌟 Facts Maxed Out', report.mastered.map(m => `🌟 ${m}`), '#ffd166');
    }
    if (report.missed.length > 0) {
      y = this.drawChips(ctx, W, y, '🎯 Facts to Level Up',
        report.missed.map(m => `${m.label} = ${m.answer}`), '#06d6a0');
    }
    y = this.drawSection(ctx, W, y, '💡 Pro Tip', [report.tip], metal);
    y = this.drawSection(ctx, W, y, '🎮 Next Quest Ideas', report.nextTime.map(t => `• ${t}`), metal);

    // Footer
    y += 20;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '600 28px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(`${report.buddy.emoji} ${report.buddy.name} says: GG, ${this.badgeOwner(report)}! You're a legend!`, W / 2, y + 10);
    return y + 60;
  }

  prettyDate(dateStr) {
    const [yr, mo, dy] = dateStr.split('-').map(Number);
    return new Date(yr, mo - 1, dy).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  drawNebula(ctx, W, metal) {
    const colors = [metal.ribbon, metal.mid, '#00f5d4', '#a855f7'];
    for (let i = 0; i < 5; i++) {
      const x = this.rand() * W;
      const y = this.rand() * 900;
      const r = 220 + this.rand() * 260;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, this.withAlpha(colors[Math.floor(this.rand() * colors.length)], 0.28));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  drawStarfield(ctx, W, H) {
    for (let i = 0; i < 260; i++) {
      const x = this.rand() * W;
      const y = this.rand() * H;
      const r = this.rand() < 0.9 ? this.rand() * 1.8 + 0.4 : this.rand() * 3 + 2;
      ctx.fillStyle = `rgba(255,255,255,${0.25 + this.rand() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // A few sparkle crosses
    for (let i = 0; i < 14; i++) {
      this.sparkle(ctx, this.rand() * W, this.rand() * 950, 8 + this.rand() * 14, 'rgba(255,255,255,0.85)');
    }
  }

  sparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x, y, x + size, y);
    ctx.quadraticCurveTo(x, y, x, y + size);
    ctx.quadraticCurveTo(x, y, x - size, y);
    ctx.quadraticCurveTo(x, y, x, y - size);
    ctx.fill();
    ctx.restore();
  }

  starPath(ctx, cx, cy, points, outer, inner, rotation = -Math.PI / 2) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = rotation + (i * Math.PI) / points;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  drawMedallion(ctx, cx, cy, report, metal) {
    const points = { gold: 16, silver: 12, rose: 10 }[report.metal];

    // Ribbon tails behind the medal
    ctx.save();
    ctx.fillStyle = metal.ribbon;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.moveTo(cx + side * 40, cy + 120);
      ctx.lineTo(cx + side * 150, cy + 330);
      ctx.lineTo(cx + side * 105, cy + 310);
      ctx.lineTo(cx + side * 80, cy + 360);
      ctx.lineTo(cx + side * -10, cy + 150);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    // Glow halo
    const halo = ctx.createRadialGradient(cx, cy, 120, cx, cy, 340);
    halo.addColorStop(0, this.withAlpha(metal.mid, 0.55));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - 340, cy - 340, 680, 680);

    // Starburst edge
    const burst = ctx.createLinearGradient(cx, cy - 280, cx, cy + 280);
    burst.addColorStop(0, metal.light);
    burst.addColorStop(0.5, metal.mid);
    burst.addColorStop(1, metal.dark);
    this.starPath(ctx, cx, cy, points, 280, 228, -Math.PI / 2 + this.rand() * 0.3);
    ctx.fillStyle = burst;
    ctx.shadowColor = metal.mid;
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner disc
    const disc = ctx.createRadialGradient(cx - 50, cy - 60, 20, cx, cy, 215);
    disc.addColorStop(0, metal.sky[0]);
    disc.addColorStop(1, '#0a0220');
    ctx.beginPath();
    ctx.arc(cx, cy, 212, 0, Math.PI * 2);
    ctx.fillStyle = disc;
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = metal.light;
    ctx.stroke();

    // One tiny star around the ring for every fact solved (up to 60)
    const ringStars = Math.min(report.solved, 60);
    for (let i = 0; i < ringStars; i++) {
      const a = -Math.PI / 2 + (i / Math.max(ringStars, 1)) * Math.PI * 2;
      const sx = cx + Math.cos(a) * 180;
      const sy = cy + Math.sin(a) * 180;
      this.starPath(ctx, sx, sy, 5, 11, 4.5);
      ctx.fillStyle = i % 2 === 0 ? metal.light : metal.mid;
      ctx.fill();
    }

    // Swirling sparkles inside
    for (let i = 0; i < 8; i++) {
      const a = this.rand() * Math.PI * 2;
      const r = 60 + this.rand() * 90;
      this.sparkle(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6 + this.rand() * 8, this.withAlpha(metal.light, 0.8));
    }

    // Buddy in the center
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '170px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(report.buddy.emoji, cx, cy - 10);
    ctx.textBaseline = 'alphabetic';

    // Fact count under the buddy
    ctx.font = '700 40px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillStyle = metal.light;
    ctx.fillText(`${report.solved} ★`, cx, cy + 130);
  }

  drawBanner(ctx, cx, y, text, metal) {
    ctx.font = '700 58px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    let size = 58;
    while (ctx.measureText(text).width > 860 && size > 34) {
      size -= 2;
      ctx.font = `700 ${size}px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    }
    const w = Math.min(ctx.measureText(text).width + 120, 1000);
    const h = 100;

    // Folded banner ends
    ctx.fillStyle = this.shade(metal.ribbon, -0.35);
    [-1, 1].forEach(side => {
      const x0 = cx + side * (w / 2 - 10);
      ctx.beginPath();
      ctx.moveTo(x0, y - h / 2 + 18);
      ctx.lineTo(x0 + side * 60, y - h / 2 + 18);
      ctx.lineTo(x0 + side * 35, y + 9);
      ctx.lineTo(x0 + side * 60, y + h / 2 + 18);
      ctx.lineTo(x0, y + h / 2 + 18);
      ctx.closePath();
      ctx.fill();
    });

    const band = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    band.addColorStop(0, this.shade(metal.ribbon, 0.25));
    band.addColorStop(1, metal.ribbon);
    this.roundRect(ctx, cx - w / 2, y - h / 2, w, h, 18);
    ctx.fillStyle = band;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = metal.light;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, cx, y + 3);
    ctx.shadowBlur = 0;
    ctx.textBaseline = 'alphabetic';
    return y + h / 2;
  }

  drawStatTiles(ctx, W, y, report, metal) {
    const tiles = [
      { num: report.solved, label: 'Facts Solved' },
      { num: report.accuracy === null ? '—' : `${report.accuracy}%`, label: 'First Try' },
      { num: report.bestCombo, label: 'Best Combo' },
      { num: `🔥${report.streak}`, label: 'Day Streak' }
    ];
    const pad = 60;
    const gap = 20;
    const tw = (W - pad * 2 - gap * 3) / 4;
    const th = 150;

    tiles.forEach((t, i) => {
      const x = pad + i * (tw + gap);
      this.panel(ctx, x, y, tw, th);
      ctx.textAlign = 'center';
      ctx.fillStyle = metal.light;
      ctx.font = '700 54px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(String(t.num), x + tw / 2, y + 78);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '600 26px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(t.label, x + tw / 2, y + 122);
    });
    return y + th + 40;
  }

  drawOpBars(ctx, W, y, report, metal) {
    if (report.ops.length === 0) return y;
    const pad = 60;
    const rowH = 64;
    const h = 80 + report.ops.length * rowH;
    this.panel(ctx, pad, y, W - pad * 2, h);
    this.heading(ctx, pad + 36, y + 56, '📊 How Each Operation Went');

    report.ops.forEach((op, i) => {
      const ry = y + 100 + i * rowH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      // Icon in an emoji-only font so it stays in color (Outfit has plain + − × glyphs)
      ctx.font = '30px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(op.icon, pad + 36, ry + 12);
      ctx.font = '600 32px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(op.name, pad + 84, ry + 12);

      const bx = pad + 330;
      const bw = W - pad * 2 - 330 - 200;
      const pct = op.solved > 0 ? op.firstTry / op.solved : 0;
      this.roundRect(ctx, bx, ry - 14, bw, 30, 15);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fill();
      if (pct > 0) {
        const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
        grad.addColorStop(0, metal.ribbon);
        grad.addColorStop(1, metal.mid);
        this.roundRect(ctx, bx, ry - 14, Math.max(30, bw * pct), 30, 15);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '600 28px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(`${op.firstTry}/${op.solved} first try`, W - pad - 30, ry + 11);
    });
    return y + h + 30;
  }

  drawSection(ctx, W, y, title, lines, metal) {
    const pad = 60;
    const inner = W - pad * 2 - 72;
    ctx.font = '600 32px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    const wrapped = lines.map(line => this.wrap(ctx, line, inner));
    const lineH = 44;
    const totalLines = wrapped.reduce((n, w) => n + w.length, 0);
    const h = 90 + totalLines * lineH + (wrapped.length - 1) * 14;

    this.panel(ctx, pad, y, W - pad * 2, h);
    this.heading(ctx, pad + 36, y + 56, title);

    let ty = y + 108;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 32px Outfit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    wrapped.forEach(block => {
      block.forEach(line => {
        ctx.fillText(line, pad + 36, ty);
        ty += lineH;
      });
      ty += 14;
    });
    return y + h + 30;
  }

  drawChips(ctx, W, y, title, chips, color) {
    const pad = 60;
    const maxX = W - pad - 36;
    ctx.font = '700 30px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

    // Lay out chips into rows first so the panel height is known
    const rows = [[]];
    let x = pad + 36;
    chips.forEach(text => {
      const cw = ctx.measureText(text).width + 40;
      if (x + cw > maxX && rows[rows.length - 1].length > 0) {
        rows.push([]);
        x = pad + 36;
      }
      rows[rows.length - 1].push({ text, x, w: cw });
      x += cw + 14;
    });

    const chipH = 52;
    const h = 100 + rows.length * (chipH + 14);
    this.panel(ctx, pad, y, W - pad * 2, h);
    this.heading(ctx, pad + 36, y + 56, title);

    rows.forEach((row, ri) => {
      const cy = y + 84 + ri * (chipH + 14);
      row.forEach(chip => {
        this.roundRect(ctx, chip.x, cy, chip.w, chipH, chipH / 2);
        ctx.fillStyle = this.withAlpha(color, 0.18);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '700 30px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.fillText(chip.text, chip.x + chip.w / 2, cy + 36);
      });
    });
    return y + h + 30;
  }

  heading(ctx, x, y, text) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd166';
    ctx.font = '700 36px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(text, x, y);
  }

  panel(ctx, x, y, w, h) {
    this.roundRect(ctx, x, y, w, h, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.stroke();
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  wrap(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  withAlpha(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const mix = (c) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
    const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  // =========================================================================
  // Badge Gallery: reports are stored (not images) and redrawn from their seed
  // =========================================================================

  getGallery() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.galleryKey));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [];
  }

  addToGallery(report) {
    const gallery = this.getGallery();
    gallery.unshift(report);
    try {
      localStorage.setItem(this.galleryKey, JSON.stringify(gallery.slice(0, 365)));
    } catch (e) {}
  }

  // =========================================================================
  // Saving: share sheet on iPad (Save Image -> Photos), download elsewhere
  // =========================================================================

  // Badges made before names existed have no player saved: they belong to the current player
  badgeOwner(report) {
    return report.player || playerName() || 'Player';
  }

  async saveImage(canvas, report) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    const slug = this.badgeOwner(report).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player';
    const fileName = `${slug}-star-badge-${report.date}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${this.badgeOwner(report)}'s Star Badge` });
        return true;
      } catch (e) {
        if (e.name === 'AbortError') return false;
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  }
}

window.badgeMaker = new BadgeMaker();
