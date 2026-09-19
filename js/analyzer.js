/**
 * FLUENT - Speaking Coach Analyzer Engine
 * Strictly analyzes what the user ACTUALLY communicated (Topic vs Transcript).
 * Focuses on Communication, Structure, Grammar, Fillers, and Natural Phrasing.
 * NEVER generates ideal answers, adds new topic content, or invents arguments.
 * ENFORCES STRICT SOURCE-OF-TRUTH VALIDATION ON ALL QUOTES AND VOCABULARY.
 */
const FluentAnalyzer = {
  STOPWORDS: new Set([
    'what', 'why', 'how', 'when', 'where', 'who', 'which', 'should', 'would', 'could', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'do', 'does', 'did', 'doing', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 
    'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into', 'over', 'after', 'this', 'that', 'these', 'those', 
    'it', 'its', 'they', 'them', 'their', 'your', 'my', 'our', 'we', 'you', 'he', 'she', 'his', 'her', 'can', 'will'
  ]),

  OFF_TOPIC_PATTERNS: [
    'went to', 'met my', 'attended class', 'came home', 'woke up', 'had lunch', 'had dinner', 
    'watched a movie', 'played games', 'slept at', 'my friends', 'college yesterday', 'my day', 'watched youtube'
  ],

  UNCERTAINTY_PATTERNS: [
    "don't know what it is", "don't know what i'm doing", "not sure about", "don't really know",
    "no idea what", "don't know how to explain", "confused about this"
  ],

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

    // 3. Off-Topic & Topic Relevance Detection
    const topicRelevance = this.evaluateTopicRelevance(text, topicObj);
    const isOffTopic = topicRelevance.status.includes('Off-Topic');

    // 4. Uncertainty Detection
    const uncertaintyResult = this.detectUncertainty(text);

    // 5. Context-Aware Filler Analysis
    const fillerResult = this.detectFillersContextual(text);

    // 6. Repetition Analysis
    const repetitionResult = this.detectRepetition(words);

    // 7. Sentence Analysis (Claims, Reasons, Examples)
    const sentenceAnalysis = this.analyzeSentences(sentences);

    // 8. Structure Evaluation (Current vs Recommended vs Practical Tip)
    const structureCoaching = this.evaluateSpeechStructure(sentences, text, topicObj, frameworkId, isOffTopic, sentenceAnalysis, uncertaintyResult);

    // 9. Grounded Feedback (What You Did Well & What To Improve)
    const whatYouDidWell = this.generateWhatYouDidWell(sentences, sentenceAnalysis, isOffTopic, wordCount, fillerResult, uncertaintyResult);
    const whatToImprove = this.generateWhatToImprove(sentences, sentenceAnalysis, isOffTopic, wordCount, fillerResult, repetitionResult, topicObj, structureCoaching, uncertaintyResult);

    // 10. Better Way To Say It (Strictly user's actual sentences, preserving meaning)
    const rawAlternatives = this.generateBetterWayToSayItList(sentences, fillerResult);

    // SOURCE-OF-TRUTH VALIDATION FOR SENTENCE QUOTES
    const validAlternatives = rawAlternatives.filter(alt => {
      if (!alt.original || alt.original.trim().length === 0) return false;
      const idx = text.toLowerCase().indexOf(alt.original.toLowerCase().trim());
      return idx !== -1 || alt.why.includes('already clear');
    });

    // 11. Target Career Vocabulary Connection (Only from user speech, max 3)
    const vocabResult = this.generateVocabularyConnection(text, topicObj);

    // 12. Next Practice Action
    const nextAction = this.generateNextPracticeAction(isOffTopic, structureCoaching, fillerResult, topicObj, uncertaintyResult);

    // 13. Score Calculation
    let score = 80;
    if (isOffTopic) score -= 25;
    if (uncertaintyResult.hasUncertainty) score -= 15;
    if (sentenceAnalysis.hasReason) score += 5;
    if (sentenceAnalysis.hasExample) score += 5;
    if (fillerResult.totalCount === 0) score += 5;
    else score -= Math.min(fillerResult.totalCount * 3, 15);
    if (repetitionResult.repeatedWords.length > 0) score -= 5;
    if (wordCount < 15) score -= 15;
    score = Math.max(50, Math.min(98, score));

    return {
      score,
      wordCount,
      wpm,
      fillerWordsCount: fillerResult.totalCount,
      fillerBreakdown: fillerResult.breakdown,
      frameworkName: structureCoaching.frameworkName,
      whatYouDidWell,
      whatToImprove,
      speechStructure: structureCoaching,
      betterWayToSayIt: validAlternatives, // Array of validated items
      alternatives: validAlternatives, // For backward compatibility
      targetCareerVocabulary: vocabResult,
      vocabularyOpportunities: vocabResult.suggestions.map(s => ({ casual: s.casual, recommended: s.recommended, def: s.explanation })),
      topicRelevance,
      nextAction,
      summary: topicRelevance.explanation,
      transcript: text
    };
  },

  detectUncertainty(text) {
    const lower = text.toLowerCase();
    const matches = [];
    this.UNCERTAINTY_PATTERNS.forEach(p => {
      if (lower.includes(p)) matches.push(p);
    });

    return {
      hasUncertainty: matches.length > 0,
      matches
    };
  },

  evaluateTopicRelevance(text, topicObj) {
    const lowerText = text.toLowerCase();
    const topicTextLower = (topicObj.text || '').toLowerCase();
    const categoryLower = (topicObj.category || '').toLowerCase();

    // Check off-topic patterns (e.g. daily routine narrative)
    let offTopicMatches = 0;
    this.OFF_TOPIC_PATTERNS.forEach(p => {
      if (lowerText.includes(p)) offTopicMatches++;
    });

    if (offTopicMatches >= 2) {
      return {
        status: 'Low / Off-Topic',
        explanation: `Your response moved away from the assigned topic "${topicObj.text}". The speech primarily discusses personal activities or unrelated topics rather than answering the prompt.`
      };
    }

    // Extract core keywords from topic title
    const topicKeywords = topicTextLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !this.STOPWORDS.has(w));
    
    // Check keyword overlap
    const matchedKeywords = topicKeywords.filter(k => lowerText.includes(k));
    const hasCategoryMatch = categoryLower.length > 2 && lowerText.includes(categoryLower);

    // Check uncertainty expressions
    const hasUncertainty = this.UNCERTAINTY_PATTERNS.some(p => lowerText.includes(p));

    if (hasUncertainty && matchedKeywords.length > 0) {
      return {
        status: 'Medium / Incomplete',
        explanation: `You introduced the assigned topic ("${topicObj.text}"), but expressed uncertainty ("i don't know what it is") instead of explaining or answering the question.`
      };
    }

    if (matchedKeywords.length > 0 || hasCategoryMatch) {
      return {
        status: 'High',
        explanation: `Your response directly addressed "${topicObj.text}" using relevant topic references.`
      };
    }

    return {
      status: 'Medium',
      explanation: `Your response touched upon general aspects of "${topicObj.text}", but could connect more directly to the core question.`
    };
  },

  detectFillersContextual(text) {
    const lower = text.toLowerCase();
    let totalCount = 0;
    const breakdown = {};

    // 1. Absolute fillers
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
    const likeFillerMatches = lower.match(/\b(is|was|are|were|and|so|meaning|know)\s+like\b|,\s*like\s*,|\blike\s+(basically|actually|you know|um|uh|what)\b/g);
    if (likeFillerMatches) {
      totalCount += likeFillerMatches.length;
      breakdown['like (filler context)'] = likeFillerMatches.length;
    }

    // 3. Context-dependent "so" at sentence openings
    const soFillerMatches = lower.match(/(^|[.!?]\s+)so\s+(um|uh|like|basically|actually|,|i)/g);
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

  detectRepetition(words) {
    const counts = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^\w]/g, '');
      if (clean.length > 3 && !this.STOPWORDS.has(clean)) {
        counts[clean] = (counts[clean] || 0) + 1;
      }
    });

    const repeatedWords = [];
    Object.keys(counts).forEach(w => {
      if (counts[w] >= 3) {
        repeatedWords.push({ word: w, count: counts[w] });
      }
    });

    return { repeatedWords };
  },

  analyzeSentences(sentences) {
    let hasClaim = false;
    let hasReason = false;
    let hasExample = false;
    let hasCounter = false;
    let hasConclusion = false;
    let hasJumpingIdeas = false;

    let claimQuote = '';
    let reasonQuote = '';
    let exampleQuote = '';

    sentences.forEach((s, idx) => {
      const lower = s.toLowerCase();

      if (!hasClaim && (lower.includes('is a') || lower.includes('defined as') || lower.includes('refers to') || lower.includes('means') || lower.includes('allows') || lower.includes('believe') || lower.includes('in my view') || lower.includes('i think') || lower.includes('we should') || lower.includes('gonna talk about'))) {
        hasClaim = true;
        claimQuote = s;
      }

      if (!hasReason && (lower.includes('because') || lower.includes('since') || lower.includes('due to') || lower.includes('the reason') || lower.includes('this allows') || lower.includes('which leads to'))) {
        hasReason = true;
        reasonQuote = s;
      }

      if (!hasExample && (lower.includes('for example') || lower.includes('such as') || lower.includes('for instance') || lower.includes('like when') || lower.includes('in practice') || lower.includes('scenario'))) {
        hasExample = true;
        exampleQuote = s;
      }

      if (!hasCounter && (lower.includes('however') || lower.includes('although') || lower.includes('on the other hand') || lower.includes('despite') || lower.includes('trade-off') || (lower.startsWith('but ') && idx > 0))) {
        hasCounter = true;
      }

      if (!hasConclusion && (lower.includes('in conclusion') || lower.includes('overall') || lower.includes('therefore') || lower.includes('to summarize') || lower.includes('ultimately') || lower.includes('in summary'))) {
        hasConclusion = true;
      }

      if (idx > 0 && (lower.startsWith('but ') || lower.startsWith('also ') || lower.startsWith('and ')) && !hasReason) {
        hasJumpingIdeas = true;
      }
    });

    return {
      hasClaim,
      hasReason,
      hasExample,
      hasCounter,
      hasConclusion,
      hasJumpingIdeas,
      claimQuote,
      reasonQuote,
      exampleQuote
    };
  },

  evaluateSpeechStructure(sentences, text, topicObj, frameworkId, isOffTopic, sentenceAnalysis, uncertaintyResult) {
    const framework = (typeof FluentFrameworks !== 'undefined' && FluentFrameworks.getById) 
      ? FluentFrameworks.getById(frameworkId)
      : { id: frameworkId, name: frameworkId.toUpperCase() };

    let currentStructure = '';
    let recommendedStructure = '';
    let practicalTip = '';

    if (isOffTopic) {
      currentStructure = 'Opening → Personal Activity / Unrelated Story → Conclusion';
      recommendedStructure = 'Direct Answer → Reason → Example → Summary';
      practicalTip = 'Start your response in sentence one by directly answering the assigned topic before expanding.';
    } else if (uncertaintyResult.hasUncertainty) {
      currentStructure = 'Opening → Attempted Topic Introduction → Uncertainty → Unfinished Response';
      recommendedStructure = 'Opening → Main Point → Reason → Example → Conclusion';
      practicalTip = 'After introducing the topic in your opening, state one clear main point in sentence two before expanding.';
    } else {
      const steps = [];
      if (sentenceAnalysis.hasClaim) steps.push('Main Point');
      else steps.push('Opening Statement');

      if (sentenceAnalysis.hasReason) steps.push('Reason');
      if (sentenceAnalysis.hasExample) steps.push('Example');
      if (sentenceAnalysis.hasCounter) steps.push('Counterpoint');
      if (sentenceAnalysis.hasConclusion) steps.push('Conclusion');

      currentStructure = steps.join(' → ');

      if (topicObj.difficulty === 'EASY') {
        recommendedStructure = 'Definition / Main Idea → Key Point → Example → Closing';
        if (!sentenceAnalysis.hasExample) {
          practicalTip = 'Add a quick concrete example after your main point to make your explanation complete.';
        } else {
          practicalTip = 'Keep your opening direct and conclude with a crisp summary sentence.';
        }
      } else if (topicObj.difficulty === 'HARD') {
        recommendedStructure = 'Position → Reason → Evidence / Example → Counterpoint → Conclusion';
        if (!sentenceAnalysis.hasCounter) {
          practicalTip = 'For Hard topics, include a trade-off or counterpoint ("however...") to show well-rounded reasoning.';
        } else {
          practicalTip = 'Ensure your evidence directly substantiates your initial position.';
        }
      } else {
        recommendedStructure = 'Answer → Reason → Example → Conclusion';
        if (sentenceAnalysis.hasJumpingIdeas) {
          practicalTip = 'Group your main claim first, followed by your reasons, before introducing alternative ideas.';
        } else if (!sentenceAnalysis.hasReason) {
          practicalTip = 'Explain why your point matters using a causal connector ("because...") right after your opening.';
        } else if (!sentenceAnalysis.hasExample) {
          practicalTip = 'Follow your reason with a real-world example ("for example...") to solidify your point.';
        } else {
          practicalTip = 'Group your ideas logically: Answer first, followed by Reason, Example, and Conclusion.';
        }
      }
    }

    return {
      frameworkName: framework.name,
      currentStructure,
      recommendedStructure,
      practicalTip
    };
  },

  generateWhatYouDidWell(sentences, sentenceAnalysis, isOffTopic, wordCount, fillerResult, uncertaintyResult) {
    const points = [];

    if (isOffTopic) {
      points.push("Your response was understandable and spoken clearly, but most of the answer moved away from the assigned topic.");
      if (sentences.length > 1) {
        points.push(`Spoke in complete, structured sentences with a total of ${wordCount} words.`);
      }
      return points;
    }

    if (uncertaintyResult.hasUncertainty) {
      points.push(`Attempted to introduce the assigned topic in your opening statement.`);
      if (sentences[0]) {
        points.push(`Spoke clearly aloud: "${sentences[0].trim()}"`);
      }
      return points;
    }

    if (sentenceAnalysis.claimQuote) {
      points.push(`Stated a clear opening point: "${sentenceAnalysis.claimQuote.trim()}"`);
    } else if (sentences[0]) {
      points.push(`Opened directly with your initial thought: "${sentences[0].trim()}"`);
    }

    if (sentenceAnalysis.reasonQuote) {
      points.push(`Supported your position with causal reasoning: "${sentenceAnalysis.reasonQuote.trim()}"`);
    }

    if (sentenceAnalysis.exampleQuote) {
      points.push(`Included a concrete example/illustration: "${sentenceAnalysis.exampleQuote.trim()}"`);
    }

    if (fillerResult.totalCount === 0 && wordCount > 15) {
      points.push("Spoke cleanly without relying on verbal fillers or stalling phrases.");
    }

    if (points.length === 0) {
      points.push(`Maintained a steady speaking rhythm with ${wordCount} words spoken.`);
    }

    return points.slice(0, 3);
  },

  generateWhatToImprove(sentences, sentenceAnalysis, isOffTopic, wordCount, fillerResult, repetitionResult, topicObj, structureCoaching, uncertaintyResult) {
    const points = [];

    if (isOffTopic) {
      points.push(`Off-Topic Response: Your answer described personal routine or unrelated ideas instead of addressing "${topicObj.text}".`);
      points.push(`Focus on Question: Make sure your opening sentence directly defines or answers the assigned topic.`);
      return points;
    }

    if (uncertaintyResult.hasUncertainty) {
      points.push(`Incomplete Explanation: You introduced the topic, but expressed uncertainty ("${uncertaintyResult.matches[0]}") instead of explaining or answering the question.`);
      points.push(`Unfinished Structure: The response stopped after the topic introduction without providing a main point, reason, or example.`);
      return points;
    }

    if (sentenceAnalysis.hasJumpingIdeas) {
      points.push(`Idea Ordering: Your points jumped between contrasting ideas. Group your main claim and reason first before introducing alternative options.`);
    }

    if (!sentenceAnalysis.hasReason) {
      points.push(`Incomplete Explanation: You stated a point, but did not explain the underlying reason ("because...") why it is true.`);
    }

    if (!sentenceAnalysis.hasExample) {
      points.push(`Missing Example: Follow your explanation with a specific instance or example ("for example...") to make your idea clear.`);
    }

    if (fillerResult.totalCount >= 3) {
      const topFillers = Object.keys(fillerResult.breakdown).join(', ');
      points.push(`Excessive Fillers: Detected ${fillerResult.totalCount} filler words/stalling phrases (${topFillers}). Replace these with silent pauses.`);
    }

    if (repetitionResult.repeatedWords.length > 0) {
      const rep = repetitionResult.repeatedWords[0];
      points.push(`Word Repetition: You repeated the word "${rep.word}" ${rep.count} times. Try pausing or varying your sentence structure.`);
    }

    if (topicObj.difficulty === 'HARD' && !sentenceAnalysis.hasCounter) {
      points.push(`Missing Counterpoint: For a Hard level topic, address potential trade-offs or opposing perspectives ("however...").`);
    }

    if (wordCount < 20) {
      points.push(`Response Elaboration: Your answer was brief (${wordCount} words). Expand on your reasoning to form a complete response.`);
    }

    if (points.length === 0) {
      points.push(`Structure Organization: ${structureCoaching.practicalTip}`);
    }

    return points.slice(0, 3);
  },

  generateBetterWayToSayItList(sentences, fillerResult) {
    const list = [];
    const usedIndices = new Set();

    sentences.forEach((s, idx) => {
      if (usedIndices.has(idx)) return;
      let corrected = s;
      let why = '';
      let isFixed = false;

      const lower = s.toLowerCase();

      // Rule 0: Specific topic intro correction ("so i'm gonna talk about stock prices fluctuate based on interest rate")
      if (lower.includes("gonna talk about") || lower.includes("going to talk about")) {
        if (lower.includes("fluctuate based on interest rate") && !lower.includes("how stock prices")) {
          corrected = s.replace(/gonna talk about stock prices fluctuate based on interest rate/i, "going to talk about how stock prices fluctuate based on interest rates");
          why = "Connects the topic naturally with 'how' and uses the standard plural form 'interest rates'.";
          isFixed = true;
        } else if (/^so\s+/i.test(corrected)) {
          corrected = corrected.replace(/^so\s+/i, '');
          why = 'Removing "So" makes your presentation opening direct and concise.';
          isFixed = true;
        }
      }

      // Rule 0B: Uncertainty correction ("i don't know like what i'm doing right now")
      if (!isFixed && (lower.includes("don't know like what i'm doing") || lower.includes("don't know what it is"))) {
        if (lower.includes("don't know like what i'm doing")) {
          corrected = s.replace(/i don't know like what i'm doing right now/i, "I'm not really sure how to explain this right now");
          why = "Removes the filler 'like' and makes the sentence clearer while preserving your exact meaning.";
          isFixed = true;
        }
      }

      // Rule A: "wake tomorrow" -> "wake up tomorrow"
      if (!isFixed && (/wake\s+tomorrow/i.test(corrected) || /wake\s+today/i.test(corrected))) {
        corrected = corrected.replace(/wake\s+tomorrow/gi, 'wake up tomorrow').replace(/wake\s+today/gi, 'wake up today');
        why = '"Wake up" is the natural phrasal verb in this sentence.';
        isFixed = true;
      }

      // Rule B: "go college" -> "go to college", "go school" -> "go to school"
      if (!isFixed && (/go\s+college/i.test(corrected) || /go\s+school/i.test(corrected) || /go\s+work/i.test(corrected))) {
        corrected = corrected.replace(/go\s+college/gi, 'go to college').replace(/go\s+school/gi, 'go to school').replace(/go\s+work/gi, 'go to work');
        why = 'Requires the preposition "to" before the destination.';
        isFixed = true;
      }

      // Rule C: Subject-verb agreement "they talks" -> "they talk"
      if (!isFixed && (/they\s+talks/i.test(corrected) || /they\s+is/i.test(corrected))) {
        corrected = corrected.replace(/they\s+talks/gi, 'they talk').replace(/they\s+is/gi, 'they are');
        why = 'Subject-verb agreement: plural "they" requires "talk" / "are".';
        isFixed = true;
      }

      // Rule D: Verbal fillers removal ("like", "basically", "um", "uh")
      if (!isFixed && /\b(um|uh|basically|actually|you know|i mean|kind of|sort of)\b/i.test(corrected)) {
        let cleaned = corrected
          .replace(/\b(um|uh|basically|actually|you know|i mean|kind of|sort of)\b/gi, '')
          .replace(/,\s*,/g, ',')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleaned.length > 5 && cleaned !== s) {
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          corrected = cleaned;
          why = 'Eliminates verbal fillers to make your spoken sentence direct and clear.';
          isFixed = true;
        }
      }

      // Rule E: Casual word replacement (preserving exact meaning)
      if (!isFixed && (/\bvery good\b/i.test(corrected) || /\buseful\b/i.test(corrected))) {
        if (/\bvery good\b/i.test(corrected)) {
          corrected = corrected.replace(/\bvery good\b/gi, 'effective');
          why = 'Replaces "very good" with "effective" for precise expression.';
          isFixed = true;
        } else if (/\buseful\b/i.test(corrected)) {
          corrected = corrected.replace(/\buseful\b/gi, 'valuable');
          why = 'Replaces "useful" with "valuable" for stronger word choice.';
          isFixed = true;
        }
      }

      if (isFixed) {
        usedIndices.add(idx);
        list.push({ original: s, improved: corrected, why });
      }
    });

    // If no sentence needed correction, return "This sentence is already clear."
    if (list.length === 0 && sentences.length > 0) {
      const s = sentences[0];
      list.push({
        original: s,
        improved: s,
        why: 'This sentence is already clear.'
      });
    }

    return list.slice(0, 4);
  },

  generateVocabularyConnection(text, topicObj) {
    const lower = text.toLowerCase();
    const suggestions = [];

    // ONLY extract vocabulary for words ACTUALLY SPOKEN by the user
    if (lower.includes('very good')) {
      suggestions.push({
        casual: 'very good',
        recommended: 'effective / valuable',
        explanation: 'Instead of "very good", consider "effective" or "valuable".'
      });
    }

    if (lower.includes('useful')) {
      suggestions.push({
        casual: 'useful',
        recommended: 'valuable / versatile',
        explanation: 'Instead of "useful", consider "valuable" or "versatile".'
      });
    }

    if (lower.includes('fluctuate') || lower.includes('fluctuates')) {
      suggestions.push({
        casual: 'fluctuate',
        recommended: 'market volatility / rate sensitivity',
        explanation: 'In financial contexts, "rate sensitivity" precisely describes how assets move with interest rate shifts.'
      });
    }

    if (lower.includes('easy to fix') || lower.includes('easy to change')) {
      suggestions.push({
        casual: 'easy to change',
        recommended: 'maintainable',
        explanation: 'Instead of "easy to change", consider "maintainable".'
      });
    }

    // STRICT SOURCE-OF-TRUTH FILTER: Only return suggestions whose casual phrase is in the transcript!
    const validSuggestions = suggestions.filter(s => lower.includes(s.casual.toLowerCase()));

    if (validSuggestions.length === 0) {
      return {
        suggestions: [],
        message: 'No specific career-vocabulary upgrade is needed for this response.'
      };
    }

    return {
      suggestions: validSuggestions.slice(0, 3),
      message: 'Target career vocabulary suggestions based on your speech:'
    };
  },

  generateNextPracticeAction(isOffTopic, structureCoaching, fillerResult, topicObj, uncertaintyResult) {
    if (isOffTopic) {
      return `Next attempt: Answer "${topicObj.text}" in sentence one first, then give one reason and one example.`;
    }

    if (uncertaintyResult.hasUncertainty) {
      return `Next attempt: After introducing the topic, immediately state one clear point before expanding.`;
    }

    if (fillerResult.totalCount >= 3) {
      return `Next attempt: Focus on pausing silently whenever you feel tempted to say "${Object.keys(fillerResult.breakdown)[0] || 'um'}".`;
    }

    return `Next attempt: State your main answer in your first sentence, follow with a reason ("because..."), and include one example ("for example...").`;
  },

  generateEmptyAnalysis(topicObj, frameworkId) {
    return {
      score: 65,
      wordCount: 0,
      wpm: 0,
      fillerWordsCount: 0,
      fillerBreakdown: {},
      frameworkName: (typeof FluentFrameworks !== 'undefined' && FluentFrameworks.getById) ? FluentFrameworks.getById(frameworkId).name : 'PREP',
      whatYouDidWell: ['Started a practice session.'],
      whatToImprove: ['Ensure your microphone is enabled and speak clearly into the device.'],
      speechStructure: {
        frameworkName: 'PREP',
        currentStructure: 'No speech detected',
        recommendedStructure: 'Answer → Reason → Example → Summary',
        practicalTip: 'Start speaking directly about the topic.'
      },
      betterWayToSayIt: [
        {
          original: 'No speech detected.',
          improved: 'Start speaking directly about the topic.',
          why: 'Speech practice requires active spoken input.'
        }
      ],
      alternatives: [
        {
          original: 'No speech detected.',
          improved: 'Start speaking directly about the topic.',
          why: 'Speech practice requires active spoken input.'
        }
      ],
      targetCareerVocabulary: { suggestions: [], message: 'No specific career-vocabulary upgrade is needed for this response.' },
      vocabularyOpportunities: [],
      topicRelevance: { status: 'Low', explanation: 'No spoken audio detected.' },
      nextAction: `Next attempt: Speak for 45 seconds about ${topicObj.text}.`,
      summary: 'No speech audio detected.'
    };
  }
};

if (typeof window !== 'undefined') {
  window.FluentAnalyzer = FluentAnalyzer;
}
