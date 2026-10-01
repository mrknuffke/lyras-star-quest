/**
 * Lyra's Star Quest - Main Application Controller
 * Handles gameplay loop, timer, user input, UI orchestration, and persistence.
 */

class StarQuestApp {
  constructor() {
    this.mode = 'daily'; // 'daily' | 'lab'
    this.currentProblem = null;
    this.inputBuffer = '';
    this.isChecking = false;
    this.sessionSolvedCount = 0;
    this.sessionAttemptCount = 0;
    this.comboCount = 0;

    // Timer state
    this.timerInterval = null;
    this.isPaused = false;
    this.totalQuestSeconds = 300; // 5 mins
    this.remainingSeconds = 300;
    this.questCompletedToday = false;

    // Lab filter
    this.labFilter = { op: 'mixed', table: 'all' };

    // Themes
    this.themes = ['nebula', 'enchanted', 'candy', 'sunset'];
    this.currentThemeIndex = 0;

    this.initElements();
    this.loadState();
    this.setupEventListeners();
    this.startQuestTimer();
    this.nextProblem();
  }

  initElements() {
    // Top bar elements
    this.streakCountEl = document.getElementById('streakCount');
    this.starsEarnedEl = document.getElementById('starsEarned');
    this.questTimerEl = document.getElementById('questTimer');
    this.timerProgressRing = document.getElementById('timerProgressRing');
    this.timerTitleEl = document.getElementById('timerTitle');
    this.timerSubEl = document.getElementById('timerSub');
    this.pausePlayBtn = document.getElementById('pausePlayBtn');
    this.pauseIcon = document.getElementById('pauseIcon');
    this.pauseText = document.getElementById('pauseText');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.constellationBtn = document.getElementById('constellationBtn');
    this.settingsBtn = document.getElementById('settingsBtn');

    // Navigation tabs
    this.tabDailyQuest = document.getElementById('tabDailyQuest');
    this.tabPracticeLab = document.getElementById('tabPracticeLab');
    this.questStatusCard = document.getElementById('questStatusCard');
    this.labFilterBar = document.getElementById('labFilterBar');
    this.labOpChips = document.getElementById('labOpChips');
    this.labMulTableGroup = document.getElementById('labMulTableGroup');
    this.labTableSelect = document.getElementById('labTableSelect');

    // Challenge Card elements
    this.challengeCard = document.getElementById('challengeCard');
    this.opBadge = document.getElementById('opBadge');
    this.opBadgeIcon = document.getElementById('opBadgeIcon');
    this.opBadgeText = document.getElementById('opBadgeText');
    this.firstNumEl = document.getElementById('firstNum');
    this.secondNumEl = document.getElementById('secondNum');
    this.mathOpEl = document.getElementById('mathOp');
    this.answerSlot = document.getElementById('answerSlot');
    this.answerTextEl = document.getElementById('answerText');
    this.feedbackBanner = document.getElementById('feedbackBanner');
    this.helpBtn = document.getElementById('helpBtn');

    // Keypad
    this.keypad = document.getElementById('keypad');

    // Modals
    this.helpModal = document.getElementById('helpModal');
    this.closeHelpBtn = document.getElementById('closeHelpBtn');
    this.gotItHelpBtn = document.getElementById('gotItHelpBtn');
    this.helpTitle = document.getElementById('helpTitle');
    this.helpContentBody = document.getElementById('helpContentBody');

    this.celebrationModal = document.getElementById('celebrationModal');
    this.celebSolved = document.getElementById('celebSolved');
    this.celebAccuracy = document.getElementById('celebAccuracy');
    this.celebStreak = document.getElementById('celebStreak');
    this.viewConstellationFromCelebBtn = document.getElementById('viewConstellationFromCelebBtn');
    this.keepPracticingBtn = document.getElementById('keepPracticingBtn');

    this.constellationModal = document.getElementById('constellationModal');
    this.closeConstellationBtn = document.getElementById('closeConstellationBtn');
    this.constellationCanvas = document.getElementById('constellationCanvas');
    this.constellationDaysCount = document.getElementById('constellationDaysCount');
    this.currentRankBadge = document.getElementById('currentRankBadge');

    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    this.dailyMinutesSelect = document.getElementById('dailyMinutesSelect');
    this.settingOpAdd = document.getElementById('settingOpAdd');
    this.settingOpSub = document.getElementById('settingOpSub');
    this.settingOpMul = document.getElementById('settingOpMul');
    this.settingsTableGrid = document.getElementById('settingsTableGrid');
    this.addMaxSumSelect = document.getElementById('addMaxSum');
    this.resetTodayBtn = document.getElementById('resetTodayBtn');
    this.resetAllDataBtn = document.getElementById('resetAllDataBtn');
  }

