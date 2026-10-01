/**
 * Star Quest - Math Engine with Kid-Friendly Leitner System
 * 
 * Leitner Mastery System:
 * - Box 1: 🌱 Sprouting (New or recently struggled facts - seen 60% of the time)
 * - Box 2: 🌿 Growing (Practicing facts - seen 25% of the time)
 * - Box 3: 🌟 Mastered (Superstar facts - seen 15% of the time for confidence & retention)
 * 
 * Rules:
 * - Correct answer advances consecutive streak: 2 correct moves to Box 2, 4 correct moves to Box 3!
 * - Wrong answer drops gently back to Box 1 so she gets plenty of low-stress practice.
 * - Commutative pairs (e.g. 6×7 and 7×6, 8+7 and 7+8) share mastery progression!
 */

class LeitnerEngine {
  constructor() {
    this.storageKey = 'lyra_leitner_mastery_v2';
    this.masteryMap = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.masteryMap));
    } catch (e) {}
  }

  getFactKey(opType, num1, num2) {
    if (opType === 'mul' || opType === 'add') {
      const low = Math.min(num1, num2);
      const high = Math.max(num1, num2);
      return `${opType}_${low}_${high}`;
    }
    return `${opType}_${num1}_${num2}`;
  }

  getRecord(factKey) {
    if (!this.masteryMap[factKey]) {
      this.masteryMap[factKey] = {
        box: 1, // 1=Sprouting, 2=Growing, 3=Mastered
        streak: 0,
        correct: 0,
        wrong: 0,
        lastSeen: 0
      };
    }
    return this.masteryMap[factKey];
  }

  recordAnswer(factKey, isCorrect) {
    const rec = this.getRecord(factKey);
    rec.lastSeen = Date.now();

    if (isCorrect) {
      rec.correct++;
      rec.streak++;

      // Advance boxes on consecutive correct answers
      if (rec.box === 1 && rec.streak >= 2) {
        rec.box = 2;
      } else if (rec.box === 2 && rec.streak >= 4) {
        rec.box = 3; // Mastered!
      }
    } else {
      rec.wrong++;
      rec.streak = 0;
      // Gently return to Box 1 for more practice
      rec.box = 1;
    }

    this.save();
    return rec;
  }

  getBox(factKey) {
    return this.getRecord(factKey).box;
  }

  // Summary counts for the Star Garden
  getMasteryStats(activeKeys = null) {
    let box1 = 0, box2 = 0, box3 = 0;
    const keysToCheck = activeKeys || Object.keys(this.masteryMap);

    keysToCheck.forEach(key => {
      const box = this.getBox(key);
      if (box === 3) box3++;
      else if (box === 2) box2++;
      else box1++;
    });

    return {
      learning: box1,
      growing: box2,
      mastered: box3,
      total: keysToCheck.length
    };
  }

  resetAll() {
    this.masteryMap = {};
    this.save();
  }
}

