/**
 * Lyra's Star Quest - Math Engine with Kid-Friendly Leitner System
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

class MathEngine {
  constructor() {
    this.leitner = new LeitnerEngine();
    this.lastProblem = null;
    this.settings = this.loadSettings();
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
      drillTable: 'all' // 'all' or a single times table (0-12) to drill in Just Multiplying mode
    };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('lyra_math_settings_v3', JSON.stringify(this.settings));
  }

  setOperation(op) {
    this.settings.selectedOp = op;
    this.saveSettings(this.settings);
  }

  setDrillTable(table) {
    this.settings.drillTable = table;
    this.saveSettings(this.settings);
  }

  // The single table being drilled, or null when not drilling
  get activeDrillTable() {
    const t = this.settings.drillTable;
    if (this.settings.selectedOp !== 'mul' || t === undefined || t === 'all') return null;
    return parseInt(t, 10);
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

      // Times-table drill: one table, all the way from × 0 to × 12
      const drill = labFilter ? null : this.activeDrillTable;
      if (drill !== null) {
        tables = [drill];
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

    // Generate addition candidates
    if (opsToInclude.includes('add')) {
      const diff = this.settings.difficulty;
      if (diff === 'gentle') {
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
      if (diff === 'gentle') {
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

  // Called when Lyra answers
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

  getMultiplicationHelp(a, b, ans) {
    let tip = `Think of this as ${a} rows of ${b}. Count up your whole squad!`;
    let highlightRow = null;

    if (a === 0 || b === 0) {
      tip = "🌟 Zero Rule: Anything times 0 is always 0!";
    } else if (a === 1 || b === 1) {
      tip = `🌟 One Rule: Any number times 1 stays itself (${ans})!`;
    } else if (a === 2 || b === 2) {
      const other = a === 2 ? b : a;
      tip = `💡 Double it! ${other} + ${other} = ${ans}`;
    } else if (a === 5 || b === 5) {
      tip = `💡 Skip-count by 5s: count up by 5s to find ${ans}!`;
    } else if (a === 6 || b === 6) {
      const other = a === 6 ? b : a;
      tip = `💡 Friendly Chunk: 5 × ${other} = ${5 * other}, plus 1 more ${other} makes ${ans}!`;
      highlightRow = 5;
    } else if (a === 9 || b === 9) {
      const other = a === 9 ? b : a;
      tip = `💡 10-Trick: 10 × ${other} = ${10 * other}, take away ${other} = ${ans}!`;
    } else if (a === 4 || b === 4) {
      const other = a === 4 ? b : a;
      tip = `💡 Double-Double: Double ${other} is ${other * 2}, and double that is ${ans}!`;
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
    let tip = `Count them up together: ${a} + ${b} = ${ans}!`;
    
    if (a + b > 10 && a < 10 && b < 10) {
      const needToMake10 = 10 - a;
      const leftOver = b - needToMake10;
      tip = `💡 Make a 10: Start with ${a}. Add ${needToMake10} to make 10, then add leftover ${leftOver} = ${ans}!`;
    } else if (a === b) {
      tip = `💡 Doubles Fact! Two ${a}s make ${ans}!`;
    } else if (Math.abs(a - b) === 1) {
      const smaller = Math.min(a, b);
      tip = `💡 Near-Doubles: Double ${smaller} is ${smaller * 2}, plus 1 is ${ans}!`;
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
    const tip = `💡 Think Addition: What number plus ${b} makes ${a}? (${b} + ${ans} = ${a})!`;
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
