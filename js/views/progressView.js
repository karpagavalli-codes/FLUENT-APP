/**
 * FLUENT - Progress View & Analytics Dashboard Component
 */
const FluentProgressView = {
  render(container) {
    const sessions = FluentStorage.getSessions();
    const totalSessions = sessions.length;
    const totalDurationMins = Math.round(sessions.reduce((acc, s) => acc + (s.durationSeconds || 60), 0) / 60);
    const avgFillerWords = totalSessions > 0 
      ? (sessions.reduce((acc, s) => acc + (s.analysis ? s.analysis.fillerWordsCount : 3), 0) / totalSessions).toFixed(1)
      : 3;
    const avgScore = totalSessions > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.analysis ? s.analysis.score : 85), 0) / totalSessions)
      : 88;

    container.innerHTML = `
      <div class="view-header">
        <h1>Your Speaking Progress</h1>
        <p>Track your speech habit improvements, structural mastery, and vocabulary adoption over time.</p>
      </div>

      <!-- METRICS OVERVIEW CARDS -->
      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-value">${totalSessions}</div>
          <div class="metric-label">Speaking Sessions</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${totalDurationMins} min</div>
          <div class="metric-label">Total Practice Time</div>
        </div>
        <div class="metric-card">
          <div class="metric-value" style="color: ${avgFillerWords > 4 ? '#dc2626' : 'var(--primary-teal)'};">
            ${avgFillerWords}
          </div>
          <div class="metric-label">Avg Filler Words / Session</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${avgScore}%</div>
          <div class="metric-label">Average Speech Score</div>
        </div>
      </div>

      <!-- SVG FILLER WORDS TREND CHART -->
      <div class="progress-chart-box">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 2px;">Filler Words Reduction Trend</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Lower count represents improved fluency and silent pause mastery.</p>
          </div>
          <span class="badge badge-teal">Improving Trend</span>
        </div>

        <div style="width: 100%; height: 180px; display: flex; align-items: flex-end; justify-content: space-around; padding-top: 20px; border-bottom: 2px solid var(--border-light);">
          <!-- Bar 1 -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #dc2626;">14</span>
            <div style="width: 48px; height: 110px; background: #fca5a5; border-radius: var(--radius-sm) var(--radius-sm) 0 0;"></div>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">Week 1</span>
          </div>

          <!-- Bar 2 -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #d97706;">10</span>
            <div style="width: 48px; height: 75px; background: #fcd34d; border-radius: var(--radius-sm) var(--radius-sm) 0 0;"></div>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">Week 2</span>
          </div>

          <!-- Bar 3 -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-teal);">7</span>
            <div style="width: 48px; height: 50px; background: var(--primary-teal); border-radius: var(--radius-sm) var(--radius-sm) 0 0;"></div>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Week 3 (Current)</span>
          </div>
        </div>
      </div>

      <!-- FOCUS & RECOMMENDATIONS ROW -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div class="card" style="border-left: 4px solid #059669;">
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #059669; margin-bottom: 4px;">
            STRONGEST AREA
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Technical Explanation</h4>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">You consistently articulate core concepts with clear definition and real-world examples.</p>
        </div>

        <div class="card" style="border-left: 4px solid #d97706;">
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #d97706; margin-bottom: 4px;">
            NEEDS ATTENTION
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Answer Structure</h4>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">Transitions between your main point and supporting examples occasionally lack explicit causal connectors.</p>
        </div>

        <div class="card" style="border-left: 4px solid var(--primary-teal);">
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary-teal); margin-bottom: 4px;">
            RECOMMENDED PRACTICE
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">PREP — 3 Sessions</h4>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 12px;">Practice stating your point upfront and restating it cleanly in your conclusion.</p>
          <button class="btn btn-sm btn-outline-teal" id="start-rec-prep-btn">Start Recommended Practice</button>
        </div>
      </div>

      <!-- PRACTICE HISTORY LIST -->
      <div class="section-title-bar">
        <h3>Practice History</h3>
      </div>

      <div class="history-table-container">
        ${sessions.map(session => `
          <div class="history-item">
            <div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${session.topicText}</strong>
              <div style="font-size: 0.775rem; color: var(--text-muted);">${session.category} • ${session.difficulty}</div>
            </div>
            <div><span class="badge badge-teal">${session.framework || 'PREP'}</span></div>
            <div style="font-size: 0.825rem; color: var(--text-secondary);">${Math.round(session.durationSeconds || 60)}s</div>
            <div><span class="badge ${session.analysis && session.analysis.score > 85 ? 'badge-easy' : 'badge-intermediate'}">${session.analysis ? session.analysis.score : 85}% Score</span></div>
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              <button class="btn btn-sm btn-secondary view-hist-btn" data-id="${session.id}">View Analysis</button>
              <button class="btn btn-sm btn-primary retry-hist-btn" data-topic="${encodeURIComponent(session.topicText)}">Practice Again</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Recommended practice trigger
    const prepRecBtn = container.querySelector('#start-rec-prep-btn');
    if (prepRecBtn) {
      prepRecBtn.addEventListener('click', () => {
        FluentApp.navigateTo('practice', { framework: 'prep' });
      });
    }

    // History view analysis modal
    container.querySelectorAll('.view-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const session = FluentStorage.getSessions().find(s => s.id === id);
        if (session) {
          FluentPracticeView.showAnalysisModal(session.analysis, session);
        }
      });
    });

    // History retry button
    container.querySelectorAll('.retry-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topicText = decodeURIComponent(e.currentTarget.dataset.topic);
        FluentApp.navigateTo('practice', { topic: { text: topicText, difficulty: 'INTERMEDIATE', category: 'Technology' } });
      });
    });
  }
};
window.FluentProgressView = FluentProgressView;