  loadState() {
    // 1. Saved theme
    const savedTheme = localStorage.getItem('lyra_theme') || 'nebula';
    document.body.setAttribute('data-theme', savedTheme);
    this.currentThemeIndex = this.themes.indexOf(savedTheme);
    if (this.currentThemeIndex === -1) this.currentThemeIndex = 0;

    // 2. Sound state icon
    if (window.soundEngine && window.soundEngine.isMuted) {
      this.soundToggleBtn.textContent = '🔇';
    }

    // 3. Daily streak & constellation tracking
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastPlayedDate = localStorage.getItem('lyra_last_played_date');
    let streak = parseInt(localStorage.getItem('lyra_streak_count') || '1', 10);
    let constellationDays = parseInt(localStorage.getItem('lyra_constellation_days') || '1', 10);

    if (lastPlayedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastPlayedDate === yesterdayStr) {
        // Continuing streak
      } else if (lastPlayedDate !== todayStr) {
        // Broken streak if more than 1 day skipped
        streak = 1;
      }
    }

    this.streak = streak;
    this.constellationDays = constellationDays;
    this.streakCountEl.textContent = this.streak;

    // 4. Timer recovery for today
    const settings = window.mathEngine.settings;
    this.totalQuestSeconds = (settings.dailyMinutes || 5) * 60;

    const savedTimerDate = localStorage.getItem('lyra_timer_date');
    const savedRemaining = localStorage.getItem('lyra_timer_remaining');
    const questDone = localStorage.getItem('lyra_quest_done_today') === 'true';

    if (savedTimerDate === todayStr && savedRemaining !== null) {
      this.remainingSeconds = parseInt(savedRemaining, 10);
      this.questCompletedToday = questDone;
      if (this.questCompletedToday) {
        this.timerTitleEl.textContent = "Today's Quest Done! ⭐";
        this.timerSubEl.textContent = "Keep practicing for extra stars!";
      }
    } else {
      this.remainingSeconds = this.totalQuestSeconds;
      this.questCompletedToday = false;
      localStorage.setItem('lyra_quest_done_today', 'false');
    }

    this.updateTimerDisplay();

