/**
 * FLUENT - Data Storage Engine (LocalStorage Persistence)
 * Contains zero fake initial streak data. Streaks are strictly derived from actual session history.
 */
const FluentStorage = {
  KEYS: {
    USER_PROFILE: 'fluent_user_profile',
    TOPIC_HISTORY: 'fluent_topic_history',
    SESSIONS: 'fluent_sessions',
    VOCAB_SAVED: 'fluent_vocab_saved'
  },

  // Initialize storage defaults if empty (Clean state - No fake streak data!)
  init() {
    if (!localStorage.getItem(this.KEYS.USER_PROFILE)) {
      const defaultUser = {
        name: 'Speaker',
        college: '',
        careerGoal: '',
        preferredDifficulty: 'INTERMEDIATE',
        selectedCategories: ['All'],
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(defaultUser));
    }

    if (!localStorage.getItem(this.KEYS.TOPIC_HISTORY)) {
      localStorage.setItem(this.KEYS.TOPIC_HISTORY, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.SESSIONS)) {
      // Start with empty sessions for clean user state
      localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify([]));
    }
  },

  // User Profile
  getUserProfile() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.USER_PROFILE));
  },

  saveUserProfile(profileData) {
    const current = this.getUserProfile();
    const updated = { ...current, ...profileData };
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  },

  // Topic History Engine
  getTopicHistory() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.TOPIC_HISTORY)) || [];
  },

  addTopicToHistory(topicObj) {
    const history = this.getTopicHistory();
    if (!history.some(t => t.id === topicObj.id || t.text.toLowerCase() === topicObj.text.toLowerCase())) {
      history.unshift({
        id: topicObj.id,
        text: topicObj.text,
        category: topicObj.category,
        difficulty: topicObj.difficulty,
        date: new Date().toISOString(),
        practiced: false,
        attempts: 0
      });
      localStorage.setItem(this.KEYS.TOPIC_HISTORY, JSON.stringify(history));
    }
  },

  markTopicPracticed(topicId) {
    const history = this.getTopicHistory();
    const item = history.find(t => t.id === topicId);
    if (item) {
      item.practiced = true;
      item.attempts = (item.attempts || 0) + 1;
      localStorage.setItem(this.KEYS.TOPIC_HISTORY, JSON.stringify(history));
    }
  },

  // Sessions Engine
  getSessions() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.SESSIONS)) || [];
  },

  saveSession(sessionData) {
    const sessions = this.getSessions();
    sessions.unshift(sessionData);
    localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
    
    // Mark topic as practiced
    if (sessionData.topicId) {
      this.markTopicPracticed(sessionData.topicId);
    }
  },

  // --- DYNAMIC STREAK CALCULATION ENGINE ---
  // Calculates streak strictly from actual session local calendar dates.
  getStreakData() {
    const sessions = this.getSessions();

    if (!sessions || sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalPracticeDays: 0,
        lastPracticeDate: null,
        practicedToday: false,
        weeklyActivity: this.getWeeklyActivity([])
      };
    }

    // Convert sessions to unique YYYY-MM-DD local calendar dates
    const dateSet = new Set();
    sessions.forEach(s => {
      if (s.date) {
        dateSet.add(this.getLocalDateString(s.date));
      }
    });

    const uniqueDates = Array.from(dateSet).sort(); // Ascending sorted dates
    const totalPracticeDays = uniqueDates.length;

    const todayStr = this.getLocalDateString(new Date());
    const yesterdayStr = this.getLocalDateString(new Date(Date.now() - 86400000));

    const practicedToday = dateSet.has(todayStr);

    // Calculate current streak
    let currentStreak = 0;
    if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
      // Start checking backwards from the most recent active day
      let checkDate = dateSet.has(todayStr) ? new Date() : new Date(Date.now() - 86400000);
      
      while (true) {
        const checkStr = this.getLocalDateString(checkDate);
        if (dateSet.has(checkStr)) {
          currentStreak++;
          // Move 1 day back
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0; // Streak broken if neither today nor yesterday has a practice session
    }

    // Calculate longest (best) streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDateObj = null;

    uniqueDates.forEach(dStr => {
      const parts = dStr.split('-');
      const dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      if (!prevDateObj) {
        tempStreak = 1;
      } else {
        const diffMs = dObj.getTime() - prevDateObj.getTime();
        const diffDays = Math.round(diffMs / 86400000);
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevDateObj = dObj;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    });

    const lastPracticeDate = uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : null;

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, longestStreak),
      totalPracticeDays,
      lastPracticeDate,
      practicedToday,
      weeklyActivity: this.getWeeklyActivity(uniqueDates)
    };
  },

  // Formats date into local YYYY-MM-DD string without UTC conversion offset
  getLocalDateString(dateInput) {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Generates current week activity array (Mon..Sun)
  getWeeklyActivity(uniqueDatesArray) {
    const set = new Set(uniqueDatesArray);
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    // Distance from Monday
    const distToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now.getTime() - distToMon * 86400000);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((dayName, idx) => {
      const dayObj = new Date(monday.getTime() + idx * 86400000);
      const dateStr = this.getLocalDateString(dayObj);
      const isToday = dateStr === this.getLocalDateString(now);
      const active = set.has(dateStr);
      return { dayName, dateStr, active, isToday };
    });
  }
};
window.FluentStorage = FluentStorage;
