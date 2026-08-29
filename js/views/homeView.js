/**
 * FLUENT - Home View Component
 * Main topic generator, difficulty selector, category pills, Google Scholar search button, streak widget, and recent practice.
 */
const FluentHomeView = {
  currentDifficulty: 'INTERMEDIATE',
  selectedCategory: 'All',
  currentTopic: null,

  render(container) {
    // Read user profile & streak data
    const user = FluentStorage.getUserProfile();
    const streakData = FluentStorage.getStreakData();
    
    // Generate initial topic if none
    if (!this.currentTopic) {
      this.currentTopic = FluentTopics.generateTopic(this.currentDifficulty, [this.selectedCategory]);
    }

    const recentSessions = FluentStorage.getSessions().slice(0, 3);

    container.innerHTML = `
      <div class="home-header">
        <h1 style="margin-bottom: 4px;">Good morning, ${user.name || 'Speaker'}</h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary);">Choose a topic. Learn it. Speak about it. Improve.</p>
      </div>

      <!-- STREAK INFORMATION CARD -->
      <div class="card" style="margin-top: 20px; padding: 20px; border-left: 4px solid var(--primary-teal); background: var(--bg-surface);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            ${streakData.currentStreak === 0 ? `
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">
                Ready to start?
              </div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 2px;">
                Your first completed speaking session today starts your practice streak.
              </div>
            ` : `
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-teal); display: flex; align-items: center; gap: 6px;">
                🔥 ${streakData.currentStreak} Day Streak
              </div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 2px;">
                ${streakData.practicedToday 
                  ? 'Great job! You completed today\'s practice session. Practice tomorrow to reach ' + (streakData.currentStreak + 1) + ' days!' 
                  : 'Keep it going! Complete a session today to maintain your streak.'}
              </div>
            `}
          </div>

          <!-- Weekly Activity Tracker -->
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
              This Week's Activity
            </div>
            <div style="display: flex; gap: 8px;">
              ${streakData.weeklyActivity.map(day => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <span style="font-size: 0.7rem; font-weight: 600; color: ${day.isToday ? 'var(--primary-teal)' : 'var(--text-muted)'};">${day.dayName}</span>
                  <div style="width: 14px; height: 14px; border-radius: 50%; background: ${day.active ? 'var(--primary-teal)' : 'var(--border-light)'}; border: ${day.isToday ? '2px solid var(--primary-teal-dark)' : 'none'};"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Difficulty Selector Pills -->
      <div style="margin-top: 24px;">
        <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 8px;">
          Select Difficulty
        </div>
        <div class="difficulty-selector">
          <button class="difficulty-btn ${this.currentDifficulty === 'EASY' ? 'active' : ''}" data-diff="EASY">
            EASY
          </button>
          <button class="difficulty-btn ${this.currentDifficulty === 'INTERMEDIATE' ? 'active' : ''}" data-diff="INTERMEDIATE">
            INTERMEDIATE
          </button>
          <button class="difficulty-btn ${this.currentDifficulty === 'HARD' ? 'active' : ''}" data-diff="HARD">
            HARD
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div style="margin-top: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            Category Filter
          </div>
          <button id="surprise-me-btn" class="btn btn-sm btn-outline-teal" style="border-radius: var(--radius-full);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
            Surprise Me
          </button>
        </div>
        <div class="category-filters" id="category-pills-container">
          ${FluentTopics.CATEGORIES.map(cat => `
            <button class="category-pill ${this.selectedCategory === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- MAIN TOPIC SHOWCASE CARD -->
      <div class="topic-showcase">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--primary-teal); margin-bottom: 8px;">
          YOUR NEXT TOPIC
        </div>
        <div class="topic-meta">
          <span class="badge ${this.getBadgeClass(this.currentTopic.difficulty)}">${this.currentTopic.difficulty}</span>
          <span class="badge badge-teal">${this.currentTopic.category}</span>
        </div>
        
        <h2 class="topic-title">${this.currentTopic.text}</h2>
        <p class="topic-description">${this.currentTopic.desc || 'Explore this concept, synthesize your insights, and structure your explanation cleanly.'}</p>
        
        <div class="topic-actions">
          <button id="btn-generate-new" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Generate New Topic
          </button>
          
          <a href="https://scholar.google.com/scholar?q=${encodeURIComponent(this.currentTopic.text)}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-outline-teal" 
             id="btn-scholar-research">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
            Research on Google Scholar
          </a>

          <button id="btn-start-speaking" class="btn btn-primary btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
            Start Speaking
          </button>
        </div>
      </div>

      <!-- RECENT PRACTICE LIST -->
      <div class="home-section">
        <div class="section-title-bar">
          <h3>Recent Practice</h3>
          <button class="btn btn-sm btn-secondary" id="view-all-history-btn">View All History</button>
        </div>

        <div class="recent-practice-list">
          ${recentSessions.length === 0 ? `
            <div class="card" style="text-align: center; color: var(--text-muted); padding: 28px;">
              No speaking sessions completed yet. Select a topic above and click <strong>Start Speaking</strong> to begin your streak!
            </div>
          ` : recentSessions.map(session => `
            <div class="recent-practice-item">
              <div>
                <div style="font-weight: 600; color: var(--text-main); font-size: 1rem;">${session.topicText}</div>
                <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 2px;">
                  ${this.formatTimeAgo(session.date)} • ${session.framework || 'PREP'} • ${Math.round(session.durationSeconds || 60)}s duration
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="badge badge-teal">${session.analysis ? session.analysis.score : 85} Score</span>
                <button class="btn btn-sm btn-outline-teal view-session-btn" data-id="${session.id}">
                  View Analysis
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    // Difficulty pill buttons
    container.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentDifficulty = e.currentTarget.dataset.diff;
        this.currentTopic = FluentTopics.generateTopic(this.currentDifficulty, [this.selectedCategory]);
        this.render(container);
      });
    });

    // Category pills
    container.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.cat;
        this.currentTopic = FluentTopics.generateTopic(this.currentDifficulty, [this.selectedCategory]);
        this.render(container);
      });
    });

    // Surprise Me
    const surpriseBtn = container.querySelector('#surprise-me-btn');
    if (surpriseBtn) {
      surpriseBtn.addEventListener('click', () => {
        this.selectedCategory = 'All';
        const diffs = ['EASY', 'INTERMEDIATE', 'HARD'];
        this.currentDifficulty = diffs[Math.floor(Math.random() * diffs.length)];
        this.currentTopic = FluentTopics.generateTopic(this.currentDifficulty, ['All']);
        this.render(container);
      });
    }

    // Generate New Topic
    const genBtn = container.querySelector('#btn-generate-new');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        this.currentTopic = FluentTopics.generateTopic(this.currentDifficulty, [this.selectedCategory]);
        this.render(container);
      });
    }

    // Start Speaking
    const speakBtn = container.querySelector('#btn-start-speaking');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        FluentApp.navigateTo('practice', { topic: this.currentTopic });
      });
    }

    // View All History
    const historyBtn = container.querySelector('#view-all-history-btn');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        FluentApp.navigateTo('progress');
      });
    }

    // View past session modal
    container.querySelectorAll('.view-session-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.currentTarget.dataset.id;
        const session = FluentStorage.getSessions().find(s => s.id === sessionId);
        if (session) {
          FluentPracticeView.showAnalysisModal(session.analysis, session);
        }
      });
    });
  },

  getBadgeClass(difficulty) {
    if (difficulty === 'EASY') return 'badge-easy';
    if (difficulty === 'INTERMEDIATE') return 'badge-intermediate';
    return 'badge-hard';
  },

  formatTimeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }
};
