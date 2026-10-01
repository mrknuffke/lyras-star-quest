/**
 * Lyra's Star Quest - Math Engine
 * Adaptive fact generator with sticky difficulty presets (Easy / Medium / Challenge),
 * sticky single-operation selection (Just Adding, Just Subtracting, Just Multiplying, or Mixed),
 * spaced repetition queue, and visual manipulative models.
 */

class MathEngine {
  constructor() {
    this.recentMisses = []; // Queue for spaced re-testing of tricky facts
    this.lastProblem = null;
    
    // Load sticky settings from localStorage
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('lyra_math_settings_v2');
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
      mulTables: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('lyra_math_settings_v2', JSON.stringify(this.settings));
  }

  setOperation(op) {
    this.settings.selectedOp = op;
    this.saveSettings(this.settings);
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

  // Generates next problem
  generateProblem(mode = 'daily', labFilter = { op: 'mixed', table: 'all' }) {
    // 1. Spaced Repetition Check: If we have a pending retry problem, 35% chance to re-test it
    if (this.recentMisses.length > 0 && Math.random() < 0.35) {
      const retryProblem = this.recentMisses.shift();
      if (!this.lastProblem || retryProblem.id !== this.lastProblem.id) {
        this.lastProblem = retryProblem;
        return retryProblem;
      } else {
        this.recentMisses.push(retryProblem);
      }
    }

    // 2. Determine Operation (based on sticky selection)
    let op = this.settings.selectedOp || 'mixed';
    if (mode === 'lab' && labFilter && labFilter.op) {
      op = labFilter.op;
    }

    if (op === 'mixed') {
      const pool = [];
      if (this.settings.customOps.add) pool.push('add');
      if (this.settings.customOps.sub) pool.push('sub');
      if (this.settings.customOps.mul) pool.push('mul');
      if (pool.length === 0) pool.push('mul');
      op = pool[Math.floor(Math.random() * pool.length)];
    }

    let problem;
    let attempts = 0;
    do {
      if (op === 'mul') {
        problem = this.generateMultiplication(labFilter);
      } else if (op === 'add') {
        problem = this.generateAddition();
      } else {
        problem = this.generateSubtraction();
      }
      attempts++;
    } while (this.lastProblem && problem.id === this.lastProblem.id && attempts < 10);

    this.lastProblem = problem;
    return problem;
  }

  generateMultiplication(labFilter) {
    let allowedTables = this.settings.mulTables;
    if (!allowedTables || allowedTables.length === 0) {
      allowedTables = [0, 1, 2, 3, 4, 5, 10];
    }

    if (labFilter && labFilter.table && labFilter.table !== 'all') {
      const selectedT = parseInt(labFilter.table, 10);
      allowedTables = selectedT === 0 ? [0, 1] : [selectedT];
    }

    // In challenge mode, give higher weight to trickier tables (6, 7, 8, 9, 12)
    let a;
    if (this.settings.difficulty === 'challenge' && Math.random() < 0.65) {
      const hardPool = [6, 7, 8, 9, 11, 12].filter(n => allowedTables.includes(n));
      a = hardPool.length > 0 ? hardPool[Math.floor(Math.random() * hardPool.length)] : allowedTables[Math.floor(Math.random() * allowedTables.length)];
    } else {
      a = allowedTables[Math.floor(Math.random() * allowedTables.length)];
    }

    const maxB = (this.settings.difficulty === 'gentle') ? 5 : ((this.settings.difficulty === 'challenge') ? 12 : 10);
    const b = Math.floor(Math.random() * (maxB + 1));

    const swap = Math.random() > 0.5;
    const num1 = swap ? b : a;
    const num2 = swap ? a : b;
    const answer = num1 * num2;

    return {
      id: `mul_${num1}x${num2}`,
      opType: 'mul',
      opSymbol: '×',
      opName: 'Multiplication',
      badgeIcon: '✖️',
      num1,
      num2,
      answer,
      expectedLength: String(answer).length
    };
  }

  generateAddition() {
    const diff = this.settings.difficulty;
    let num1, num2, answer;

    if (diff === 'gentle') {
      // Within 10
      num1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
      num2 = Math.floor(Math.random() * (10 - num1)) + 1;
    } else if (diff === 'challenge') {
      // Challenge: 2-digit + 1-digit, or sums up to 100
      num1 = Math.floor(Math.random() * 45) + 12;
      num2 = Math.floor(Math.random() * 25) + 4;
    } else {
      // Grade 3 Standard (Medium): sums crossing 10 within 20 (e.g. 8+7, 9+5, 6+8)
      num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const rem = Math.min(9, (this.settings.addMaxSum || 20) - num1);
      num2 = Math.floor(Math.random() * (rem - 1)) + 2;
    }

    answer = num1 + num2;
    return {
      id: `add_${num1}+${num2}`,
      opType: 'add',
      opSymbol: '+',
      opName: 'Addition',
      badgeIcon: '➕',
      num1,
      num2,
      answer,
      expectedLength: String(answer).length
    };
  }

  generateSubtraction() {
    const diff = this.settings.difficulty;
    let num1, num2, answer;

    if (diff === 'gentle') {
      // Facts within 10
      answer = Math.floor(Math.random() * 6) + 1; // 1 to 6
      num2 = Math.floor(Math.random() * (10 - answer)) + 1;
      num1 = answer + num2;
    } else if (diff === 'challenge') {
      // Two-digit subtraction
      num1 = Math.floor(Math.random() * 60) + 20;
      num2 = Math.floor(Math.random() * (num1 - 8)) + 3;
      answer = num1 - num2;
    } else {
      // Standard: Facts within 20 crossing 10 (e.g. 15-7, 14-8, 13-6)
      answer = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
      num1 = answer + num2;
    }

    return {
      id: `sub_${num1}-${num2}`,
      opType: 'sub',
      opSymbol: '−',
      opName: 'Subtraction',
      badgeIcon: '➖',
      num1,
      num2,
      answer,
      expectedLength: String(answer).length
    };
  }

  recordStruggle(problem) {
    if (!this.recentMisses.some(p => p.id === problem.id)) {
      this.recentMisses.push(problem);
    }
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
    let tip = `Think of this as ${a} groups of ${b} glowing stars or caticorns!`;
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
