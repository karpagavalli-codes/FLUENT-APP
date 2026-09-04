/**
 * FLUENT - User Profile View Component
 * Manages personal information (Name, College, Career Goal), practice stats, and streaks.
 */
const FluentProfileView = {
  render(container) {
    const user = FluentStorage.getUserProfile();
    const streakData = FluentStorage.getStreakData();
    const sessions = FluentStorage.getSessions();

    const totalSessions = sessions.length;
    const totalMins = Math.round(sessions.reduce((acc, s) => acc + (s.durationSeconds || 60), 0) / 60);

    // Get initials for avatar
    const names = (user.name || 'User').trim().split(' ');
    const initials = names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : names[0][0].toUpperCase();

    container.innerHTML = `
      <div class="view-header">
        <h1>User Profile & Learning Goals</h1>
        <p>Manage your student details, college affiliation, target career focus, and view your practice streaks.</p>
      </div>

      <!-- SUCCESS ALERT NOTIFICATION (Hidden by default) -->
      <div id="profile-success-alert" style="display: none; background: #ecfdf5; border: 1px solid #a7f3d0; border-left: 4px solid #059669; padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 24px; color: #065f46; font-size: 0.925rem; font-weight: 500;">
        Profile details updated successfully!
      </div>

      <!-- USER PROFILE HEADER CARD -->
      <div class="card" style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <!-- Avatar Circle -->
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--teal-badge); border: 2px solid var(--teal-border); color: var(--primary-teal-dark); font-weight: 800; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
            ${initials}
          </div>

          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 4px; color: var(--text-main);">${user.name}</h2>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px;">
              ${user.college ? `
                <span class="badge badge-teal" style="display: flex; align-items: center; gap: 4px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  ${user.college}
                </span>
              ` : ''}
              
              ${user.careerGoal ? `
                <span class="badge" style="background: var(--bg-subtle); color: var(--text-secondary);">
                  ${user.careerGoal}
                </span>
              ` : ''}

              <span style="font-size: 0.8rem; color: var(--text-muted);">Member since ${user.joinedDate || '2026'}</span>
            </div>
          </div>
        </div>

        <button class="btn btn-outline-teal btn-sm" id="jump-to-edit-btn">
          Edit Profile Details
        </button>
      </div>

      <!-- STREAK & PROGRESS METRICS GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div class="metric-card" style="border-left: 4px solid var(--primary-teal);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="metric-value" style="color: var(--primary-teal);">${streakData.currentStreak} Days</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
          </div>
          <div class="metric-label">Current Active Streak</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid #059669;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="metric-value" style="color: #059669;">${streakData.longestStreak} Days</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <div class="metric-label">Best Streak Record</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">${totalSessions}</div>
          <div class="metric-label">Completed Sessions</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">${totalMins} mins</div>
          <div class="metric-label">Speaking Practice Time</div>
        </div>
      </div>

      <!-- EDIT PROFILE DETAILS FORM CARD -->
      <div class="card" id="edit-profile-card">
        <h3 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--text-main);">Update Profile Information</h3>

        <form id="profile-form" style="display: flex; flex-direction: column; gap: 18px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                Full Name
              </label>
              <input type="text" id="input-name" value="${user.name || ''}" 
                     style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem; color: var(--text-main);" required>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                College / University / Organization
              </label>
              <input type="text" id="input-college" value="${user.college || ''}" 
                     placeholder="e.g. Stanford University / Tech College"
                     style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem; color: var(--text-main);">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                Career Target / Goal Focus
              </label>
              <input type="text" id="input-goal" value="${user.careerGoal || ''}" 
                     placeholder="e.g. Software Engineer, AI Researcher, Product Manager"
                     style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem; color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                Preferred Practice Difficulty
              </label>
              <select id="select-difficulty" 
                      style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem; color: var(--text-main); background: var(--bg-surface);">
                <option value="EASY" ${user.preferredDifficulty === 'EASY' ? 'selected' : ''}>EASY — Single-word concepts</option>
                <option value="INTERMEDIATE" ${user.preferredDifficulty === 'INTERMEDIATE' ? 'selected' : ''}>INTERMEDIATE — Focused questions</option>
                <option value="HARD" ${user.preferredDifficulty === 'HARD' ? 'selected' : ''}>HARD — Full reasoning questions</option>
              </select>
            </div>
          </div>

          <div style="margin-top: 8px; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const jumpBtn = container.querySelector('#jump-to-edit-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        const editCard = container.querySelector('#edit-profile-card');
        if (editCard) {
          editCard.scrollIntoView({ behavior: 'smooth' });
          const nameInput = container.querySelector('#input-name');
          if (nameInput) nameInput.focus();
        }
      });
    }

    const form = container.querySelector('#profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = container.querySelector('#input-name').value.trim();
        const college = container.querySelector('#input-college').value.trim();
        const careerGoal = container.querySelector('#input-goal').value.trim();
        const preferredDifficulty = container.querySelector('#select-difficulty').value;

        // Save to LocalStorage via FluentStorage
        FluentStorage.saveUserProfile({
          name,
          college,
          careerGoal,
          preferredDifficulty
        });

        // Show Success Alert
        const alert = container.querySelector('#profile-success-alert');
        if (alert) {
          alert.style.display = 'block';
          setTimeout(() => { alert.style.display = 'none'; }, 4000);
        }

        // Update Top Header Greeting
        FluentApp.updateHeaderGreeting();

        // Re-render Profile view to update avatar/headers
        this.render(container);
      });
    }
  }
};
window.FluentProfileView = FluentProfileView;
