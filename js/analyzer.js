/**
 * FLUENT - Advanced Speech Analysis Engine
 * Topic-grounded, transcript-specific analysis pipeline for public speaking & technical communication.
 */
const FluentAnalyzer = {
  // Common stopwords to exclude from concept matching
  STOPWORDS: new Set([
    'what', 'why', 'how', 'when', 'where', 'who', 'which', 'should', 'would', 'could', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'do', 'does', 'did', 'doing', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 
    'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into', 'over', 'after', 'this', 'that', 'these', 'those', 
    'it', 'its', 'they', 'them', 'their', 'your', 'my', 'our', 'we', 'you', 'he', 'she', 'his', 'her', 'can', 'will'
  ]),

  // Domain knowledge map for topics & categories
  DOMAINS: {
    'AI & Machine Learning': {
      concepts: ['model', 'data', 'training', 'neural network', 'inference', 'transformer', 'automation', 'weights', 'accuracy', 'latency', 'dataset', 'algorithm', 'parameter'],
      vocabMap: [
        { casual: ['big model', 'large model', 'ai system'], replacement: 'large language model (LLM)', def: 'Deep learning models with billions of parameters designed for complex tasks.' },
        { casual: ['learns from data', 'trains on data'], replacement: 'pattern recognition / supervised learning', def: 'The algorithmic process of optimizing parameters against dataset features.' },
        { casual: ['fast response', 'quick answer'], replacement: 'low-latency inference', def: 'Executing model predictions rapidly upon receiving input requests.' },
        { casual: ['works good', 'is accurate'], replacement: 'high precision / generalization', def: 'The ability of a model to perform accurately on unseen real-world data.' }
      ]
    },
    'Technology': {
      concepts: ['api', 'server', 'client', 'database', 'latency', 'cloud', 'microservices', 'container', 'execution', 'protocol', 'network', 'request', 'response', 'scaling'],
      vocabMap: [
        { casual: ['handle many users', 'grow big', 'handle load'], replacement: 'scalable / horizontal scaling', def: 'Expanding system capability by adding more instances or nodes seamlessly.' },
        { casual: ['talks to other app', 'connect systems'], replacement: 'API contract / protocol integration', def: 'Interface defining standard rules and data structures for inter-system communication.' },
        { casual: ['fast speed', 'quick loading'], replacement: 'low latency / high throughput', def: 'Minimizing round-trip delay and maximizing processed requests per second.' },
        { casual: ['easy to change', 'simple layout'], replacement: 'modular architecture', def: 'Designing system components independently so changes do not cascade.' }
      ]
    },
    'Software Engineering': {
      concepts: ['code', 'testing', 'refactoring', 'design pattern', 'maintainability', 'abstraction', 'git', 'deployment', 'ci/cd', 'monolith', 'decoupling', 'architecture'],
      vocabMap: [
        { casual: ['easy to fix', 'easy to edit'], replacement: 'maintainable / maintainability', def: 'Software designed for clean, low-risk future modifications and bug fixes.' },
        { casual: ['hide details', 'simple view'], replacement: 'abstraction', def: 'Exposing essential interface methods while suppressing underlying complexity.' },
        { casual: ['test code', 'check bugs'], replacement: 'automated regression testing', def: 'Executing test suites continuously to verify existing behavior remains intact.' },
        { casual: ['change code', 'clean code'], replacement: 'refactor / refactoring', def: 'Restructuring existing computer code without changing its external behavior.' }
      ]
    },
    'Startups': {
      concepts: ['product-market fit', 'acquisition', 'churn', 'bootstrapping', 'venture capital', 'roi', 'metrics', 'value proposition', 'retention', 'traction', 'mvp'],
      vocabMap: [
        { casual: ['get customers', 'find users'], replacement: 'user acquisition / CAC', def: 'The strategic process of bringing new users into your product funnel.' },
        { casual: ['users leaving', 'losing users'], replacement: 'customer churn', def: 'The percentage of customers that stop using your product over a given period.' },
        { casual: ['making money', 'profit margin'], replacement: 'unit economics / ROI', def: 'Direct revenues and costs associated with a business model measured per unit.' },
        { casual: ['starting company', 'self funded'], replacement: 'bootstrapping', def: 'Building a business with personal capital and operating cash flows without external investment.' }
      ]
    },
    'Business': {
      concepts: ['negotiation', 'stakeholder', 'efficiency', 'culture', 'roi', 'benchmarking', 'strategy', 'alignment', 'operations', 'revenue', 'leadership'],
      vocabMap: [
        { casual: ['talk to people', 'different teams'], replacement: 'cross-functional stakeholder management', def: 'Aligning goals across engineering, product, and business departments.' },
        { casual: ['work faster', 'do things better'], replacement: 'operational efficiency', def: 'Maximizing output value while minimizing waste, time, and redundant efforts.' },
        { casual: ['same direction', 'agree together'], replacement: 'strategic alignment', def: 'Ensuring all teams work toward identical overarching corporate objectives.' }
      ]
    },
    'Finance': {
      concepts: ['valuation', 'cash flow', 'interest', 'liquidity', 'assets', 'diversification', 'leverage', 'yield', 'portfolio', 'capital'],
      vocabMap: [
        { casual: ['money coming in', 'cash in hand'], replacement: 'cash flow / liquidity', def: 'The net amount of cash being transferred into and out of a business.' },
        { casual: ['spreading money', 'different stocks'], replacement: 'portfolio diversification', def: 'Allocating investments across varied assets to reduce exposure to any single risk.' },
        { casual: ['worth of company', 'value of business'], replacement: 'market valuation', def: 'The total calculated economic worth of a company or asset.' }
      ]
    },
    'Psychology': {
      concepts: ['behavior', 'cognitive', 'mindset', 'habit', 'focus', 'emotion', 'bias', 'dissonance', 'perception', 'motivation'],
      vocabMap: [
        { casual: ['thinking pattern', 'mind state'], replacement: 'cognitive framework / mindset', def: 'The underlying set of assumptions and mental habits that shape perception.' },
        { casual: ['control emotions', 'understand feelings'], replacement: 'emotional intelligence (EQ)', def: 'The capability to recognize, understand, and manage your own and others emotions.' },
        { casual: ['doing repeatedly', 'automatic action'], replacement: 'habit loop / automaticity', def: 'A psychological cue, routine, and reward cycle that forms ingrained behavior.' }
      ]
    },
    'Science': {
      concepts: ['hypothesis', 'thermodynamics', 'quantum', 'entropy', 'empirical', 'variable', 'systemic', 'conservation', 'experiment', 'energy'],
      vocabMap: [
        { casual: ['testing ideas', 'proving stuff'], replacement: 'empirical validation', def: 'Verifying a theory through direct observation, experiment, and data collection.' },
        { casual: ['randomness', 'disorder'], replacement: 'entropy', def: 'A measure of fundamental disorder or randomness within a closed physical system.' }
      ]
    },
    'Communication': {
      concepts: ['clarity', 'audience', 'engagement', 'perspective', 'structured', 'concise', 'persuasion', 'active listening', 'articulate'],
      vocabMap: [
        { casual: ['explain clearly', 'say it well'], replacement: 'articulate / precision', def: 'Expressing an idea fluently and coherently with exact words.' },
        { casual: ['talk to audience', 'people listening'], replacement: 'audience-centric narrative', def: 'Tailoring message structure to match the listener background and needs.' }
      ]
    },
    'Career': {
      concepts: ['mentorship', 'networking', 'personal branding', 'resilience', 'specialization', 'generalist', 'growth', 'skillset'],
      vocabMap: [
        { casual: ['knowing many things', 'broad skills'], replacement: 'T-shaped generalist', def: 'Possessing deep discipline expertise combined with broad cross-domain adaptability.' },
        { casual: ['keep going', 'handling failure'], replacement: 'career resilience', def: 'The ability to adapt quickly to workplace changes, setbacks, and shifting demands.' }
      ]
    },
    'General Knowledge': {
      concepts: ['critical thinking', 'heuristics', 'systems thinking', 'trade-offs', 'evidence', 'rationale', 'socratic', 'logic'],
      vocabMap: [
        { casual: ['thinking deeply', 'smart thinking'], replacement: 'critical analysis', def: 'Evaluating facts objectively to form a judgment free from cognitive bias.' },
        { casual: ['shortcut', 'quick rule'], replacement: 'heuristic', def: 'A practical problem-solving approach or mental shortcut for rapid decision making.' }
      ]
    }
  },

  analyzeSpeech(transcript, topicObj, frameworkId = 'prep', durationSeconds = 45) {
    if (!transcript || transcript.trim().length === 0) {
      return this.generateEmptyAnalysis(topicObj, frameworkId);
    }

    const text = transcript.trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. WPM calculation
    const minutes = Math.max(durationSeconds / 60, 0.25);
    const wpm = Math.round(wordCount / minutes);

    // 2. Sentences extraction
    const rawSentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const sentences = rawSentences.map(s => s.trim()).filter(s => s.length > 0);

    // 3. Domain & Topic understanding (filtering out generic question stopwords)
    const category = topicObj.category || 'General Knowledge';
    const domainData = this.DOMAINS[category] || this.DOMAINS['General Knowledge'];
    const topicTextLower = (topicObj.text || '').toLowerCase();
    
    // Extract non-stopword keywords from topic title
    const topicKeywords = topicTextLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !this.STOPWORDS.has(w));
    const expectedConcepts = Array.from(new Set([...topicKeywords, ...domainData.concepts]));

    // Find concepts mentioned in transcript
    const lowerText = text.toLowerCase();
    const foundConcepts = expectedConcepts.filter(concept => {
      const reg = new RegExp(`\\b${concept}\\b`, 'i');
      return reg.test(lowerText);
    });

    const missingConcepts = expectedConcepts.filter(concept => !foundConcepts.includes(concept) && !this.STOPWORDS.has(concept)).slice(0, 3);

    // 4. Context-Aware Filler Word Analysis
    const fillerResult = this.detectFillersContextual(text);
    
    // 5. Repetition Analysis
    const repetitionResult = this.detectRepetition(words, lowerText);

    // 6. Sentence Classification & Quotes
    const sentenceAnalysis = this.analyzeSentences(sentences, topicObj);

    // 7. Framework Evaluation
    const framework = (typeof FluentFrameworks !== 'undefined' && FluentFrameworks.getById) 
      ? FluentFrameworks.getById(frameworkId)
      : { id: frameworkId, name: frameworkId.toUpperCase(), steps: [{ label: 'Point' }, { label: 'Reason' }, { label: 'Example' }, { label: 'Point' }] };
    
    const structureResult = this.evaluateFrameworkStructure(sentences, lowerText, framework, topicObj.difficulty);

    // 8. Generate 2 to 4 "You Said → Try Saying → Why" Alternatives from REAL sentences
    const alternatives = this.generateSentenceAlternatives(sentences, topicObj, domainData, fillerResult);

    // 9. Vocabulary Upgrades based on actual transcript
    const vocabUpgrades = this.generateVocabularyUpgrades(lowerText, domainData, topicObj);

    // 10. Strengths & Improvements (Grounded in transcript)
    const strengths = this.generateGroundedStrengths(sentences, sentenceAnalysis, foundConcepts, framework, structureResult, wordCount);
    const improvements = this.generateGroundedImprovements(topicObj, missingConcepts, structureResult, fillerResult, sentenceAnalysis, wordCount);

    // 11. Framework Recommendation & One Next Action
    const frameworkRec = this.determineFrameworkRecommendation(frameworkId, structureResult, topicObj);
    const nextAction = this.generateOneNextAction(topicObj, missingConcepts, frameworkRec, fillerResult);

    // 12. Quick Summary
    const summary = this.generateExecutiveSummary(topicObj, foundConcepts, missingConcepts, structureResult, fillerResult);

    // 13. Overall Score Calculation
    let score = 78;
    if (foundConcepts.length > 0) score += Math.min(foundConcepts.length * 3, 12);
    if (structureResult.matchedSteps.length >= 2) score += 6;
    if (sentenceAnalysis.hasReason) score += 4;
    if (sentenceAnalysis.hasExample) score += 4;
    if (fillerResult.totalCount === 0) score += 4;
    else score -= Math.min(fillerResult.totalCount * 2, 10);
    if (wpm >= 120 && wpm <= 160) score += 4;
    if (wordCount < 20) score -= 12;
    score = Math.max(60, Math.min(98, score));

    // Internal Schema (Section 20 requirement)
    const schema = {
      topic_understanding: {
        topicText: topicObj.text,
        category: topicObj.category,
        difficulty: topicObj.difficulty,
        expectedConcepts,
        foundConcepts,
        missingConcepts
      },
      response_summary: {
        summary,
        wordCount,
        wpm,
        durationSeconds
      },
      content: {
        explained: foundConcepts,
        missing: missingConcepts,
        clarificationNeeded: sentenceAnalysis.vagueSentences.map(s => s.text)
      },
      structure: {
        frameworkName: framework.name,
        matchedSteps: structureResult.matchedSteps,
        missingSteps: structureResult.missingSteps,
        flowAnalysis: structureResult.flowAnalysis
      },
      language: {
        vaguePhrases: sentenceAnalysis.vaguePhrases
      },
      filler_words: {
        totalCount: fillerResult.totalCount,
        breakdown: fillerResult.breakdown
      },
      repetition: {
        repeatedWords: repetitionResult.repeatedWords
      },
      vocabulary: {
        upgrades: vocabUpgrades
      },
      framework: frameworkRec,
      alternatives: alternatives,
      next_action: nextAction
    };

    return {
      score,
      wordCount,
      wpm,
      fillerWordsCount: fillerResult.totalCount,
      fillerBreakdown: fillerResult.breakdown,
      frameworkName: framework.name,
      structureFound: structureResult.matchedSteps,
      summary,
      strengths: strengths.slice(0, 4),
      improvements: improvements.slice(0, 4),
      contentAnalysis: {
        explained: foundConcepts,
        missing: missingConcepts,
        clarificationNeeded: sentenceAnalysis.clarificationNotes
      },
      structureAnalysis: structureResult,
      betterWayToSayIt: alternatives[0] || null, // Backward compatibility
      alternatives: alternatives.slice(0, 4),
      vocabularyOpportunities: vocabUpgrades,
      speakingHabits: {
        fillersCount: fillerResult.totalCount,
        fillerBreakdown: fillerResult.breakdown,
        repetition: repetitionResult,
        wpmStatus: wpm > 170 ? 'Fast' : wpm < 105 ? 'Deliberate' : 'Optimal'
      },
      frameworkRecommendation: frameworkRec,
      nextAction,
      schema
    };
  },

  detectFillersContextual(text) {
    const lower = text.toLowerCase();
    let totalCount = 0;
    const breakdown = {};

    // 1. Absolute fillers (always filler)
    const absoluteFillers = ['um', 'uh', 'er', 'ah'];
    absoluteFillers.forEach(f => {
      const reg = new RegExp(`\\b${f}\\b`, 'gi');
      const matches = lower.match(reg);
      if (matches) {
        totalCount += matches.length;
        breakdown[f] = matches.length;
      }
    });

    // 2. Context-dependent "like"
    const likeFillerMatches = lower.match(/\b(is|was|are|were|and|so|meaning)\s+like\b|,\s*like\s*,|\blike\s+(basically|actually|you know|um|uh)\b/g);
    if (likeFillerMatches) {
      totalCount += likeFillerMatches.length;
      breakdown['like (filler context)'] = likeFillerMatches.length;
    }

    // 3. Context-dependent "so"
    const soFillerMatches = lower.match(/(^|[.!?]\s+)so\s+(um|uh|like|basically|actually|,)/g);
    if (soFillerMatches) {
      totalCount += soFillerMatches.length;
      breakdown['so (filler staller)'] = soFillerMatches.length;
    }

    // 4. Staller phrases
    const phrases = ['basically', 'actually', 'you know', 'i mean', 'kind of', 'sort of', 'literally'];
    phrases.forEach(p => {
      const reg = new RegExp(`\\b${p}\\b`, 'gi');
      const matches = lower.match(reg);
      if (matches) {
        totalCount += matches.length;
        breakdown[p] = matches.length;
      }
    });

    return { totalCount, breakdown };
  },

  detectRepetition(words, lowerText) {
    const counts = {};

    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^\w]/g, '');
      if (clean.length > 3 && !this.STOPWORDS.has(clean)) {
        counts[clean] = (counts[clean] || 0) + 1;
      }
    });

    const repeatedWords = [];
    Object.keys(counts).forEach(w => {
      if (counts[w] >= 4) {
        repeatedWords.push({ word: w, count: counts[w] });
      }
    });

    return { repeatedWords };
  },

  analyzeSentences(sentences, topicObj) {
    let hasClaim = false;
    let hasReason = false;
    let hasExample = false;
    let hasCounter = false;
    let hasConclusion = false;
    
    let claimQuote = '';
    let reasonQuote = '';
    let exampleQuote = '';

    const vagueSentences = [];
    const vaguePhrases = [];
    const clarificationNotes = [];

    const vagueKeywords = ['many things', 'good stuff', 'very useful', 'big system', 'do stuff', 'lots of', 'nice way', 'make it work', 'things like that'];

    sentences.forEach(s => {
      const lower = s.toLowerCase();
      
      // Check claim
      if (!hasClaim && (lower.includes('is a') || lower.includes('defined as') || lower.includes('refers to') || lower.includes('means') || lower.includes('allows') || lower.includes('believe') || lower.includes('in my view'))) {
        hasClaim = true;
        claimQuote = s;
      }
      
      // Check reason
      if (!hasReason && (lower.includes('because') || lower.includes('since') || lower.includes('due to') || lower.includes('the reason') || lower.includes('this allows') || lower.includes('which leads to'))) {
        hasReason = true;
        reasonQuote = s;
      }

      // Check example
      if (!hasExample && (lower.includes('for example') || lower.includes('such as') || lower.includes('for instance') || lower.includes('like when') || lower.includes('in practice') || lower.includes('scenario'))) {
        hasExample = true;
        exampleQuote = s;
      }

      // Check counterpoint
      if (!hasCounter && (lower.includes('however') || lower.includes('although') || lower.includes('on the other hand') || lower.includes('despite') || lower.includes('trade-off'))) {
        hasCounter = true;
      }

      // Check conclusion
      if (!hasConclusion && (lower.includes('in conclusion') || lower.includes('overall') || lower.includes('therefore') || lower.includes('to summarize') || lower.includes('ultimately'))) {
        hasConclusion = true;
      }

      // Check vague phrasing
      vagueKeywords.forEach(vk => {
        if (lower.includes(vk)) {
          vaguePhrases.push(vk);
          vagueSentences.push({ text: s, vagueWord: vk });
        }
      });
    });

    if (vagueSentences.length > 0) {
      clarificationNotes.push(`Your statement "${vagueSentences[0].text}" could be strengthened by replacing vague terms like "${vagueSentences[0].vagueWord}" with specific domain mechanisms.`);
    }

    return {
      hasClaim,
      hasReason,
      hasExample,
      hasCounter,
      hasConclusion,
      claimQuote,
      reasonQuote,
      exampleQuote,
      vagueSentences,
      vaguePhrases,
      clarificationNotes
    };
  },

  evaluateFrameworkStructure(sentences, lowerText, framework, difficulty) {
    const matchedSteps = [];
    const missingSteps = [];

    framework.steps.forEach(step => {
      const label = step.label.toLowerCase();
      let found = false;

      if (label.includes('point') || label.includes('claim') || label.includes('situation')) {
        found = lowerText.includes('believe') || lowerText.includes('is a') || lowerText.includes('think') || lowerText.includes('main') || lowerText.includes('refers') || lowerText.includes('allows');
      } else if (label.includes('reason') || label.includes('cause') || label.includes('evidence')) {
        found = lowerText.includes('because') || lowerText.includes('reason') || lowerText.includes('due to') || lowerText.includes('since') || lowerText.includes('shows that') || lowerText.includes('benchmark');
      } else if (label.includes('example') || label.includes('explanation') || label.includes('action') || label.includes('contrast')) {
        found = lowerText.includes('example') || lowerText.includes('instance') || lowerText.includes('such as') || lowerText.includes('like when') || lowerText.includes('scenario') || lowerText.includes('in practice');
      } else if (label.includes('result') || label.includes('conclusion') || label.includes('solution')) {
        found = lowerText.includes('conclusion') || lowerText.includes('therefore') || lowerText.includes('overall') || lowerText.includes('so the solution') || lowerText.includes('recommend');
      }

      if (found) {
        matchedSteps.push(step.label);
      } else {
        missingSteps.push(step.label);
      }
    });

    let flowAnalysis = matchedSteps.length >= 3 
      ? `Strong logical structure. You successfully covered ${matchedSteps.join(' → ')}.`
      : `Structure missing key elements. You included ${matchedSteps.join(', ') || 'initial points'}, but missed ${missingSteps.join(', ')}.`;

    if (difficulty === 'HARD' && !lowerText.includes('however') && !lowerText.includes('trade-off')) {
      flowAnalysis += ` For HARD level topics, including a trade-off or counterpoint ("however...") significantly elevates your argument quality.`;
    }

    return { matchedSteps, missingSteps, flowAnalysis };
  },

  generateSentenceAlternatives(sentences, topicObj, domainData, fillerResult) {
    const alternatives = [];
    const usedIndices = new Set();

    // 1. Look for sentence with vague phrasing
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const lower = s.toLowerCase();
      if (lower.includes('many things') || lower.includes('useful') || lower.includes('good') || lower.includes('stuff') || lower.includes('handle more') || lower.includes('do things')) {
        usedIndices.add(i);

        let improved = s;
        let reason = '';

        if (lower.includes('useful') || lower.includes('many things')) {
          improved = `The core benefit of ${topicObj.text} is that it streamlines technical operations, automates routine tasks, and enhances system reliability.`;
          reason = `Replaces generic descriptors ('useful', 'many things') with specific operational outcomes (streamlines operations, automates tasks, enhances reliability).`;
        } else if (lower.includes('handle more') || lower.includes('handle many')) {
          improved = `The system architecture must be designed for horizontal scalability to handle growing user traffic without performance degradation.`;
          reason = `Upgrades casual phrasing ('handle more users') to precise engineering concepts ('horizontal scalability').`;
        } else {
          improved = `${topicObj.text} provides a clear structural framework that reduces operational complexity and improves efficiency.`;
          reason = `Provides precise technical vocabulary instead of vague generalities.`;
        }

        alternatives.push({ original: s, improved, reason });
        break;
      }
    }

    // 2. Look for sentence with fillers or repetition
    for (let i = 0; i < sentences.length; i++) {
      if (usedIndices.has(i)) continue;
      const s = sentences[i];
      const lower = s.toLowerCase();

      if (lower.includes('like') || lower.includes('basically') || lower.includes('actually') || lower.includes('um') || lower.includes('uh')) {
        // Strip filler words cleanly from user's actual sentence
        let cleaned = s
          .replace(/\b(um|uh|basically|actually|you know|i mean|kind of|sort of)\b/gi, '')
          .replace(/,\s*,/g, ',')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleaned.length > 5 && cleaned !== s) {
          usedIndices.add(i);
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          alternatives.push({
            original: s,
            improved: cleaned,
            reason: `Eliminates verbal fillers ('basically', 'like', 'um') to make your spoken sentence crisp and authoritative while preserving your exact meaning.`
          });
          break;
        }
      }
    }

    // 3. Look for sentence lacking causal connector ("because", "since", "so that")
    for (let i = 0; i < sentences.length; i++) {
      if (usedIndices.has(i)) continue;
      const s = sentences[i];
      const lower = s.toLowerCase();

      if (s.split(/\s+/).length > 6 && !lower.includes('because') && !lower.includes('since') && !lower.includes('due to') && !lower.includes('therefore')) {
        usedIndices.add(i);

        const improved = `${s.replace(/[.!?]$/, '')}, because this directly impacts system reliability and performance.`;
        alternatives.push({
          original: s,
          improved,
          reason: `Adds an explicit causal clause ('because...') to explain the underlying technical justification for your statement.`
        });
        break;
      }
    }

    // Fallback if less than 2 alternatives were generated
    if (alternatives.length === 0 && sentences.length > 0) {
      const first = sentences[0];
      alternatives.push({
        original: first,
        improved: `In evaluating ${topicObj.text}, the primary objective is to maintain structural clarity while addressing core requirements.`,
        reason: `Refines your opening statement to immediately frame the topic with professional clarity.`
      });
    }

    return alternatives;
  },

  generateVocabularyUpgrades(lowerText, domainData, topicObj) {
    const upgrades = [];
    const maps = domainData.vocabMap || [];

    maps.forEach(m => {
      m.casual.forEach(c => {
        if (lowerText.includes(c) && upgrades.length < 3) {
          upgrades.push({
            casual: c,
            recommended: m.replacement,
            def: m.def
          });
        }
      });
    });

    // Fallback topic-relevant terms if user speech didn't match casual patterns directly
    if (upgrades.length < 2) {
      const topConcepts = domainData.concepts.slice(0, 3);
      topConcepts.forEach(c => {
        if (!lowerText.includes(c) && upgrades.length < 3) {
          upgrades.push({
            casual: `generic description of ${topicObj.text}`,
            recommended: c,
            def: `Key domain concept in ${topicObj.category} to elevate technical precision.`
          });
        }
      });
    }

    return upgrades;
  },

  generateGroundedStrengths(sentences, sentenceAnalysis, foundConcepts, framework, structureResult, wordCount) {
    const strengths = [];

    if (sentenceAnalysis.claimQuote) {
      strengths.push(`Stated a clear core definition/position: "${sentenceAnalysis.claimQuote.trim()}"`);
    } else if (sentences[0]) {
      strengths.push(`Directly addressed the topic in your opening statement: "${sentences[0].trim()}"`);
    }

    if (foundConcepts.length > 0) {
      strengths.push(`Incorporated key domain concepts (${foundConcepts.slice(0, 3).join(', ')}).`);
    }

    if (sentenceAnalysis.reasonQuote) {
      strengths.push(`Supported your point with clear causal reasoning: "${sentenceAnalysis.reasonQuote.trim()}"`);
    }

    if (sentenceAnalysis.exampleQuote) {
      strengths.push(`Provided a concrete illustration/example: "${sentenceAnalysis.exampleQuote.trim()}"`);
    }

    if (structureResult.matchedSteps.length >= 2) {
      strengths.push(`Successfully structured your response following ${framework.name} (${structureResult.matchedSteps.join(', ')}).`);
    }

    if (strengths.length < 2) {
      strengths.push(`Maintained continuous speaking flow with ${wordCount} total words.`);
    }

    return strengths;
  },

  generateGroundedImprovements(topicObj, missingConcepts, structureResult, fillerResult, sentenceAnalysis, wordCount) {
    const improvements = [];

    if (missingConcepts.length > 0) {
      improvements.push(`Content Coverage: Your answer would be stronger by explicitly mentioning ${missingConcepts.slice(0, 2).join(' and ')} in relation to ${topicObj.text}.`);
    }

    if (structureResult.missingSteps.length > 0) {
      improvements.push(`Structure Gap: Include the missing ${structureResult.missingSteps.join(' and ')} component to complete your ${structureResult.matchedSteps.length > 0 ? 'framework' : 'response structure'}.`);
    }

    if (fillerResult.totalCount >= 3) {
      const topFillers = Object.keys(fillerResult.breakdown).join(', ');
      improvements.push(`Speaking Habits: Detected ${fillerResult.totalCount} filler words/stalling phrases (${topFillers}). Replace these with silent pauses to sound more composed.`);
    }

    if (sentenceAnalysis.vagueSentences.length > 0) {
      improvements.push(`Language Precision: Replace vague phrasing in "${sentenceAnalysis.vagueSentences[0].text.trim()}" with concrete technical terms.`);
    }

    if (wordCount < 30) {
      improvements.push(`Elaboration: Your response was brief (${wordCount} words). Expand on cause and effect to provide a complete explanation.`);
    }

    return improvements;
  },

  determineFrameworkRecommendation(currentFrameworkId, structureResult, topicObj) {
    if (structureResult.missingSteps.includes('Reason') || structureResult.missingSteps.includes('Example')) {
      return {
        id: 'prep',
        name: 'PREP (Point → Reason → Example → Point)',
        reason: 'Your response needed stronger evidence and causal links. PREP will help you structure your main point followed immediately by a reason and example.'
      };
    }

    if (topicObj.difficulty === 'HARD' || topicObj.category === 'Technology' || topicObj.category === 'Software Engineering') {
      return {
        id: 'pcs',
        name: 'Problem → Cause → Solution',
        reason: 'This technical topic is well suited for diagnostic structure: identifying the problem, explaining the root cause, and presenting your solution.'
      };
    }

    return {
      id: 'cer',
      name: 'CER (Claim → Evidence → Reasoning)',
      reason: 'Use Claim → Evidence → Reasoning to back your statements with empirical data and analytical proof.'
    };
  },

  generateOneNextAction(topicObj, missingConcepts, frameworkRec, fillerResult) {
    let action = `Next attempt: Speak on "${topicObj.text}" for 60 seconds using the ${frameworkRec.name} framework.`;
    
    if (missingConcepts.length > 0) {
      action += ` Make sure to explicitly incorporate ${missingConcepts[0]}.`;
    } else if (fillerResult.totalCount > 3) {
      action += ` Focus on pausing silently whenever you feel tempted to say "${Object.keys(fillerResult.breakdown)[0] || 'um'}".`;
    }

    return action;
  },

  generateExecutiveSummary(topicObj, foundConcepts, missingConcepts, structureResult, fillerResult) {
    let summary = `You addressed "${topicObj.text}" `;
    
    if (foundConcepts.length > 0) {
      summary += `with good awareness of ${foundConcepts.slice(0, 3).join(', ')}. `;
    } else {
      summary += `with a general overview. `;
    }

    if (missingConcepts.length > 0) {
      summary += `Your answer can be significantly improved by adding details on ${missingConcepts.slice(0, 2).join(' and ')}`;
    }

    if (structureResult.missingSteps.length > 0) {
      summary += ` and following a complete ${structureResult.matchedSteps.length > 0 ? 'structure' : 'PREP framework'}.`;
    } else {
      summary += ` with strong structural organization.`;
    }

    return summary;
  },

  generateEmptyAnalysis(topicObj, frameworkId) {
    return {
      score: 65,
      wordCount: 0,
      wpm: 0,
      fillerWordsCount: 0,
      fillerBreakdown: {},
      frameworkName: (typeof FluentFrameworks !== 'undefined' && FluentFrameworks.getById) ? FluentFrameworks.getById(frameworkId).name : 'PREP',
      structureFound: [],
      summary: `No speech audio detected. Speak directly into your microphone about ${topicObj.text}.`,
      strengths: ['Started a recording session.'],
      improvements: ['Ensure your microphone is enabled and speak clearly into the device.'],
      contentAnalysis: { explained: [], missing: ['Core definition', 'Technical explanation'], clarificationNeeded: [] },
      betterWayToSayIt: {
        original: "No speech detected.",
        improved: `Start speaking directly about ${topicObj.text} using the PREP structure.`,
        reason: "Clear articulation requires active speech input."
      },
      alternatives: [
        {
          original: "No speech detected.",
          improved: `Start speaking directly about ${topicObj.text} using the PREP structure.`,
          reason: "Clear articulation requires active speech input."
        }
      ],
      vocabularyOpportunities: [],
      speakingHabits: { fillersCount: 0, fillerBreakdown: {}, repetition: { repeatedWords: [] }, wpmStatus: 'N/A' },
      frameworkRecommendation: { id: 'prep', name: 'PREP', reason: 'Start with PREP to build structured speaking confidence.' },
      nextAction: `Next attempt: Speak for 45 seconds about ${topicObj.text} using PREP.`
    };
  }
};

if (typeof window !== 'undefined') {
  window.FluentAnalyzer = FluentAnalyzer;
}
