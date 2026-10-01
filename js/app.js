/**
 * Lyra's Star Quest - Main Application Controller
 * Handles gameplay loop, sticky difficulty, single-operation selection,
 * mistake celebration (growth mindset), creature companions, and audio.
 */

class StarQuestApp {
  constructor() {
    this.currentProblem = null;
    this.inputBuffer = '';
    this.isChecking = false;
    this.sessionSolvedCount = 0;
    this.sessionAttemptCount = 0;
    this.comboCount = 0;

    // Timer state
    this.timerInterval = null;
    this.isPaused = false;
    this.totalQuestSeconds = 300;
    this.remainingSeconds = 300;
    this.questCompletedToday = false;

    // Buddies
    this.buddies = [
      { id: 'unicorn', name: 'Celeste', emoji: '🦄', speech: 'Hi Lyra! Magical math time! 🦄✨' },
      { id: 'cat', name: 'Barnaby', emoji: '🐱', speech: 'Meow Lyra! Paws ready for math! 🐾' },
      { id: 'caticorn', name: 'Sparkle', emoji: '🌈', speech: 'Caticorn power activated! 🌈🐱' },
      { id: 'star', name: 'Nova', emoji: '⭐', speech: 'Ready to shine bright, Lyra! ⭐' }
    ];
    this.currentBuddyIndex = 0;

    // Themes
    this.themes = ['unicorn', 'cat', 'nebula', 'candy'];
    this.currentThemeIndex = 0;

    this.initElements();
    this.loadState();
    this.setupEventListeners();
    this.startQuestTimer();
    this.nextProblem();
  }

  get currentBuddy() {
    return this.buddies[this.currentBuddyIndex].id;
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

    // Buddy Switcher
    this.buddySwitchBtn = document.getElementById('buddySwitchBtn');
    this.currentBuddyEmoji = document.getElementById('currentBuddyEmoji');
    this.currentBuddyName = document.getElementById('currentBuddyName');
    this.mascotHorn = document.getElementById('mascotHorn');
    this.mascotCatEars = document.getElementById('mascotCatEars');
    this.mascotWhiskers = document.getElementById('mascotWhiskers');

    // Quick Operation & Difficulty Bars
    this.quickOpGroup = document.getElementById('quickOpGroup');
    this.quickDifficultyGroup = document.getElementById('quickDifficultyGroup');

    // Challenge Card elements
    this.challengeCard = document.getElementById('challengeCard');
    this.opBadge = document.getElementById('opBadge');
    this.opBadgeIcon = document.getElementById('opBadgeIcon');
    this.opBadgeText = document.getElementById('opBadgeText');
    this.leitnerBoxBadge = document.getElementById('leitnerBoxBadge');
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

    // Fact Mastery Garden Modal (Leitner tracking)
    this.masteryGardenBtn = document.getElementById('masteryGardenBtn');
    this.gardenCountEl = document.getElementById('gardenCount');
    this.gardenModal = document.getElementById('gardenModal');
    this.closeGardenBtn = document.getElementById('closeGardenBtn');
    this.closeGardenOkBtn = document.getElementById('closeGardenOkBtn');
    this.gardenLearningCount = document.getElementById('gardenLearningCount');
    this.gardenGrowingCount = document.getElementById('gardenGrowingCount');
    this.gardenMasteredCount = document.getElementById('gardenMasteredCount');
    this.gardenMasteredList = document.getElementById('gardenMasteredList');

    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    this.modalDifficultySelect = document.getElementById('modalDifficultySelect');
    this.modalBuddySelect = document.getElementById('modalBuddySelect');
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
    // 1. Theme
    const savedTheme = localStorage.getItem('lyra_theme') || 'unicorn';
    document.body.setAttribute('data-theme', savedTheme);
    this.currentThemeIndex = this.themes.indexOf(savedTheme);
    if (this.currentThemeIndex === -1) this.currentThemeIndex = 0;

    // 2. Sound state icon
    if (window.soundEngine && window.soundEngine.isMuted) {
      this.soundToggleBtn.textContent = '🔇';
    }

    // 3. Buddy Companion (Unicorn / Cat / Caticorn / Star)
    const savedBuddy = localStorage.getItem('lyra_active_buddy') || 'unicorn';
    const foundIdx = this.buddies.findIndex(b => b.id === savedBuddy);
    this.currentBuddyIndex = foundIdx !== -1 ? foundIdx : 0;
    this.applyBuddyVisuals();

    // 4. Sticky Operation Pill selection
    const currentOp = window.mathEngine.settings.selectedOp || 'mixed';
    this.quickOpGroup.querySelectorAll('.op-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.op === currentOp);
    });

