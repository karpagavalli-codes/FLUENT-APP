/**
 * Test suite for FLUENT Analyzer (Cases A-F from Section 15 of User Request)
 */
const fs = require('fs');
const path = require('path');

global.window = {};
global.FluentFrameworks = {
  getById(id) {
    return {
      id: id,
      name: id === 'prep' ? 'PREP (Point → Reason → Example → Point)' : 'Problem → Cause → Solution'
    };
  }
};

const analyzerCode = fs.readFileSync(path.join(__dirname, '../js/analyzer.js'), 'utf8');
eval(analyzerCode);

const FluentAnalyzer = global.window.FluentAnalyzer;

const testCases = [
  {
    caseId: 'A. Off-Topic Response',
    topic: { text: 'What is inference?', category: 'AI & Machine Learning', difficulty: 'INTERMEDIATE' },
    transcript: 'Yesterday I went to college, met my friends, attended class, and came home.',
    duration: 30
  },
  {
    caseId: 'B. Short Relevant Response',
    topic: { text: 'Why is Python popular?', category: 'Software Engineering', difficulty: 'EASY' },
    transcript: 'Python is useful because it has many libraries.',
    duration: 25
  },
  {
    caseId: 'C. Response with Fillers & Repetition',
    topic: { text: 'What is Artificial Intelligence?', category: 'AI & Machine Learning', difficulty: 'EASY' },
    transcript: 'AI is, like, basically everywhere, and, um, you know, AI learns from data and basically does things.',
    duration: 35
  },
  {
    caseId: 'D. Relevant Ideas Badly Ordered',
    topic: { text: 'How should a startup raise capital?', category: 'Startups', difficulty: 'INTERMEDIATE' },
    transcript: 'We should raise venture capital. But bootstrapping gives full control. Also we need product market fit first.',
    duration: 40
  },
  {
    caseId: 'E. Grammar & Natural Phrasing Fixes',
    topic: { text: 'What are your plans for tomorrow?', category: 'General Knowledge', difficulty: 'EASY' },
    transcript: 'I am going to wake tomorrow and go college.',
    duration: 20
  },
  {
    caseId: 'F. Hard Question Lacking Example/Counterpoint',
    topic: { text: 'Should autonomous AI agents be granted executive decision authority in financial trading?', category: 'AI & Machine Learning', difficulty: 'HARD' },
    transcript: 'I believe AI agents should have execution authority because they can trade faster than humans.',
    duration: 45
  }
];

console.log('====================================================');
console.log('RUNNING FLUENT COACH ANALYZER TEST SUITE (CASES A-F)');
console.log('====================================================\n');

testCases.forEach((tc) => {
  console.log(`--- CASE: ${tc.caseId} ---`);
  console.log(`Topic: "${tc.topic.text}"`);
  console.log(`Transcript: "${tc.transcript}"`);

  const result = FluentAnalyzer.analyzeSpeech(tc.transcript, tc.topic, 'prep', tc.duration);

  console.log(`Relevance: ${result.topicRelevance.status} (${result.topicRelevance.explanation})`);
  console.log(`Score: ${result.score}/100 | WPM: ${result.wpm} | Fillers: ${result.fillerWordsCount}`);
  console.log(`WHAT YOU DID WELL:`, result.whatYouDidWell);
  console.log(`WHAT TO IMPROVE:`, result.whatToImprove);
  console.log(`SPEECH STRUCTURE:`);
  console.log(`  Current: ${result.speechStructure.currentStructure}`);
  console.log(`  Recommended: ${result.speechStructure.recommendedStructure}`);
  console.log(`  Tip: ${result.speechStructure.practicalTip}`);
  console.log(`BETTER WAY TO SAY IT:`);
  result.betterWayToSayIt.forEach(alt => {
    console.log(`  - YOU SAID: "${alt.original}"`);
    console.log(`    CLEARER: "${alt.improved}"`);
    console.log(`    WHY: ${alt.why}`);
  });
  console.log(`TARGET CAREER VOCABULARY: ${result.targetCareerVocabulary.message}`, result.targetCareerVocabulary.suggestions);
  console.log(`NEXT PRACTICE ACTION: ${result.nextAction}`);
  console.log('\n');
});
