/**
 * FLUENT - Frameworks Library View Component
 */
const FluentFrameworksView = {
  render(container) {
    container.innerHTML = `
      <div class="view-header">
        <h1>Speaking Frameworks Library</h1>
        <p>Master proven structural frameworks for interview communication, technical explanations, and spontaneous speaking.</p>
      </div>

      <div class="frameworks-grid">
        ${FluentFrameworks.FRAMEWORKS.map(fw => `
          <div class="framework-card">
            <div>
              <div class="framework-title">${fw.name}</div>
              <div class="framework-purpose">${fw.purpose}</div>
              
              <div class="framework-steps">
                ${fw.steps.map(step => `
                  <div class="framework-step-item">
                    <span class="framework-step-letter">${step.letter}</span>
                    <div>
                      <strong>${step.label}:</strong> <span style="color: var(--text-secondary);">${step.desc}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                ${fw.explanation}
              </div>
            </div>

            <div style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
              <button class="btn btn-outline-teal btn-sm practice-fw-btn" data-fw="${fw.id}" style="width: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
                Practice with ${fw.id.toUpperCase()}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.practice-fw-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const fwId = e.currentTarget.dataset.fw;
        FluentApp.navigateTo('practice', { framework: fwId });
      });
    });
  }
};