// Shared date helper: the device's LOCAL calendar day as YYYY-MM-DD.
// (toISOString() is UTC, which made the day flip at 8 am in Singapore.)
function localDateStr(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Drill groups for addition & subtraction: the classic fact strategies, all within 20.
// Each gen() returns [a, b] pairs. (Multiplication drills by times table instead.)
const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

const DRILL_GROUPS = {
  add: [
    { id: 'plus12', name: '+1 / +2', example: '7+2', gen: () => range(1, 10).flatMap(a => [[a, 1], [a, 2]]) },
    { id: 'doubles', name: 'Doubles', example: '6+6', gen: () => range(1, 10).map(a => [a, a]) },
    { id: 'neardoubles', name: 'Near Doubles', example: '6+7', gen: () => range(1, 9).map(a => [a, a + 1]) },
    { id: 'tenpairs', name: 'Ten Pairs', example: '3+7', gen: () => range(1, 9).map(a => [a, 10 - a]) },
    { id: 'over10', name: 'Over 10', example: '8+5', gen: () => [8, 9].flatMap(a => range(11 - a, 9).map(b => [a, b])) },
    { id: 'plus10', name: '+10', example: '10+6', gen: () => range(1, 10).map(b => [10, b]) }
  ],
  sub: [
    { id: 'minus12', name: '−1 / −2', example: '9−2', gen: () => range(3, 12).flatMap(a => [[a, 1], [a, 2]]) },
    { id: 'from10', name: 'From 10', example: '10−4', gen: () => range(1, 9).map(b => [10, b]) },
    { id: 'halves', name: 'Halves', example: '14−7', gen: () => range(1, 10).map(b => [b * 2, b]) },
    { id: 'minus910', name: '−9 / −10', example: '15−9', gen: () => range(10, 20).flatMap(a => [[a, 9], [a, 10]]) },
    { id: 'across10', name: 'Across 10', example: '13−5', gen: () => range(11, 18).flatMap(a => range(a - 9, 9).map(b => [a, b])) }
  ]
};

class MathEngine {
  constructor() {
    this.leitner = new LeitnerEngine();
    this.lastProblem = null;
    this.settings = this.loadSettings();
    this.migrateDrills();
  }

  loadSettings() {
    const saved = localStorage.getItem('lyra_math_settings_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      dailyMinutes: 5,
      selectedOp: 'mixed', // 'mixed' | 'add' | 'sub' | 'mul'
      difficulty: 'medium', // 'gentle' | 'medium' | 'challenge' | 'custom'
      customOps: {
        add: true,
        sub: true,
        mul: true
      },
      addMaxSum: 20,
      mulTables: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      // Drill picks per operation (empty = All). mul: times tables 0-12; add/sub: DRILL_GROUPS ids
      drills: { mul: [], add: [], sub: [] }
    };
  }

  get drillGroups() {
    return DRILL_GROUPS;
  }

  // Settings saved before multi-select drills had a single drillTable
  migrateDrills() {
    if (!this.settings.drills) {
      const t = this.settings.drillTable;
      this.settings.drills = { mul: (t === undefined || t === 'all') ? [] : [parseInt(t, 10)], add: [], sub: [] };
      delete this.settings.drillTable;
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('lyra_math_settings_v3', JSON.stringify(this.settings));
  }

  setOperation(op) {
    this.settings.selectedOp = op;
    this.saveSettings(this.settings);
  }

  // Toggle one drill pick on/off for an operation; 'all' clears the picks
  toggleDrill(op, pick) {
    const picks = this.settings.drills[op] || [];
    if (pick === 'all') {
      this.settings.drills[op] = [];
    } else if (picks.includes(pick)) {
      this.settings.drills[op] = picks.filter(p => p !== pick);
    } else {
      this.settings.drills[op] = [...picks, pick];
    }
    if (op === 'mul') this.settings.drills.mul.sort((a, b) => a - b);
    this.saveSettings(this.settings);
  }

  // The drill in play ({ op, picks, label }), or null when not drilling (Mixed mode or All)
  get activeDrill() {
    const op = this.settings.selectedOp;
    const picks = (this.settings.drills && this.settings.drills[op]) || [];
    if (op === 'mixed' || picks.length === 0) return null;

    let label;
    if (op === 'mul') {
      const names = picks.map(t => `${t}s`);
      label = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
    } else {
      const names = DRILL_GROUPS[op].filter(g => picks.includes(g.id)).map(g => g.name);
      label = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
    }
    return { op, picks: picks.slice(), label };
  }

  // Facts for the add/sub drill groups that are picked
  drillFacts(op, picks, makeFact) {
    const seen = new Set();
    const facts = [];
    DRILL_GROUPS[op].filter(g => picks.includes(g.id)).forEach(g => {
      g.gen().forEach(([a, b]) => {
        const key = `${a}_${b}`;
        if (seen.has(key)) return;
        seen.add(key);
        facts.push(makeFact(a, b));
      });
    });
    return facts;
  }

  setDifficulty(diff) {
    this.settings.difficulty = diff;
    if (diff === 'gentle') {
      this.settings.addMaxSum = 10;
      this.settings.mulTables = [0, 1, 2, 5, 10];
    } else if (diff === 'medium') {
      this.settings.addMaxSum = 20;
      this.settings.mulTables = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else if (diff === 'challenge') {
      this.settings.addMaxSum = 100;
      this.settings.mulTables = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    this.saveSettings(this.settings);
  }

  // Returns all possible problem candidates under the current settings
  getCandidatePool(labFilter = null) {
    let op = this.settings.selectedOp || 'mixed';
    if (labFilter && labFilter.op) {
      op = labFilter.op;
    }

    const opsToInclude = [];
    if (op === 'mixed') {
      if (this.settings.customOps.add) opsToInclude.push('add');
      if (this.settings.customOps.sub) opsToInclude.push('sub');
      if (this.settings.customOps.mul) opsToInclude.push('mul');
      if (opsToInclude.length === 0) opsToInclude.push('mul');
    } else {
      opsToInclude.push(op);
    }

    const candidates = [];

    // Generate multiplication candidates
    if (opsToInclude.includes('mul')) {
      let tables = this.settings.mulTables || [0, 1, 2, 3, 4, 5, 10];
      if (labFilter && labFilter.table && labFilter.table !== 'all') {
        const t = parseInt(labFilter.table, 10);
        tables = t === 0 ? [0, 1] : [t];
      }
      let maxB = (this.settings.difficulty === 'gentle') ? 5 : ((this.settings.difficulty === 'challenge') ? 12 : 10);

      // Times-table drill: the picked tables, all the way from × 0 to × 12
      const drill = labFilter ? null : this.activeDrill;
      if (drill && drill.op === 'mul') {
        tables = drill.picks;
        maxB = 12;
      }

      tables.forEach(a => {
        for (let b = 0; b <= maxB; b++) {
          candidates.push({
            opType: 'mul',
            opSymbol: '×',
            opName: 'Multiplication',
            badgeIcon: '✖️',
            num1: a,
            num2: b,
            answer: a * b,
            factKey: this.leitner.getFactKey('mul', a, b)
          });
        }
      });
    }

    const drill = labFilter ? null : this.activeDrill;

    // Generate addition candidates
    if (opsToInclude.includes('add')) {
      const diff = this.settings.difficulty;
      if (drill && drill.op === 'add') {
        candidates.push(...this.drillFacts('add', drill.picks, (a, b) => ({
          opType: 'add', opSymbol: '+', opName: 'Addition', badgeIcon: '➕',
          num1: a, num2: b, answer: a + b, factKey: this.leitner.getFactKey('add', a, b)
        })));
      } else if (diff === 'gentle') {
        for (let a = 1; a <= 8; a++) {
          for (let b = 1; b <= (10 - a); b++) {
            candidates.push({
              opType: 'add',
              opSymbol: '+',
              opName: 'Addition',
              badgeIcon: '➕',
              num1: a,
              num2: b,
              answer: a + b,
              factKey: this.leitner.getFactKey('add', a, b)
            });
          }
        }
      } else if (diff === 'challenge') {
        for (let a = 10; a <= 50; a += 3) {
          for (let b = 4; b <= 30; b += 2) {
            if (a + b <= 100) {
              candidates.push({
                opType: 'add',
                opSymbol: '+',
                opName: 'Addition',
                badgeIcon: '➕',
                num1: a,
                num2: b,
                answer: a + b,
                factKey: this.leitner.getFactKey('add', a, b)
              });
            }
          }
        }
      } else {
        // Standard within 20
        const maxSum = this.settings.addMaxSum || 20;
        for (let a = 2; a <= 9; a++) {
          for (let b = 2; b <= Math.min(9, maxSum - a); b++) {
            candidates.push({
              opType: 'add',
              opSymbol: '+',
              opName: 'Addition',
              badgeIcon: '➕',
              num1: a,
              num2: b,
              answer: a + b,
              factKey: this.leitner.getFactKey('add', a, b)
            });
          }
        }
      }
    }

    // Generate subtraction candidates
    if (opsToInclude.includes('sub')) {
      const diff = this.settings.difficulty;
      if (drill && drill.op === 'sub') {
        candidates.push(...this.drillFacts('sub', drill.picks, (a, b) => ({
          opType: 'sub', opSymbol: '−', opName: 'Subtraction', badgeIcon: '➖',
          num1: a, num2: b, answer: a - b, factKey: this.leitner.getFactKey('sub', a, b)
        })));
      } else if (diff === 'gentle') {
        for (let ans = 1; ans <= 7; ans++) {
          for (let b = 1; b <= (10 - ans); b++) {
            const a = ans + b;
            candidates.push({
              opType: 'sub',
              opSymbol: '−',
              opName: 'Subtraction',
              badgeIcon: '➖',
              num1: a,
              num2: b,
              answer: ans,
              factKey: this.leitner.getFactKey('sub', a, b)
            });
          }
        }
      } else if (diff === 'challenge') {
        for (let ans = 10; ans <= 60; ans += 4) {
          for (let b = 5; b <= 35; b += 3) {
            const a = ans + b;
            candidates.push({
              opType: 'sub',
              opSymbol: '−',
              opName: 'Subtraction',
              badgeIcon: '➖',
              num1: a,
              num2: b,
              answer: ans,
              factKey: this.leitner.getFactKey('sub', a, b)
            });
          }
        }
      } else {
        for (let ans = 2; ans <= 9; ans++) {
          for (let b = 2; b <= 9; b++) {
            const a = ans + b;
            if (a <= (this.settings.addMaxSum || 20)) {
              candidates.push({
                opType: 'sub',
                opSymbol: '−',
                opName: 'Subtraction',
                badgeIcon: '➖',
                num1: a,
                num2: b,
                answer: ans,
                factKey: this.leitner.getFactKey('sub', a, b)
              });
            }
          }
        }
      }
    }

    return candidates;
  }

  // Select next problem using Leitner weighted sampling:
  // Box 1 (Sprouting/Struggled): 60% probability weight
  // Box 2 (Growing):             25% probability weight
  // Box 3 (Mastered):            15% probability weight
  generateProblem(mode = 'daily', labFilter = null) {
    const pool = this.getCandidatePool(labFilter);
    if (pool.length === 0) {
      return {
        id: 'fallback_1x1',
        opType: 'mul',
        opSymbol: '×',
        opName: 'Multiplication',
        badgeIcon: '✖️',
        num1: 2,
        num2: 2,
        answer: 4,
        expectedLength: 1,
        factKey: 'mul_2_2',
        box: 1
      };
    }

    // Separate into Leitner boxes
    const box1 = [];
    const box2 = [];
    const box3 = [];

    pool.forEach(item => {
      const box = this.leitner.getBox(item.factKey);
      item.box = box;
      if (box === 3) box3.push(item);
      else if (box === 2) box2.push(item);
      else box1.push(item);
    });

    // Roll weighted probability
    const roll = Math.random();
    let chosenList = box1;

    if (roll < 0.60 && box1.length > 0) {
      chosenList = box1;
    } else if (roll < 0.85 && box2.length > 0) {
      chosenList = box2;
    } else if (box3.length > 0) {
      chosenList = box3;
    } else if (box1.length > 0) {
      chosenList = box1;
    } else if (box2.length > 0) {
      chosenList = box2;
    } else {
      chosenList = pool;
    }

    // Pick random from chosen box, avoiding immediate repetition
    let selected;
    let attempts = 0;
    do {
      selected = chosenList[Math.floor(Math.random() * chosenList.length)];
      attempts++;
    } while (this.lastProblem && selected.factKey === this.lastProblem.factKey && attempts < 10 && chosenList.length > 1);

    // Randomize commutative display (e.g. 6x7 vs 7x6)
    if (selected.opType === 'mul' || selected.opType === 'add') {
      if (Math.random() > 0.5) {
        const temp = selected.num1;
        selected.num1 = selected.num2;
        selected.num2 = temp;
      }
    }

    selected.id = `${selected.opType}_${selected.num1}_${selected.num2}`;
    selected.expectedLength = String(selected.answer).length;
    this.lastProblem = selected;

    return selected;
  }

  // Called when the player answers
  recordAnswer(problem, isCorrect) {
    if (!problem || !problem.factKey) return;
    return this.leitner.recordAnswer(problem.factKey, isCorrect);
  }

  getHelpExplanation(problem) {
    const { opType, num1, num2, answer } = problem;
    if (opType === 'mul') {
      return this.getMultiplicationHelp(num1, num2, answer);
    } else if (opType === 'add') {
      return this.getAdditionHelp(num1, num2, answer);
    } else {
      return this.getSubtractionHelp(num1, num2, answer);
    }
  }

  // Hints teach the strategy but stop one step short: the player always finishes the last step herself
  getMultiplicationHelp(a, b, ans) {
    let tip = `Think of this as ${a} rows of ${b}. Count up your whole squad!`;
    let highlightRow = null;

    if (a === 0 || b === 0) {
      tip = "🌟 Zero Rule: If you have zero groups (or groups of zero), how many do you have in all?";
    } else if (a === 1 || b === 1) {
      const other = a === 1 ? b : a;
      tip = `🌟 One Rule: 1 group of ${other}... or ${other} groups of 1. How many is that?`;
    } else if (a === 2 || b === 2) {
      const other = a === 2 ? b : a;
      tip = `💡 Double it! What is ${other} + ${other}?`;
    } else if (a === 5 || b === 5) {
      const other = a === 5 ? b : a;
      tip = `💡 Skip-count by 5s, ${other} times: 5, 10, 15... where do you land?`;
    } else if (a === 6 || b === 6) {
      const other = a === 6 ? b : a;
      tip = `💡 Friendly Chunk: 5 × ${other} = ${5 * other}. Now add 1 more ${other}!`;
      highlightRow = 5;
    } else if (a === 9 || b === 9) {
      const other = a === 9 ? b : a;
      tip = `💡 10-Trick: 10 × ${other} = ${10 * other}. Now take away one ${other}!`;
    } else if (a === 4 || b === 4) {
      const other = a === 4 ? b : a;
      tip = `💡 Double-Double: Double ${other} is ${other * 2}. Now double that!`;
    }

    return {
      type: 'mul',
      title: `${a} × ${b}`,
      tip,
      rows: a,
      cols: b,
      highlightRow,
      total: ans
    };
  }

  getAdditionHelp(a, b, ans) {
    let tip = `Count on! Start at the bigger number and count up the rest.`;
    
    if (a + b > 10 && a < 10 && b < 10) {
      const needToMake10 = 10 - a;
      const leftOver = b - needToMake10;
      tip = `💡 Make a 10: Start with ${a}. Add ${needToMake10} to make 10. Then add the leftover ${leftOver}!`;
    } else if (a === b) {
      tip = `💡 Doubles Fact! What do two ${a}s make?`;
    } else if (Math.abs(a - b) === 1) {
      const smaller = Math.min(a, b);
      tip = `💡 Near-Doubles: Double ${smaller} is ${smaller * 2}. Now add 1 more!`;
    }

    return {
      type: 'add',
      title: `${a} + ${b}`,
      tip,
      num1: a,
      num2: b,
      total: ans
    };
  }

  getSubtractionHelp(a, b, ans) {
    const tip = `💡 Think Addition: ${b} + ? = ${a}. What number is missing?`;
    return {
      type: 'sub',
      title: `${a} − ${b}`,
      tip,
      total: a,
      takeAway: b,
      remain: ans
    };
  }
}

window.mathEngine = new MathEngine();