    // 5. Stars earned today
    const savedStars = localStorage.getItem('lyra_stars_today');
    const starsDate = localStorage.getItem('lyra_stars_date');
    this.starsToday = (starsDate === todayStr && savedStars) ? parseInt(savedStars, 10) : 0;
    this.starsEarnedEl.textContent = this.starsToday;
  }

  setupEventListeners() {
    // Sound Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      this.soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) window.soundEngine.playKeyClick();
    });

    // Theme Toggle
    this.themeToggleBtn.addEventListener('click', () => {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
      const nextTheme = this.themes[this.currentThemeIndex];
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('lyra_theme', nextTheme);
      if (window.soundEngine) window.soundEngine.playKeyClick();
    });

    // Constellation Modal
    this.constellationBtn.addEventListener('click', () => this.openConstellationModal());
    this.closeConstellationBtn.addEventListener('click', () => this.closeConstellationModal());

    // Settings Modal
    this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettingsFromModal());
    this.resetTodayBtn.addEventListener('click', () => this.resetTodayTimer());
    this.resetAllDataBtn.addEventListener('click', () => this.resetAllData());

    // Mode Navigation Tabs
    this.tabDailyQuest.addEventListener('click', () => this.switchMode('daily'));
    this.tabPracticeLab.addEventListener('click', () => this.switchMode('lab'));

    // Pause / Play Timer
    this.pausePlayBtn.addEventListener('click', () => this.togglePauseTimer());

    // Lab Filter Chips
    if (this.labOpChips) {
      this.labOpChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        this.labOpChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.labFilter.op = chip.dataset.op;

        // Show table dropdown if multiplication is selected
        if (this.labFilter.op === 'mul') {
          this.labMulTableGroup.classList.remove('hidden');
        } else {
          this.labMulTableGroup.classList.add('hidden');
        }
        this.nextProblem();
      });
    }

    if (this.labTableSelect) {
      this.labTableSelect.addEventListener('change', (e) => {
        this.labFilter.table = e.target.value;
        this.nextProblem();
      });
    }

    // Keypad Touch / Click Listeners
    if (this.keypad) {
      this.keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.key-btn');
        if (!btn) return;
        const key = btn.dataset.key;
        this.handleKeyInput(key);

        // Visual press state
        btn.classList.add('key-pressed');
        setTimeout(() => btn.classList.remove('key-pressed'), 120);
      });
    }

    // Physical Keyboard Listener
    window.addEventListener('keydown', (e) => {
      // Ignore if a modal input/select has focus
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

      if (e.key >= '0' && e.key <= '9') {
        this.handleKeyInput(e.key);
      } else if (e.key === 'Backspace') {
        this.handleKeyInput('Backspace');
      } else if (e.key === 'Enter') {
        this.handleKeyInput('Enter');
      } else if (e.key.toLowerCase() === 'h') {
        this.openHelpModal();
      } else if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Help Button
    this.helpBtn.addEventListener('click', () => this.openHelpModal());
    this.closeHelpBtn.addEventListener('click', () => this.closeHelpModal());
    this.gotItHelpBtn.addEventListener('click', () => this.closeHelpModal());

    // Celebration modal actions
    this.viewConstellationFromCelebBtn.addEventListener('click', () => {
      this.celebrationModal.classList.add('hidden');
      this.openConstellationModal();
    });
    this.keepPracticingBtn.addEventListener('click', () => {
      this.celebrationModal.classList.add('hidden');
      this.switchMode('lab');
    });
  }

  closeAllModals() {
    this.helpModal.classList.add('hidden');
    this.celebrationModal.classList.add('hidden');
    this.constellationModal.classList.add('hidden');
    this.settingsModal.classList.add('hidden');
  }

  switchMode(newMode) {
    this.mode = newMode;
    if (newMode === 'daily') {
      this.tabDailyQuest.classList.add('active');
      this.tabPracticeLab.classList.remove('active');
      this.questStatusCard.classList.remove('hidden');
      this.labFilterBar.classList.add('hidden');
    } else {
      this.tabDailyQuest.classList.remove('active');
      this.tabPracticeLab.classList.add('active');
      this.questStatusCard.classList.add('hidden');
      this.labFilterBar.classList.remove('hidden');
    }
    this.nextProblem();
  }

  // =========================================================================
  // Game Loop & Input Handling
  // =========================================================================

  nextProblem() {
    this.isChecking = false;
    this.inputBuffer = '';
    this.answerTextEl.textContent = '';
    this.feedbackBanner.textContent = '';
    this.feedbackBanner.className = 'feedback-banner';

    this.currentProblem = window.mathEngine.generateProblem(this.mode, this.labFilter);
    this.renderProblem();
  }

  renderProblem() {
    const p = this.currentProblem;
    this.firstNumEl.textContent = p.num1;
    this.secondNumEl.textContent = p.num2;
    this.mathOpEl.textContent = p.opSymbol;
    this.opBadgeIcon.textContent = p.badgeIcon;
    this.opBadgeText.textContent = p.opName;
  }

  handleKeyInput(key) {
    if (this.isChecking) return;

    if (key >= '0' && key <= '9') {
      if (this.inputBuffer.length < 4) {
        this.inputBuffer += key;
        this.answerTextEl.textContent = this.inputBuffer;
        if (window.soundEngine) window.soundEngine.playKeyClick();

        // Auto-check if length reaches expected answer length
        if (this.inputBuffer.length === this.currentProblem.expectedLength) {
          this.checkAnswer();
        }
      }
    } else if (key === 'Backspace') {
      if (this.inputBuffer.length > 0) {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.answerTextEl.textContent = this.inputBuffer;
        if (window.soundEngine) window.soundEngine.playKeyClick();
      }
    } else if (key === 'Enter') {
      if (this.inputBuffer.length > 0) {
        this.checkAnswer();
      }
    }
  }

  checkAnswer() {
    if (this.isChecking || this.inputBuffer.length === 0) return;
    this.isChecking = true;
    this.sessionAttemptCount++;

    const entered = parseInt(this.inputBuffer, 10);
    const correct = this.currentProblem.answer;

    if (entered === correct) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }
  }

  handleCorrectAnswer() {
    this.sessionSolvedCount++;
    this.comboCount++;
    this.starsToday++;
    this.starsEarnedEl.textContent = this.starsToday;

    // Save stars
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lyra_stars_today', this.starsToday);
    localStorage.setItem('lyra_stars_date', todayStr);

    // Audio & Visual celebratory feedback
    if (window.soundEngine) {
      window.soundEngine.playCorrect(this.comboCount);
    }

    this.challengeCard.classList.add('correct-flash');
    const cheers = ["✨ Stellar!", "🌟 Brilliant, Lyra!", "🚀 Star Speed!", "💫 Math Magic!", "🎉 Outstanding!"];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    this.feedbackBanner.textContent = cheer;
    this.feedbackBanner.className = 'feedback-banner success';

    // Mini confetti burst on combo milestones
    if (this.comboCount % 5 === 0 && window.easterEggs) {
      window.easterEggs.burstConfetti(45);
    }

    setTimeout(() => {
      this.challengeCard.classList.remove('correct-flash');
      this.nextProblem();
    }, 550);
  }

  handleIncorrectAnswer() {
    this.comboCount = 0;
    if (window.soundEngine) {
      window.soundEngine.playTryAgain();
    }

    // Queue for spaced repetition
    window.mathEngine.recordStruggle(this.currentProblem);

    this.challengeCard.classList.add('shake-wrong');
    this.feedbackBanner.textContent = "Almost! Tap 'Show Me' if you need a hint 💡";
    this.feedbackBanner.className = 'feedback-banner try-again';

    setTimeout(() => {
      this.challengeCard.classList.remove('shake-wrong');
      this.inputBuffer = '';
      this.answerTextEl.textContent = '';
      this.isChecking = false;
    }, 450);
  }

  // =========================================================================
  // 5-Minute Daily Quest Timer
  // =========================================================================

  startQuestTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.questCompletedToday || this.mode !== 'daily') return;

      this.remainingSeconds--;
      this.updateTimerDisplay();

      // Persist timer state
      const todayStr = new Date().toISOString().slice(0, 10);
      localStorage.setItem('lyra_timer_remaining', this.remainingSeconds);
      localStorage.setItem('lyra_timer_date', todayStr);

      if (this.remainingSeconds <= 0) {
        this.completeDailyQuest();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(Math.max(0, this.remainingSeconds) / 60);
    const secs = Math.max(0, this.remainingSeconds) % 60;
    this.questTimerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update circular progress SVG
    const circumference = 2 * Math.PI * 23; // r=23 => ~144.5
    const progress = Math.max(0, this.remainingSeconds) / this.totalQuestSeconds;
    const offset = circumference * (1 - progress);
    this.timerProgressRing.style.strokeDashoffset = offset;

    if (this.remainingSeconds <= 30 && this.remainingSeconds > 0) {
      this.timerProgressRing.classList.add('urgent');
    } else {
      this.timerProgressRing.classList.remove('urgent');
    }
  }

  togglePauseTimer() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseIcon.textContent = '▶️';
      this.pauseText.textContent = 'Resume';
      this.timerSubEl.textContent = 'Quest Paused ⏸️';
    } else {
      this.pauseIcon.textContent = '⏸️';
      this.pauseText.textContent = 'Pause';
      this.timerSubEl.textContent = 'You got this, star explorer!';
    }
  }

  completeDailyQuest() {
    this.questCompletedToday = true;
    localStorage.setItem('lyra_quest_done_today', 'true');

    // Update streak and constellation
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastPlayed = localStorage.getItem('lyra_last_played_date');
    if (lastPlayed !== todayStr) {
      this.streak++;
      this.constellationDays++;
      localStorage.setItem('lyra_streak_count', this.streak);
      localStorage.setItem('lyra_constellation_days', this.constellationDays);
      localStorage.setItem('lyra_last_played_date', todayStr);
      this.streakCountEl.textContent = this.streak;
    }

    // Audio & Confetti
    if (window.soundEngine) window.soundEngine.playCelebration();
    if (window.easterEggs) window.easterEggs.burstConfetti(140);

    // Populate Celebration Modal
    const accuracy = this.sessionAttemptCount > 0
      ? Math.round((this.sessionSolvedCount / this.sessionAttemptCount) * 100)
      : 100;
    this.celebSolved.textContent = this.sessionSolvedCount;
    this.celebAccuracy.textContent = `${accuracy}%`;
    this.celebStreak.textContent = `🔥 ${this.streak}`;

    this.timerTitleEl.textContent = "Today's Quest Done! ⭐";
    this.timerSubEl.textContent = "New star added to your sky map!";

    this.celebrationModal.classList.remove('hidden');
  }

  // =========================================================================
  // Interactive Visual Help System
  // =========================================================================

  openHelpModal() {
    if (!this.currentProblem) return;
    const data = window.mathEngine.getHelpExplanation(this.currentProblem);
    this.helpTitle.textContent = `✨ Breaking Down ${data.title}`;
    this.helpContentBody.innerHTML = '';

    // Render Strategy Tip Box
    const tipBox = document.createElement('div');
    tipBox.className = 'help-tip-box';
    tipBox.innerHTML = `<strong>Concept:</strong> ${data.tip}`;
    this.helpContentBody.appendChild(tipBox);

    // Render Visual Manipulatives
    const visualContainer = document.createElement('div');
    visualContainer.className = 'help-visual-container';

    if (data.type === 'mul') {
      this.renderStarArray(visualContainer, data);
    } else if (data.type === 'add') {
      this.renderTenFrames(visualContainer, data);
    } else {
      this.renderSubtractionModel(visualContainer, data);
    }

    this.helpContentBody.appendChild(visualContainer);
    this.helpModal.classList.remove('hidden');
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  closeHelpModal() {
    this.helpModal.classList.add('hidden');
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  renderStarArray(container, data) {
    const grid = document.createElement('div');
    grid.className = 'star-array-grid';
    grid.style.gridTemplateColumns = `repeat(${data.cols}, 1fr)`;

    for (let r = 1; r <= data.rows; r++) {
      for (let c = 1; c <= data.cols; c++) {
        const star = document.createElement('span');
        star.className = 'array-star';
        star.textContent = '★';
        star.title = `Row ${r}, Column ${c}`;

        if (data.highlightRow && r > data.highlightRow) {
          star.classList.add('chunk-highlight');
        }
        grid.appendChild(star);
      }
    }

    const labels = document.createElement('div');
    labels.className = 'array-labels';
    labels.innerHTML = `<span>${data.rows} Rows</span><span>${data.cols} Columns = <strong>${data.total} Stars</strong></span>`;

    container.appendChild(grid);
    container.appendChild(labels);
  }

  renderTenFrames(container, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ten-frames-wrapper';

    // Frame 1 (10 slots)
    const frame1 = document.createElement('div');
    frame1.className = 'ten-frame-box';

    // Frame 2 (10 slots)
    const frame2 = document.createElement('div');
    frame2.className = 'ten-frame-box';

    const num1 = data.num1;
    const num2 = data.num2;
    const total = num1 + num2;

    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('div');
      cell.className = 'ten-frame-cell';
      if (i < num1) {
        const dot = document.createElement('div');
        dot.className = 'ten-frame-dot dot-primary';
        cell.appendChild(dot);
      } else if (i < num1 + num2) {
        const dot = document.createElement('div');
        dot.className = 'ten-frame-dot dot-secondary';
        cell.appendChild(dot);
      }
      frame1.appendChild(cell);
    }

    if (total > 10) {
      const remainingDots = total - 10;
      for (let i = 0; i < 10; i++) {
        const cell = document.createElement('div');
        cell.className = 'ten-frame-cell';
        if (i < remainingDots) {
          const dot = document.createElement('div');
          dot.className = 'ten-frame-dot dot-secondary';
          cell.appendChild(dot);
        }
        frame2.appendChild(cell);
      }
      wrapper.appendChild(frame1);
      wrapper.appendChild(frame2);
    } else {
      wrapper.appendChild(frame1);
    }

    const labels = document.createElement('div');
    labels.className = 'array-labels';
    labels.innerHTML = `<span>Cyan: ${num1}</span><span>Magenta: ${num2}</span><span>Total: <strong>${total}</strong></span>`;

    container.appendChild(wrapper);
    container.appendChild(labels);
  }

  renderSubtractionModel(container, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ten-frames-wrapper';

    const frame = document.createElement('div');
    frame.className = 'ten-frame-box';
    frame.style.gridTemplateColumns = `repeat(${Math.min(10, Math.ceil(data.total / 2))}, 32px)`;

    for (let i = 0; i < data.total; i++) {
      const cell = document.createElement('div');
      cell.className = 'ten-frame-cell';
      const dot = document.createElement('div');
      dot.className = 'ten-frame-dot dot-primary';

      // Crossed out dots
      if (i >= data.remain) {
        dot.classList.add('dot-crossed');
      }
      cell.appendChild(dot);
      frame.appendChild(cell);
    }

    const labels = document.createElement('div');
    labels.className = 'array-labels';
    labels.innerHTML = `<span>Start: ${data.total}</span><span>Take away: ${data.takeAway}</span><span>Left: <strong>${data.remain}</strong></span>`;

    container.appendChild(frame);
    container.appendChild(labels);
  }

  // =========================================================================
  // Night Sky Constellation Modal & Canvas
  // =========================================================================

  openConstellationModal() {
    this.constellationModal.classList.remove('hidden');
    this.drawConstellationSky();
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  closeConstellationModal() {
    this.constellationModal.classList.add('hidden');
  }

  drawConstellationSky() {
    const canvas = this.constellationCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Ambient stars in background
    for (let i = 0; i < 45; i++) {
      const x = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const y = (Math.cos(i * 33) * 0.5 + 0.5) * h;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (i % 5) * 0.1})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // 12 Constellation Nodes (Lyra the Harp Constellation shape!)
    const starCoords = [
      { x: w * 0.50, y: h * 0.18, name: 'Vega' },
      { x: w * 0.38, y: h * 0.32 },
      { x: w * 0.44, y: h * 0.50 },
      { x: w * 0.60, y: h * 0.48 },
      { x: w * 0.66, y: h * 0.30 },
      { x: w * 0.35, y: h * 0.70 },
      { x: w * 0.52, y: h * 0.82 },
      { x: w * 0.68, y: h * 0.72 },
      { x: w * 0.22, y: h * 0.45 },
      { x: w * 0.78, y: h * 0.45 },
      { x: w * 0.28, y: h * 0.85 },
      { x: w * 0.75, y: h * 0.85 }
    ];

    const totalLit = Math.min(this.constellationDays, starCoords.length);

    // Draw connection lines between lit stars
    if (totalLit > 1) {
      ctx.beginPath();
      ctx.moveTo(starCoords[0].x, starCoords[0].y);
      for (let i = 1; i < totalLit; i++) {
        ctx.lineTo(starCoords[i].x, starCoords[i].y);
      }
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f5d4';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw star nodes
    starCoords.forEach((pt, idx) => {
      const isLit = idx < totalLit;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isLit ? 7 : 4, 0, Math.PI * 2);

      if (isLit) {
        ctx.fillStyle = '#ffd166';
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Little glow ring
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 209, 102, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
      }
    });

    // Update text
    this.constellationDaysCount.textContent = `${this.constellationDays} Days Practiced 🌟`;
    
    // Rank title progression
    const ranks = [
      { days: 0, title: "🌟 Starlight Apprentice" },
      { days: 3, title: "🚀 Cosmic Voyager" },
      { days: 7, title: "✨ Galaxy Commander" },
      { days: 14, title: "🪐 Constellation Master" },
      { days: 30, title: "👑 Legend of the Lyra Star" }
    ];
    let userRank = ranks[0].title;
    for (const r of ranks) {
      if (this.constellationDays >= r.days) userRank = r.title;
    }
    this.currentRankBadge.textContent = userRank;
  }

  // =========================================================================
  // Settings Modal & Parent Controls
  // =========================================================================

  openSettingsModal() {
    const s = window.mathEngine.settings;
    this.dailyMinutesSelect.value = String(s.dailyMinutes || 5);
    this.settingOpAdd.checked = !!s.operations.add;
    this.settingOpSub.checked = !!s.operations.sub;
    this.settingOpMul.checked = !!s.operations.mul;
    this.addMaxSumSelect.value = String(s.addMaxSum || 20);

    // Build 0-12 table toggle buttons
    this.settingsTableGrid.innerHTML = '';
    for (let i = 0; i <= 12; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'table-toggle-btn';
      btn.textContent = `${i}×`;
      if (s.mulTables.includes(i)) btn.classList.add('active');

      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        if (window.soundEngine) window.soundEngine.playKeyClick();
      });
      this.settingsTableGrid.appendChild(btn);
    }

    this.settingsModal.classList.remove('hidden');
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  closeSettingsModal() {
    this.settingsModal.classList.add('hidden');
  }

  saveSettingsFromModal() {
    const activeTables = [];
    this.settingsTableGrid.querySelectorAll('.table-toggle-btn').forEach((btn, idx) => {
      if (btn.classList.contains('active')) {
        activeTables.push(idx);
      }
    });

    const newSettings = {
      dailyMinutes: parseInt(this.dailyMinutesSelect.value, 10),
      operations: {
        add: this.settingOpAdd.checked,
        sub: this.settingOpSub.checked,
        mul: this.settingOpMul.checked
      },
      addMaxSum: parseInt(this.addMaxSumSelect.value, 10),
      mulTables: activeTables.length > 0 ? activeTables : [0, 1, 2, 3, 4, 5, 10]
    };

    window.mathEngine.saveSettings(newSettings);
    this.totalQuestSeconds = newSettings.dailyMinutes * 60;
    this.closeSettingsModal();
    this.nextProblem();
  }

  resetTodayTimer() {
    if (confirm("Reset today's 5-minute timer so Lyra can practice again?")) {
      const settings = window.mathEngine.settings;
      this.totalQuestSeconds = (settings.dailyMinutes || 5) * 60;
      this.remainingSeconds = this.totalQuestSeconds;
      this.questCompletedToday = false;
      localStorage.setItem('lyra_quest_done_today', 'false');
      localStorage.removeItem('lyra_timer_remaining');
      this.updateTimerDisplay();
      this.timerTitleEl.textContent = `Daily Goal: ${settings.dailyMinutes || 5} Minutes`;
      this.timerSubEl.textContent = "You got this, star explorer!";
      this.closeSettingsModal();
    }
  }

  resetAllData() {
    if (confirm("Reset all streak, constellation, and progress data?")) {
      localStorage.clear();
      window.location.reload();
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new StarQuestApp();
});
