/**
 * FLUENT - Core Application Router & State Controller
 */
const FluentApp = {
  currentView: 'home',

  init() {
    // 1. Initialize Local Storage defaults
    FluentStorage.init();

    // 2. Render SVG Logo in sidebar
    FluentLogo.renderInto('sidebar-logo', 28, '#0d9488');

    // 3. Update Greeting & Streak
    this.updateHeaderGreeting();

    // 4. Bind Navigation Click Listeners (Desktop, Mobile & Header User Badge)
    this.bindNavigation();

    // 5. Initial View Render
    this.navigateTo('home');
  },

  updateHeaderGreeting() {
    const user = FluentStorage.getUserProfile();
    const streakData = FluentStorage.getStreakData();
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon';
    } else if (hour >= 17) {
      timeGreeting = 'Good evening';
    }

    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      greetingEl.innerText = `${timeGreeting}, ${user.name || 'Speaker'}`;
    }

    // Avatar initials
    const avatarEl = document.getElementById('header-user-avatar');
    if (avatarEl && user.name) {
      const names = user.name.trim().split(' ');
      const initials = names.length > 1 
        ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
        : names[0][0].toUpperCase();
      avatarEl.innerText = initials;
    }

    // Streak badge - Strictly derived from actual practice sessions
    const streakEl = document.getElementById('streak-count');
    if (streakEl) {
      if (streakData.currentStreak === 0) {
        streakEl.innerText = 'Start Streak 🔥';
      } else {
        streakEl.innerText = `${streakData.currentStreak} Day Streak 🔥`;
      }
    }
  },

  bindNavigation() {
    // Desktop Nav Items
    document.querySelectorAll('.sidebar-nav .nav-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.navigateTo(view);
      });
    });

    // Mobile Bottom Nav Items
    document.querySelectorAll('.mobile-nav .mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.navigateTo(view);
      });
    });

    // Header User Profile Click
    const headerUserBtn = document.getElementById('header-user-btn');
    if (headerUserBtn) {
      headerUserBtn.addEventListener('click', () => {
        this.navigateTo('profile');
      });
    }

    // Header Streak Badge Click
    const streakBadge = document.getElementById('streak-badge');
    if (streakBadge) {
      streakBadge.addEventListener('click', () => {
        this.navigateTo('profile');
      });
    }
  },

  navigateTo(viewName, params = {}) {
    this.currentView = viewName;
    const viewContainer = document.getElementById('app-view-container');
    if (!viewContainer) return;

    // Refresh streak in header
    this.updateHeaderGreeting();

    // Update Nav Active States
    document.querySelectorAll('.nav-item-btn, .mobile-nav-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Render corresponding view
    switch (viewName) {
      case 'home':
        FluentHomeView.render(viewContainer);
        break;
      case 'practice':
        FluentPracticeView.render(viewContainer, params);
        break;
      case 'frameworks':
        FluentFrameworksView.render(viewContainer);
        break;
      case 'vocabulary':
        FluentVocabularyView.render(viewContainer);
        break;
      case 'progress':
        FluentProgressView.render(viewContainer);
        break;
      case 'history':
        FluentHistoryView.render(viewContainer);
        break;
      case 'profile':
        FluentProfileView.render(viewContainer);
        break;
      default:
        FluentHomeView.render(viewContainer);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
window.FluentApp = FluentApp;

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  FluentApp.init();
});
