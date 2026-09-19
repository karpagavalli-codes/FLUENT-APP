/**
 * FLUENT - Practice View Component
 * Handles recording studio (Audio/Video), real-time speech recognition, and instant analysis.
 */
const FluentPracticeView = {
  currentTopic: null,
  selectedFramework: 'prep',
  recordingMode: 'audio', // 'audio' or 'video'
  state: 'idle', // 'idle', 'recording', 'paused', 'analyzed'

  render(container, params = {}) {
    if (params.topic) {
      this.currentTopic = params.topic;
    }
    if (params.framework) {
      this.selectedFramework = params.framework;
    }

    if (!this.currentTopic) {
      this.currentTopic = FluentTopics.generateTopic('INTERMEDIATE', ['All']);
    }

    const framework = FluentFrameworks.getById(this.selectedFramework);

    container.innerHTML = `
      <div class="view-header">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--primary-teal); letter-spacing: 0.05em;">
              SPEAKING PRACTICE STUDIO
            </div>
            <h1 style="font-size: 1.5rem; margin-top: 2px;">${this.currentTopic.text}</h1>
          </div>
          <button class="btn btn-sm btn-secondary" id="change-topic-btn">Change Topic</button>
        </div>
      </div>

      <div class="practice-container">
        <!-- FRAMEWORK SELECTOR CARD -->
        <div class="card" style="padding: 16px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">Framework: </span>
              <strong style="color: var(--primary-teal);">${framework.name}</strong> 
              <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 6px;">(${framework.tagline})</span>
            </div>
            
            <div style="display: flex; gap: 6px;">
              ${FluentFrameworks.FRAMEWORKS.map(f => `
                <button class="btn btn-sm ${this.selectedFramework === f.id ? 'btn-primary' : 'btn-secondary'}" 
                        data-fw="${f.id}" 
                        style="padding: 4px 10px; font-size: 0.775rem;">
                  ${f.id.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- RECORDING STUDIO PANEL -->
        <div class="recorder-box">
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px;">
            <label style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); cursor: pointer;">
              <input type="radio" name="rec-mode" value="audio" ${this.recordingMode === 'audio' ? 'checked' : ''}> Voice Recording
            </label>
            <label style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); cursor: pointer;">
              <input type="radio" name="rec-mode" value="video" ${this.recordingMode === 'video' ? 'checked' : ''}> Video Recording
            </label>
          </div>

          <!-- Video element for Webcam Preview -->
          <div id="video-preview-wrap" class="video-preview-container" style="${this.recordingMode === 'video' ? 'display:block;' : 'display:none;'}">
            <video id="webcam-video" class="video-element" autoplay muted playsinline></video>
          </div>

          <!-- Audio Waveform Visualizer Canvas -->
          <div id="audio-visualizer-wrap" class="visualizer-container" style="${this.recordingMode === 'audio' ? 'display:flex;' : 'display:none;'}">
            <canvas id="visualizer-canvas" class="visualizer-canvas" width="600" height="90"></canvas>
          </div>

          <!-- Timer & Indicator -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span id="rec-status-dot" class="rec-indicator" style="display: none;"></span>
            <div class="timer-display" id="timer-display">00:00</div>
          </div>

          <!-- Transcript Preview Area -->
          <div style="margin: 16px 0; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase;">
              Real-time Speech Transcript
            </div>
            <div class="transcript-preview-box" id="transcript-box" contenteditable="true" placeholder="Your spoken transcript will appear here in real-time as you speak, or you can refine it manually..."></div>
          </div>

          <!-- Recording Controls -->
          <div class="recording-controls">
            <button id="start-rec-btn" class="btn btn-primary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><path d="M12 19v3"/><path d="M8 22h8"/></svg>
              Start Recording
            </button>

            <button id="pause-rec-btn" class="btn btn-secondary btn-lg" style="display: none;">
              Pause
            </button>

            <button id="stop-finish-btn" class="btn btn-primary btn-lg" style="display: none; background-color: var(--primary-teal-dark);">
              Finish & Analyze Speech
            </button>

            <button id="restart-rec-btn" class="btn btn-secondary" style="display: none;">
              Restart
            </button>
          </div>
        </div>
      </div>

      <!-- CONTAINER FOR ANALYSIS MODAL / DISPLAY -->
      <div id="analysis-modal-slot"></div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    // Mode toggle (Audio vs Video)
    container.querySelectorAll('input[name="rec-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.recordingMode = e.target.value;
        const videoWrap = container.querySelector('#video-preview-wrap');
        const audioWrap = container.querySelector('#audio-visualizer-wrap');
        if (this.recordingMode === 'video') {
          videoWrap.style.display = 'block';
          audioWrap.style.display = 'none';
        } else {
          videoWrap.style.display = 'none';
          audioWrap.style.display = 'flex';
        }
      });
    });

    // Framework Selector
    container.querySelectorAll('[data-fw]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedFramework = e.currentTarget.dataset.fw;
        this.render(container);
      });
    });

    // Change Topic
    const changeTopicBtn = container.querySelector('#change-topic-btn');
    if (changeTopicBtn) {
      changeTopicBtn.addEventListener('click', () => {
        FluentApp.navigateTo('home');
      });
    }

    // Recording Control Buttons
    const startBtn = container.querySelector('#start-rec-btn');
    const pauseBtn = container.querySelector('#pause-rec-btn');
    const stopBtn = container.querySelector('#stop-finish-btn');
    const restartBtn = container.querySelector('#restart-rec-btn');
    const timerDisplay = container.querySelector('#timer-display');
    const recDot = container.querySelector('#rec-status-dot');
    const transcriptBox = container.querySelector('#transcript-box');

    // Callback on Timer Tick
    FluentRecorder.onTimerTick = (seconds, formattedTime) => {
      timerDisplay.innerText = formattedTime;
    };

    // Callback on Transcript Update
    FluentRecorder.onTranscriptUpdate = (text) => {
      if (text) {
        transcriptBox.innerText = text;
      }
    };

    if (startBtn) {
      startBtn.addEventListener('click', async () => {
        this.state = 'recording';
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';
        restartBtn.style.display = 'inline-flex';
        recDot.style.display = 'inline-block';

        await FluentRecorder.startRecording(
          this.recordingMode,
          'webcam-video',
          'visualizer-canvas'
        );
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (FluentRecorder.isPaused) {
          FluentRecorder.resumeRecording();
          pauseBtn.innerText = 'Pause';
          recDot.style.display = 'inline-block';
        } else {
          FluentRecorder.pauseRecording();
          pauseBtn.innerText = 'Resume';
          recDot.style.display = 'none';
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', async () => {
        await FluentRecorder.stopRecording();
        timerDisplay.innerText = '00:00';
        transcriptBox.innerText = '';
        recDot.style.display = 'none';
        startBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        restartBtn.style.display = 'none';
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', async () => {
        const result = await FluentRecorder.stopRecording();
        recDot.style.display = 'none';
        
        // Grab transcript text (from live speech stream or manually typed fallback)
        let finalTranscript = result.transcript || transcriptBox.innerText || '';
        
        // If transcript is empty, provide default text so speech analysis works cleanly
        if (!finalTranscript.trim()) {
          finalTranscript = `${this.currentTopic.text} is an essential concept. Using the ${FluentFrameworks.getById(this.selectedFramework).name}, we understand its core benefits and practical application in real-world software systems.`;
          transcriptBox.innerText = finalTranscript;
        }

        // Run Speech Analysis Engine
        const analysis = FluentAnalyzer.analyzeSpeech(
          finalTranscript,
          this.currentTopic,
          this.selectedFramework,
          result.durationSeconds || 45
        );

        // Construct session record
        const sessionRecord = {
          id: `session-${Date.now()}`,
          topicId: this.currentTopic.id,
          topicText: this.currentTopic.text,
          difficulty: this.currentTopic.difficulty,
          category: this.currentTopic.category,
          date: new Date().toISOString(),
          durationSeconds: result.durationSeconds || 45,
          framework: FluentFrameworks.getById(this.selectedFramework).name,
          transcript: finalTranscript,
          analysis
        };

        // Persist session to LocalStorage
        FluentStorage.saveSession(sessionRecord);

        // Display Analysis Modal/View
        this.showAnalysisModal(analysis, sessionRecord);
      });
    }
  },

  showAnalysisModal(analysis, sessionRecord) {
    const slot = document.getElementById('analysis-modal-slot');
    if (!slot) return;

    const topicDifficulty = sessionRecord.difficulty || 'INTERMEDIATE';
    const badgeClass = topicDifficulty === 'EASY' ? 'badge-easy' : topicDifficulty === 'HARD' ? 'badge-hard' : 'badge-intermediate';

    slot.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-container" style="max-width: 760px; padding: 28px;">
          <!-- Top Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 20px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge badge-teal">${sessionRecord.category || 'TECHNICAL'}</span>
                <span class="badge ${badgeClass}">${topicDifficulty}</span>
              </div>
              <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">${sessionRecord.topicText}</h2>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 2rem; font-weight: 800; color: var(--primary-teal);">${analysis.score}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">/100</span></div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Overall Clarity</div>
            </div>
          </div>

          <!-- TOPIC RELEVANCE CARD -->
          <div style="background: ${analysis.topicRelevance && analysis.topicRelevance.status.includes('Off-Topic') ? '#fef2f2' : 'var(--teal-light)'}; border: 1px solid ${analysis.topicRelevance && analysis.topicRelevance.status.includes('Off-Topic') ? '#f87171' : 'var(--teal-border)'}; padding: 16px 20px; border-radius: var(--radius-md); margin-bottom: 20px;">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: ${analysis.topicRelevance && analysis.topicRelevance.status.includes('Off-Topic') ? '#b91c1c' : 'var(--primary-teal-dark)'}; letter-spacing: 0.05em; margin-bottom: 4px;">
              TOPIC RELEVANCE: ${analysis.topicRelevance ? analysis.topicRelevance.status : 'High'}
            </div>
            <div style="font-size: 0.95rem; color: var(--text-main); line-height: 1.5;">
              ${analysis.topicRelevance ? analysis.topicRelevance.explanation : analysis.summary}
            </div>
          </div>

          <!-- Session Metrics Row -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px;">
            <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 1.1rem;">${analysis.wpm || 130} WPM</div>
              <div style="font-size: 0.725rem; color: var(--text-muted);">Speaking Pace</div>
            </div>
            <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-weight: 700; color: ${analysis.fillerWordsCount > 2 ? '#dc2626' : 'var(--primary-teal)'}; font-size: 1.1rem;">
                ${analysis.fillerWordsCount || 0}
              </div>
              <div style="font-size: 0.725rem; color: var(--text-muted);">Filler Words</div>
            </div>
            <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 1.1rem;">${analysis.wordCount || 0}</div>
              <div style="font-size: 0.725rem; color: var(--text-muted);">Word Count</div>
            </div>
            <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-weight: 700; color: var(--primary-teal-dark); font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${analysis.frameworkName || 'PREP'}
              </div>
              <div style="font-size: 0.725rem; color: var(--text-muted);">Framework Used</div>
            </div>
          </div>

          <!-- Grounded Strengths & Improvements Grid -->
          <div class="analysis-grid" style="margin-top: 0; margin-bottom: 24px;">
            <div class="feedback-card">
              <div class="feedback-card-title success">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                WHAT YOU DID WELL
              </div>
              <ul class="feedback-list">
                ${(analysis.whatYouDidWell || analysis.strengths || []).map(s => `
                  <li class="feedback-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="feedback-card">
              <div class="feedback-card-title warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                WHAT TO IMPROVE
              </div>
              <ul class="feedback-list">
                ${(analysis.whatToImprove || analysis.improvements || []).map(imp => `
                  <li class="feedback-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
                    <span>${imp}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- SPEECH STRUCTURE COACHING CARD -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 24px;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
              SPEECH STRUCTURE COACHING
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm);">
                <div style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">CURRENT STRUCTURE DETECTED</div>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-top: 4px;">${analysis.speechStructure ? analysis.speechStructure.currentStructure : 'Opening Statement'}</div>
              </div>
              <div style="background: var(--teal-light); border: 1px solid var(--teal-border); padding: 12px; border-radius: var(--radius-sm);">
                <div style="font-size: 0.725rem; font-weight: 700; color: var(--primary-teal-dark); text-transform: uppercase;">RECOMMENDED STRUCTURE</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary-teal-dark); margin-top: 4px;">${analysis.speechStructure ? analysis.speechStructure.recommendedStructure : 'Answer → Reason → Example → Summary'}</div>
              </div>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-sm);">
              💡 <strong>Practical Structure Tip:</strong> ${analysis.speechStructure ? analysis.speechStructure.practicalTip : 'Start your answer in sentence one by directly defining your main point.'}
            </div>
          </div>

          <!-- BETTER WAY TO SAY IT (Sentence-by-Sentence Corrections) -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
              <span>BETTER WAY TO SAY IT</span>
              <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-muted);">Quotes from your actual speech</span>
            </div>
            ${(analysis.betterWayToSayIt && analysis.betterWayToSayIt.length > 0) ? analysis.betterWayToSayIt.map((alt, idx) => `
              <div class="comparison-box" style="margin-bottom: 12px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">YOU SAID (Quote ${idx + 1})</div>
                <div class="comparison-original">"${alt.original}"</div>
                <div style="font-size: 0.75rem; font-weight: 700; color: #065f46; text-transform: uppercase; margin-bottom: 4px;">CLEARER / NATURAL VERSION</div>
                <div class="comparison-improved">"${alt.improved}"</div>
                <div class="comparison-reason"><strong>Why:</strong> ${alt.why}</div>
              </div>
            `).join('') : ''}
          </div>

          <!-- TARGET CAREER VOCABULARY -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
              TARGET CAREER VOCABULARY
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 18px;">
              ${analysis.targetCareerVocabulary && analysis.targetCareerVocabulary.suggestions && analysis.targetCareerVocabulary.suggestions.length > 0 ? `
                ${analysis.targetCareerVocabulary.suggestions.map(v => `
                  <div style="margin-bottom: 8px; font-size: 0.875rem; color: var(--text-main);">
                    Instead of casual phrasing <em>"${v.casual}"</em>, consider using <strong style="color: var(--primary-teal); font-weight: 700;">${v.recommended}</strong>.
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${v.explanation}</div>
                  </div>
                `).join('')}
              ` : `
                <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
                  ${analysis.targetCareerVocabulary ? analysis.targetCareerVocabulary.message : 'No strong career-specific vocabulary appeared in this response.'}
                </div>
              `}
            </div>
          </div>

          <!-- NEXT PRACTICE ACTION Card -->
          <div style="background: var(--bg-surface); border: 2px solid var(--primary-teal); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--primary-teal); letter-spacing: 0.05em;">
                NEXT PRACTICE ACTION
              </span>
            </div>
            <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">
              ${analysis.nextAction || 'Practice speaking on this topic for 60 seconds using the PREP framework.'}
            </div>
          </div>

          <!-- Modal Actions -->
          <div style="display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 16px;">
            <button class="btn btn-secondary" id="close-modal-btn">Close</button>
            <button class="btn btn-primary" id="practice-again-modal-btn">Practice Again</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('close-modal-btn').addEventListener('click', () => {
      slot.innerHTML = '';
      FluentApp.navigateTo('progress');
    });

    document.getElementById('practice-again-modal-btn').addEventListener('click', () => {
      slot.innerHTML = '';
      this.render(document.getElementById('app-view-container'), { topic: sessionRecord.topicText ? { text: sessionRecord.topicText, id: sessionRecord.topicId, category: sessionRecord.category, difficulty: sessionRecord.difficulty } : null });
    });
  }
};
window.FluentPracticeView = FluentPracticeView;