    // 5. Sticky Difficulty Preset
    const currentDiff = window.mathEngine.settings.difficulty || 'medium';
    this.quickDifficultyGroup.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === currentDiff);
    });

    // 6. Streak & constellation tracking
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastPlayedDate = localStorage.getItem('lyra_last_played_date');
    let streak = parseInt(localStorage.getItem('lyra_streak_count') || '1', 10);
    let constellationDays = parseInt(localStorage.getItem('lyra_constellation_days') || '1', 10);

    if (lastPlayedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastPlayedDate !== yesterdayStr && lastPlayedDate !== todayStr) {
        streak = 1;
      }
    }

    this.streak = streak;
    this.constellationDays = constellationDays;
    this.streakCountEl.textContent = this.streak;

    // 7. Timer recovery
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
        this.timerSubEl.textContent = "Keep playing for extra stars!";
      }
    } else {
      this.remainingSeconds = this.totalQuestSeconds;
      this.questCompletedToday = false;
      localStorage.setItem('lyra_quest_done_today', 'false');
    }

    this.updateTimerDisplay();

    // 8. Stars earned today
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

    // Theme Toggle (Cycles Unicorn -> Cat -> Nebula -> Candy)
    this.themeToggleBtn.addEventListener('click', () => {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
      const nextTheme = this.themes[this.currentThemeIndex];
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('lyra_theme', nextTheme);
      if (window.soundEngine) window.soundEngine.playKeyClick();
      if (window.easterEggs) {
        window.easterEggs.showMascotMessage(`🎨 Theme: ${nextTheme.toUpperCase()}!`, 2000);
      }
    });

    // Buddy Switcher (Click to cycle Unicorn, Cat, Caticorn, Star)
    this.buddySwitchBtn.addEventListener('click', () => {
      this.currentBuddyIndex = (this.currentBuddyIndex + 1) % this.buddies.length;
      this.applyBuddyVisuals();
      const buddy = this.buddies[this.currentBuddyIndex];
      localStorage.setItem('lyra_active_buddy', buddy.id);

      if (buddy.id === 'cat' && window.soundEngine) {
        window.soundEngine.playCatMeow();
      } else if (buddy.id === 'unicorn' && window.soundEngine) {
        window.soundEngine.playUnicornSparkle();
      } else if (window.soundEngine) {
        window.soundEngine.playKeyClick();
      }

      if (window.easterEggs) {
        window.easterEggs.showMascotMessage(buddy.speech, 3000);
      }
    });

    // Quick Operation Selector (Sticky single-operation pill buttons)
    this.quickOpGroup.addEventListener('click', (e) => {
      const pill = e.target.closest('.op-pill');
      if (!pill) return;
      const op = pill.dataset.op;

      this.quickOpGroup.querySelectorAll('.op-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      window.mathEngine.setOperation(op);
      if (window.soundEngine) window.soundEngine.playKeyClick();

      const messages = {
        'mixed': '🎲 Mixed Math Mode! Adding, subtracting & multiplying!',
        'add': '➕ Just Adding Mode activated!',
        'sub': '➖ Just Subtracting Mode activated!',
        'mul': '✖️ Just Multiplying Mode activated!'
      };
      if (window.easterEggs) window.easterEggs.showMascotMessage(messages[op] || '', 2500);

      this.nextProblem();
    });

    // Quick Difficulty Presets (Sticky: Gentle, Just Right, Challenge)
    this.quickDifficultyGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.diff-btn');
      if (!btn) return;
      const diff = btn.dataset.diff;

      this.quickDifficultyGroup.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      window.mathEngine.setDifficulty(diff);
      if (window.soundEngine) window.soundEngine.playKeyClick();

      const diffMsg = {
        'gentle': '🐣 Gentle Mode: Facts within 10 & cozy tables!',
        'medium': '🌟 Just Right: Grade 3 standard facts!',
        'challenge': '🚀 Challenge Wizard: Bigger sums and power tables!'
      };
      if (window.easterEggs) window.easterEggs.showMascotMessage(diffMsg[diff] || '', 2500);

      this.nextProblem();
    });

    // Constellation Modal
    this.constellationBtn.addEventListener('click', () => this.openConstellationModal());
    this.closeConstellationBtn.addEventListener('click', () => this.closeConstellationModal());

    // Fact Mastery Garden Modal
    if (this.masteryGardenBtn) {
      this.masteryGardenBtn.addEventListener('click', () => this.openGardenModal());
    }
    if (this.closeGardenBtn) {
      this.closeGardenBtn.addEventListener('click', () => this.closeGardenModal());
    }
    if (this.closeGardenOkBtn) {
      this.closeGardenOkBtn.addEventListener('click', () => this.closeGardenModal());
    }

    // Settings Modal
    this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettingsFromModal());
    this.resetTodayBtn.addEventListener('click', () => this.resetTodayTimer());
    this.resetAllDataBtn.addEventListener('click', () => this.resetAllData());

    // Pause / Play Timer
    this.pausePlayBtn.addEventListener('click', () => this.togglePauseTimer());

    // Keypad Touch / Click Listeners
    if (this.keypad) {
      this.keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.key-btn');
        if (!btn) return;
        const key = btn.dataset.key;
        this.handleKeyInput(key);

        btn.classList.add('key-pressed');
        setTimeout(() => btn.classList.remove('key-pressed'), 120);
      });
    }

    // Physical Keyboard Listener
    window.addEventListener('keydown', (e) => {
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
    });
  }

  applyBuddyVisuals() {
    const buddy = this.buddies[this.currentBuddyIndex];
    this.currentBuddyEmoji.textContent = buddy.emoji;
    this.currentBuddyName.textContent = buddy.name;

    const horn = this.mascotHorn;
    const catEars = this.mascotCatEars;
    const whiskers = this.mascotWhiskers;

    if (buddy.id === 'unicorn') {
      if (horn) horn.classList.remove('hidden');
      if (catEars) catEars.classList.add('hidden');
      if (whiskers) whiskers.classList.add('hidden');
    } else if (buddy.id === 'cat') {
      if (horn) horn.classList.add('hidden');
      if (catEars) catEars.classList.remove('hidden');
      if (whiskers) whiskers.classList.remove('hidden');
    } else if (buddy.id === 'caticorn') {
      if (horn) horn.classList.remove('hidden');
      if (catEars) catEars.classList.remove('hidden');
      if (whiskers) whiskers.classList.remove('hidden');
    } else {
      if (horn) horn.classList.add('hidden');
      if (catEars) catEars.classList.add('hidden');
      if (whiskers) whiskers.classList.add('hidden');
    }
  }

  closeAllModals() {
    this.helpModal.classList.add('hidden');
    this.celebrationModal.classList.add('hidden');
    this.constellationModal.classList.add('hidden');
    this.settingsModal.classList.add('hidden');
    if (this.gardenModal) this.gardenModal.classList.add('hidden');
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

    this.currentProblem = window.mathEngine.generateProblem('daily');
    this.renderProblem();
    this.updateMasteryCount();
  }

  renderProblem() {
    const p = this.currentProblem;
    this.firstNumEl.textContent = p.num1;
    this.secondNumEl.textContent = p.num2;
    this.mathOpEl.textContent = p.opSymbol;
    this.opBadgeIcon.textContent = p.badgeIcon;
    this.opBadgeText.textContent = p.opName;

    // Show Leitner box status on the problem badge
    if (this.leitnerBoxBadge) {
      const boxLabels = { 1: '🌱 Learning', 2: '🌿 Growing', 3: '🌟 Mastered' };
      this.leitnerBoxBadge.textContent = boxLabels[p.box] || '🌱 Learning';
    }
  }

  handleKeyInput(key) {
    if (this.isChecking) return;

    if (key >= '0' && key <= '9') {
      if (this.inputBuffer.length < 4) {
        this.inputBuffer += key;
        this.answerTextEl.textContent = this.inputBuffer;
        if (window.soundEngine) window.soundEngine.playKeyClick();
        // No auto-check — Lyra must always press GO/Enter
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

    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lyra_stars_today', this.starsToday);
    localStorage.setItem('lyra_stars_date', todayStr);

    // Record correct answer in Leitner system
    window.mathEngine.recordAnswer(this.currentProblem, true);

    if (window.soundEngine) {
      window.soundEngine.playCorrect(this.comboCount);
    }

    this.challengeCard.classList.add('correct-flash');
    const cheers = [
      "✨ Stellar job, Lyra!",
      "🦄 Unicorn magic!",
      "🐱 Pawsome job!",
      "🚀 Math superstar!",
      "🎉 Brilliant!"
    ];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    this.feedbackBanner.textContent = cheer;
    this.feedbackBanner.className = 'feedback-banner success';

    if (this.comboCount % 5 === 0 && window.easterEggs) {
      window.easterEggs.burstConfetti(45);
    }

    setTimeout(() => {
      this.challengeCard.classList.remove('correct-flash');
      this.nextProblem();
    }, 550);
  }

  // CELEBRATE MISTAKES! Joyful, growth mindset, and silly encouragement
  handleIncorrectAnswer() {
    this.comboCount = 0;
    
    // Play upbeat cartoon boing instead of any error buzz
    if (window.soundEngine) {
      window.soundEngine.playEncourageBoing();
    }

    // Record incorrect answer in Leitner system (drops gently back to Box 1)
    window.mathEngine.recordAnswer(this.currentProblem, false);

    // Playful gentle bounce
    this.challengeCard.classList.add('gentle-bounce');

    // Cheerful mistake celebration message
    const cheer = window.easterEggs
      ? window.easterEggs.getMistakeEncouragement()
      : "🌱 Brain stretch! You're super close! Try again 💡";

    this.feedbackBanner.textContent = cheer;
    this.feedbackBanner.className = 'feedback-banner mistake-cheer';

    // Spawn 10 little heart/star particles for effort
    if (window.easterEggs) {
      window.easterEggs.burstConfetti(12, ['#ffd166', '#ff70a6', '#00f5d4']);
    }

    setTimeout(() => {
      this.challengeCard.classList.remove('gentle-bounce');
      this.inputBuffer = '';
      this.answerTextEl.textContent = '';
      this.isChecking = false;
    }, 650);
  }

  // =========================================================================
  // 5-Minute Daily Quest Timer
  // =========================================================================

  startQuestTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.questCompletedToday) return;

      this.remainingSeconds--;
      this.updateTimerDisplay();

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

    const circumference = 2 * Math.PI * 23;
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

    if (window.soundEngine) window.soundEngine.playCelebration();
    if (window.easterEggs) {
      window.easterEggs.burstConfetti(140);
      window.easterEggs.spawnGallopingUnicorn();
    }

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

    const tipBox = document.createElement('div');
    tipBox.className = 'help-tip-box';
    tipBox.innerHTML = `<strong>Concept:</strong> ${data.tip}`;
    this.helpContentBody.appendChild(tipBox);

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

    const buddy = this.buddies[this.currentBuddyIndex].id;
    const symbol = (buddy === 'unicorn') ? '🦄' : ((buddy === 'cat') ? '🐱' : '★');

    for (let r = 1; r <= data.rows; r++) {
      for (let c = 1; c <= data.cols; c++) {
        const star = document.createElement('span');
        star.className = 'array-star';
        star.textContent = symbol;
        star.title = `Row ${r}, Column ${c}`;

        if (data.highlightRow && r > data.highlightRow) {
          star.classList.add('chunk-highlight');
        }
        grid.appendChild(star);
      }
    }

    const labels = document.createElement('div');
    labels.className = 'array-labels';
    labels.innerHTML = `<span>${data.rows} Rows</span><span>${data.cols} Columns = <strong>${data.total} Total</strong></span>`;

    container.appendChild(grid);
    container.appendChild(labels);
  }

  renderTenFrames(container, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ten-frames-wrapper';

    const frame1 = document.createElement('div');
    frame1.className = 'ten-frame-box';

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
    labels.innerHTML = `<span>First: ${num1}</span><span>Second: ${num2}</span><span>Total: <strong>${total}</strong></span>`;

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

    // Monoceros Unicorn Constellation Shape!
    const starCoords = [
      { x: w * 0.22, y: h * 0.22 }, // Horn tip
      { x: w * 0.35, y: h * 0.32 }, // Head
      { x: w * 0.48, y: h * 0.40 }, // Neck
      { x: w * 0.62, y: h * 0.42 }, // Back
      { x: w * 0.78, y: h * 0.38 }, // Tail
      { x: w * 0.42, y: h * 0.65 }, // Front leg
      { x: w * 0.72, y: h * 0.72 }, // Back leg
      { x: w * 0.30, y: h * 0.55 },
      { x: w * 0.58, y: h * 0.60 },
      { x: w * 0.85, y: h * 0.55 },
      { x: w * 0.20, y: h * 0.78 },
      { x: w * 0.80, y: h * 0.82 }
    ];

    const totalLit = Math.min(this.constellationDays, starCoords.length);

    if (totalLit > 1) {
      ctx.beginPath();
      ctx.moveTo(starCoords[0].x, starCoords[0].y);
      for (let i = 1; i < totalLit; i++) {
        ctx.lineTo(starCoords[i].x, starCoords[i].y);
      }
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    starCoords.forEach((pt, idx) => {
      const isLit = idx < totalLit;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isLit ? 7 : 4, 0, Math.PI * 2);

      if (isLit) {
        ctx.fillStyle = (idx === 0) ? '#00f5d4' : '#ffd166';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

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

    this.constellationDaysCount.textContent = `${this.constellationDays} Days Practiced 🌟`;
    
    const ranks = [
      { days: 0, title: "🦄 Celestial Apprentice" },
      { days: 3, title: "🐱 Cosmic Kitten Voyager" },
      { days: 7, title: "✨ Galaxy Commander" },
      { days: 14, title: "🪐 Monoceros Unicorn Master" },
      { days: 30, title: "👑 Legend of the Cosmic Caticorn" }
    ];
    let userRank = ranks[0].title;
    for (const r of ranks) {
      if (this.constellationDays >= r.days) userRank = r.title;
    }
    this.currentRankBadge.textContent = userRank;
  }

  // =========================================================================
  // Fact Mastery Garden Modal (Leitner System Visualization)
  // =========================================================================

  updateMasteryCount() {
    const stats = window.mathEngine.leitner.getMasteryStats();
    if (this.gardenCountEl) {
      this.gardenCountEl.textContent = stats.mastered;
    }
  }

  openGardenModal() {
    if (!this.gardenModal) return;
    const stats = window.mathEngine.leitner.getMasteryStats();

    if (this.gardenLearningCount) this.gardenLearningCount.textContent = stats.learning;
    if (this.gardenGrowingCount) this.gardenGrowingCount.textContent = stats.growing;
    if (this.gardenMasteredCount) this.gardenMasteredCount.textContent = stats.mastered;

    // Populate mastered facts list
    if (this.gardenMasteredList) {
      this.gardenMasteredList.innerHTML = '';
      const mastery = window.mathEngine.leitner.masteryMap;
      const masteredFacts = Object.entries(mastery)
        .filter(([, rec]) => rec.box === 3)
        .map(([key]) => {
          const parts = key.split('_');
          const opType = parts[0];
          const a = parts[1];
          const b = parts[2];
          const symbols = { mul: '×', add: '+', sub: '−' };
          const sym = symbols[opType] || '?';
          return `${a} ${sym} ${b}`;
        });

      if (masteredFacts.length === 0) {
        this.gardenMasteredList.innerHTML = '<p class="garden-empty">Keep practicing! Your mastered facts will bloom here! 🌱</p>';
      } else {
        masteredFacts.forEach(fact => {
          const tag = document.createElement('span');
          tag.className = 'garden-fact-tag';
          tag.textContent = `🌟 ${fact}`;
          this.gardenMasteredList.appendChild(tag);
        });
      }
    }

    this.gardenModal.classList.remove('hidden');
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  closeGardenModal() {
    if (this.gardenModal) this.gardenModal.classList.add('hidden');
  }

  // =========================================================================
  // Settings Modal & Parent Controls
  // =========================================================================

  openSettingsModal() {
    const s = window.mathEngine.settings;
    this.dailyMinutesSelect.value = String(s.dailyMinutes || 5);
    this.settingOpAdd.checked = !!s.customOps.add;
    this.settingOpSub.checked = !!s.customOps.sub;
    this.settingOpMul.checked = !!s.customOps.mul;
    this.addMaxSumSelect.value = String(s.addMaxSum || 20);
    this.modalDifficultySelect.value = s.difficulty || 'medium';
    this.modalBuddySelect.value = this.currentBuddy;

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

    const chosenDiff = this.modalDifficultySelect.value;
    const chosenBuddy = this.modalBuddySelect.value;

    const newSettings = {
      dailyMinutes: parseInt(this.dailyMinutesSelect.value, 10),
      difficulty: chosenDiff,
      customOps: {
        add: this.settingOpAdd.checked,
        sub: this.settingOpSub.checked,
        mul: this.settingOpMul.checked
      },
      addMaxSum: parseInt(this.addMaxSumSelect.value, 10),
      mulTables: activeTables.length > 0 ? activeTables : [0, 1, 2, 3, 4, 5, 10]
    };

    window.mathEngine.saveSettings(newSettings);
    this.totalQuestSeconds = newSettings.dailyMinutes * 60;

    // Apply buddy
    const bIdx = this.buddies.findIndex(b => b.id === chosenBuddy);
    if (bIdx !== -1) {
      this.currentBuddyIndex = bIdx;
      this.applyBuddyVisuals();
      localStorage.setItem('lyra_active_buddy', chosenBuddy);
    }

    // Sync quick difficulty pills
    this.quickDifficultyGroup.querySelectorAll('.diff-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.diff === chosenDiff);
    });

    this.closeSettingsModal();
    this.nextProblem();
  }

  resetTodayTimer() {
    if (confirm("Reset today's timer so Lyra can practice again?")) {
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

document.addEventListener('DOMContentLoaded', () => {
  window.app = new StarQuestApp();
});
