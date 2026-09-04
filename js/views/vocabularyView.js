/**
 * FLUENT - Vocabulary View Component
 */
const FluentVocabularyView = {
  selectedCategory: 'All',

  render(container) {
    const words = FluentVocabulary.getFiltered(this.selectedCategory);

    container.innerHTML = `
      <div class="view-header">
        <h1>Career & Technical Vocabulary</h1>
        <p>Elevate your technical explanations and interview responses with high-impact professional vocabulary.</p>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-filters" style="margin-bottom: 24px;">
        ${FluentVocabulary.CATEGORIES.map(cat => `
          <button class="category-pill ${this.selectedCategory === cat ? 'active' : ''}" data-vcat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Vocabulary Grid -->
      <div class="vocabulary-grid">
        ${words.map(vocab => `
          <div class="vocab-card">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span class="vocab-word">${vocab.word}</span>
                  <span class="vocab-phonetic">${vocab.phonetic}</span>
                </div>
                <span class="badge badge-teal">${vocab.category}</span>
              </div>
              
              <div class="vocab-def">${vocab.definition}</div>
              
              <div style="font-size: 0.825rem; color: var(--text-main); font-weight: 500; margin-bottom: 8px;">
                <strong>Professional Context:</strong> ${vocab.proMeaning}
              </div>

              <div class="vocab-example">
                "${vocab.example}"
              </div>

              ${vocab.related ? `
                <div style="font-size: 0.775rem; color: var(--text-muted);">
                  <strong>Related:</strong> ${vocab.related.join(', ')}
                </div>
              ` : ''}
            </div>

            <div style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
              <button class="btn btn-sm btn-outline-teal use-word-btn" data-word="${vocab.word}" style="width: 100%;">
                Use this word in today's practice
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Filter pills event
    container.querySelectorAll('[data-vcat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.vcat;
        this.render(container);
      });
    });

    // Use word in practice event
    container.querySelectorAll('.use-word-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const word = e.currentTarget.dataset.word;
        // Generate or synthesize topic around this word
        const topic = {
          id: `vocab-topic-${Date.now()}`,
          text: `Explain ${word} in a technical context`,
          category: 'Software Engineering',
          difficulty: 'INTERMEDIATE',
          desc: `Integrate the word "${word}" seamlessly into your answer.`
        };
        FluentApp.navigateTo('practice', { topic });
      });
    });
  }
};
window.FluentVocabularyView = FluentVocabularyView;
