/**
 * FLUENT - Dedicated Practice History View Component
 */
const FluentHistoryView = {
  render(container) {
    const sessions = FluentStorage.getSessions();

    container.innerHTML = `
      <div class="view-header">
        <h1>Practice History</h1>
        <p>Review past speaking sessions, transcript evaluations, and structural feedback.</p>
      </div>

      <div class="history-table-container">
        ${sessions.length === 0 ? `
          <div style="padding: 32px; text-align: center; color: var(--text-muted);">
            No practice sessions recorded yet. Start practicing from the Home page!
          </div>
        ` : sessions.map(session => `
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

    container.querySelectorAll('.view-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const session = FluentStorage.getSessions().find(s => s.id === id);
        if (session) {
          FluentPracticeView.showAnalysisModal(session.analysis, session);
        }
      });
    });

    container.querySelectorAll('.retry-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topicText = decodeURIComponent(e.currentTarget.dataset.topic);
        FluentApp.navigateTo('practice', { topic: { text: topicText, difficulty: 'INTERMEDIATE', category: 'Technology' } });
      });
    });
  }
};
