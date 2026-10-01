/**
 * Lyra's Star Quest - Math Engine
 * Adaptive fact generator, spaced repetition queue, and visual manipulative models.
 */

class MathEngine {
  constructor() {
    this.recentMisses = []; // Queue for spaced re-testing of tricky facts
    this.lastProblem = null;
    
    // Load or default settings
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('lyra_math_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      dailyMinutes: 5,
      operations: {
        add: true,
        sub: true,
        mul: true
      },
      addMaxSum: 20,
      mulTables: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // Grade 3 core tables
    };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('lyra_math_settings', JSON.stringify(this.settings));
  }

  // Generates next problem based on mode (daily quest vs practice lab)
  generateProblem(mode = 'daily', labFilter = { op: 'mixed', table: 'all' }) {
    // 1. Spaced Repetition Check: If we have a pending retry problem, 30% chance to pop it
    if (mode === 'daily' && this.recentMisses.length > 0 && Math.random() < 0.35) {
      const retryProblem = this.recentMisses.shift();
      // Ensure it wasn't the immediate last problem
      if (!this.lastProblem || retryProblem.id !== this.lastProblem.id) {
        this.lastProblem = retryProblem;
        return retryProblem;
      } else {
        this.recentMisses.push(retryProblem); // push back
      }
    }

    // 2. Determine Operation
    let op = 'mul';
    if (mode === 'daily') {
      const allowedOps = [];
      if (this.settings.operations.add) allowedOps.push('add');
      if (this.settings.operations.sub) allowedOps.push('sub');
      if (this.settings.operations.mul) allowedOps.push('mul');

      if (allowedOps.length === 0) allowedOps.push('mul');
      op = allowedOps[Math.floor(Math.random() * allowedOps.length)];
    } else {
      // Lab mode
      if (labFilter.op === 'mixed') {
        const pool = ['add', 'sub', 'mul'];
        op = pool[Math.floor(Math.random() * pool.length)];
      } else {
        op = labFilter.op;
      }
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
    if (allowedTables.length === 0) allowedTables = [2, 3, 4, 5, 10];

    // If lab mode specifies a single table
    if (labFilter && labFilter.table !== 'all') {
      const selectedT = parseInt(labFilter.table, 10);
      if (selectedT === 0) {
        allowedTables = [0, 1];
      } else {
        allowedTables = [selectedT];
      }
    }

    // Pick table a
    const a = allowedTables[Math.floor(Math.random() * allowedTables.length)];
    // Pick multiplier b (0 to 10 or 12)
    const maxB = 10;
    const b = Math.floor(Math.random() * (maxB + 1));

    // Randomize order for commutativity: a x b or b x a
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
    const maxSum = this.settings.addMaxSum || 20;
    // Aim for meaningful Grade 2-3 addition (e.g. sums between 7 and maxSum)
    let num1, num2, answer;
    
    if (maxSum <= 20) {
      // Focus on single-digit plus single-digit crossing 10 (e.g., 8+7, 9+6, 7+5)
      num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const remainingMax = Math.min(9, maxSum - num1);
      num2 = Math.floor(Math.random() * (remainingMax - 1)) + 2;
    } else {
      num1 = Math.floor(Math.random() * (maxSum - 10)) + 5;
      num2 = Math.floor(Math.random() * (maxSum - num1)) + 1;
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
    const maxSum = this.settings.addMaxSum || 20;
    let num1, num2, answer;

    if (maxSum <= 20) {
      // Meaningful subtraction within 20 with bridging 10 (e.g. 15-8, 13-7, 14-6)
      answer = Math.floor(Math.random() * 8) + 2; // 2 to 9
      num2 = Math.floor(Math.random() * 8) + 2;   // 2 to 9
      num1 = answer + num2;                       // num1 is 4 to 18
    } else {
      num1 = Math.floor(Math.random() * (maxSum - 10)) + 10;
      num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
      answer = num1 - num2;
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

  // Queue problem for spaced repetition when struggled
  recordStruggle(problem) {
    if (!this.recentMisses.some(p => p.id === problem.id)) {
      this.recentMisses.push(problem);
    }
  }

  // Generate visual manipulatives data & pedagogical hints
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
    // Determine friendly decomposition tip
    let tip = `Think of this as ${a} groups of ${b} glowing stars!`;
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
    let tip = `Count the dots together: ${a} cyan dots + ${b} magenta dots = ${ans}!`;
    
    // Ten-frame making 10 tip
    if (a + b > 10 && a < 10 && b < 10) {
      const needToMake10 = 10 - a;
      const leftOver = b - needToMake10;
      tip = `💡 Make a 10: Start with ${a}. Add ${needToMake10} to make 10, then add the leftover ${leftOver} = ${ans}!`;
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
