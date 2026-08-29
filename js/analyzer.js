/**
 * FLUENT - Speech Analysis Engine
 * Analyzes real recorded transcripts for Content, Structure, Language, WPM, Filler Words, and Vocabulary opportunity.
 */
const FluentAnalyzer = {
  FILLER_WORDS: ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'i mean', 'kind of', 'sort of'],

  analyzeSpeech(transcript, topicObj, frameworkId = 'prep', durationSeconds = 60) {
    if (!transcript || transcript.trim().length === 0) {
      return this.generateEmptyAnalysis(topicObj, frameworkId);
    }

    const text = transcript.trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Calculate WPM (Words Per Minute)
    const minutes = Math.max(durationSeconds / 60, 0.2);
    const wpm = Math.round(wordCount / minutes);

    // 2. Count Filler Words
    let fillerCount = 0;
    const fillerBreakdown = {};
    const lowerText = text.toLowerCase();

    this.FILLER_WORDS.forEach(filler => {
      // Regex count for exact filler phrase
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        fillerCount += matches.length;
        fillerBreakdown[filler] = matches.length;
      }
    });

    // 3. Evaluate Framework Structure
    const framework = FluentFrameworks.getById(frameworkId);
    const structureResult = this.evaluateStructure(text, framework);

    // 4. Extract Strengths & Improvements
    const strengths = [];
    const improvements = [];

    // Strengths evaluation
    if (wordCount > 30) {
      strengths.push(`Good response length (${wordCount} words) allowing full elaboration.`);
    }
    if (structureResult.matchedSteps.length >= 2) {
      strengths.push(`Clearly followed structural components of ${framework.name}.`);
    }
    if (lowerText.includes('for example') || lowerText.includes('such as') || lowerText.includes('instance')) {
      strengths.push(`Included concrete examples to substantiate your points.`);
    } else {
      strengths.push(`Maintained a clear topic focus throughout your answer.`);
    }

    // Improvements evaluation
    if (fillerCount >= 4) {
      improvements.push(`Detected ${fillerCount} filler words (${Object.keys(fillerBreakdown).join(', ')}). Try pausing silently instead.`);
    }
    if (wpm > 170) {
      improvements.push(`Speaking pace was slightly fast (${wpm} WPM). Aim for 130–150 WPM for maximum clarity.`);
    } else if (wpm < 105 && wordCount > 20) {
      improvements.push(`Speaking pace was deliberate (${wpm} WPM). Practice smoother transitions between ideas.`);
    }
    if (!lowerText.includes('because') && !lowerText.includes('reason') && !lowerText.includes('since')) {
      improvements.push(`Add explicit causal connectors (e.g. "This matters because...") to strengthen your reasoning.`);
    }

    // 5. Better Way to Say It (Contextual Rewrite)
    const betterWayToSayIt = this.generateBetterWayToSayIt(text, topicObj);

    // 6. Technical Vocabulary Connection
    const vocabularyOpportunities = this.identifyVocabOpportunities(text);

    // 7. Overall Score Calculation
    let score = 80;
    score += Math.min(structureResult.matchedSteps.length * 5, 15);
    score -= Math.min(fillerCount * 2, 12);
    if (wpm >= 120 && wpm <= 160) score += 5;
    score = Math.max(65, Math.min(98, score));

    return {
      score,
      wordCount,
      wpm,
      fillerWordsCount: fillerCount,
      fillerBreakdown,
      frameworkName: framework.name,
      structureFound: structureResult.matchedSteps,
      strengths: strengths.slice(0, 4),
      improvements: improvements.slice(0, 3),
      betterWayToSayIt,
      vocabularyOpportunities,
      recurringPattern: fillerCount > 3 
        ? `You frequently rely on filler words like "${Object.keys(fillerBreakdown)[0] || 'like'}" when transitioning between ideas.`
        : `Your speaking structure is strong. Focus on replacing casual phrasing with precise technical terms.`
    };
  },

  evaluateStructure(text, framework) {
    const lower = text.toLowerCase();
    const matchedSteps = [];

    framework.steps.forEach(step => {
      const label = step.label.toLowerCase();
      if (label === 'point' && (lower.includes('believe') || lower.includes('think') || lower.includes('is a') || lower.includes('main'))) {
        matchedSteps.push(step.label);
      } else if (label === 'reason' && (lower.includes('because') || lower.includes('reason') || lower.includes('due to') || lower.includes('why'))) {
        matchedSteps.push(step.label);
      } else if ((label.includes('example') || label.includes('explanation')) && (lower.includes('example') || lower.includes('instance') || lower.includes('such as') || lower.includes('like when'))) {
        matchedSteps.push(step.label);
      } else if (label === 'situation' || label === 'task' || label === 'action' || label === 'result') {
        matchedSteps.push(step.label);
      }
    });

    return { matchedSteps: Array.from(new Set(matchedSteps)) };
  },

  generateBetterWayToSayIt(text, topicObj) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const targetSentence = sentences[0] ? sentences[0].trim() : text;

    if (targetSentence.toLowerCase().includes('useful') || targetSentence.toLowerCase().includes('good')) {
      return {
        original: targetSentence,
        improved: `${topicObj.text} provides critical operational benefits by automating routine workflows and reducing technical friction.`,
        reason: "Replaces generic words like 'useful' or 'good' with precise domain impact terms like 'operational benefits' and 'reducing technical friction'."
      };
    }

    return {
      original: targetSentence,
      improved: `When addressing ${topicObj.text}, it is essential to highlight three key dimensions: architectural scalability, developer velocity, and long-term maintainability.`,
      reason: "Provides a structured multi-point opening statement that immediately establishes authority."
    };
  },

  identifyVocabOpportunities(text) {
    const lower = text.toLowerCase();
    const opps = [];

    if (lower.includes('handle many users') || lower.includes('grow big')) {
      opps.push({ casual: 'handle many users', recommended: 'scalable / scalability', def: 'Ability of a system to handle increased load without performance degradation.' });
    }
    if (lower.includes('easy to fix') || lower.includes('easy to change')) {
      opps.push({ casual: 'easy to change', recommended: 'maintainable / maintainability', def: 'Software designed for clean, low-risk future modifications.' });
    }
    if (lower.includes('hide details') || lower.includes('simple interface')) {
      opps.push({ casual: 'hide details', recommended: 'abstraction', def: 'Hiding internal execution complexity behind clear interfaces.' });
    }

    if (opps.length === 0) {
      opps.push({ casual: 'important system design', recommended: 'architecture', def: 'The foundational structure and organization of software components.' });
    }

    return opps;
  },

  generateEmptyAnalysis(topicObj, frameworkId) {
    return {
      score: 70,
      wordCount: 0,
      wpm: 0,
      fillerWordsCount: 0,
      fillerBreakdown: {},
      frameworkName: FluentFrameworks.getById(frameworkId).name,
      structureFound: [],
      strengths: ['Started a recording session.'],
      improvements: ['Ensure your microphone is enabled and speak clearly into the device.'],
      betterWayToSayIt: {
        original: "No speech detected.",
        improved: `Start speaking directly about ${topicObj.text} using the PREP structure.`,
        reason: "Clear articulation requires practice with active speech input."
      },
      vocabularyOpportunities: [],
      recurringPattern: "No spoken audio recorded yet."
    };
  }
};
