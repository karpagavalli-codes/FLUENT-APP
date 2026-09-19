/**
 * Test suite for FLUENT Advanced Analyzer (8 distinct speech test cases)
 */
const fs = require('fs');
const path = require('path');

// Mock window & FluentFrameworks for Node environment
global.window = {};
global.FluentFrameworks = {
  getById(id) {
    return {
      id: id,
      name: id === 'prep' ? 'PREP (Point → Reason → Example → Point)' : 'Problem → Cause → Solution',
      steps: [{ label: 'Point' }, { label: 'Reason' }, { label: 'Example' }, { label: 'Point' }]
    };
  }
};

// Read analyzer.js code
const analyzerCode = fs.readFileSync(path.join(__dirname, '../js/analyzer.js'), 'utf8');
eval(analyzerCode);

const FluentAnalyzer = global.window.FluentAnalyzer;

const testCases = [
  {
    name: '1. Technically Strong Answer',
    topic: { text: 'What is Docker?', category: 'Technology', difficulty: 'INTERMEDIATE' },
    transcript: 'Docker is a platform for containerization. It packages software and its dependencies into lightweight isolated containers. For example, a developer can run a Python app with PostgreSQL on any machine without version conflicts. This allows teams to achieve high environment consistency and faster CI CD deployments.',
    duration: 45
  },
  {
    name: '2. Technically Weak Answer',
    topic: { text: 'What is an API?', category: 'Technology', difficulty: 'EASY' },
    transcript: 'API is useful and it does many things. It makes applications good and helps computer programs do stuff together.',
    duration: 30
  },
  {
    name: '3. Grammatically Weak Answer',
    topic: { text: 'How do microservices work?', category: 'Software Engineering', difficulty: 'INTERMEDIATE' },
    transcript: 'Microservices is when you split application into small services. They talks over network with REST API. But if one service down, it can affect other service if not design carefully.',
    duration: 40
  },
  {
    name: '4. Highly Repetitive Answer',
    topic: { text: 'Why is CI/CD important?', category: 'Software Engineering', difficulty: 'INTERMEDIATE' },
    transcript: 'CI CD is basically important because CI CD automates deployment. Basically when you use CI CD, CI CD runs tests automatically and CI CD deploys code basically every day.',
    duration: 45
  },
  {
    name: '5. Answer with Many Fillers',
    topic: { text: 'What is Cloud Computing?', category: 'Technology', difficulty: 'EASY' },
    transcript: 'Cloud computing is, um, like basically when you store your data, uh, on servers over the internet, you know, instead of your local computer, so like actually it gives flexibility.',
    duration: 45
  },
  {
    name: '6. Well-Structured PREP Answer',
    topic: { text: 'Why should software teams practice code reviews?', category: 'Software Engineering', difficulty: 'INTERMEDIATE' },
    transcript: 'My main point is that code reviews drastically improve software quality. The reason is because peer reviews detect architectural flaws and edge case bugs before code reaches production. For example, in our last sprint, a code review identified an unhandled database exception. In summary, regular code reviews build stronger code quality and shared team knowledge.',
    duration: 60
  },
  {
    name: '7. Unstructured Answer',
    topic: { text: 'What is Artificial Intelligence?', category: 'AI & Machine Learning', difficulty: 'EASY' },
    transcript: 'AI is everywhere now. Tesla uses it for driving. ChatGPT is an example of AI. It learns from data.',
    duration: 35
  },
  {
    name: '8. Hard Question with Strong Reasoning',
    topic: { text: 'Should autonomous AI agents be granted executive decision authority in financial trading?', category: 'AI & Machine Learning', difficulty: 'HARD' },
    transcript: 'I believe autonomous AI agents should be granted limited execution authority in financial trading, provided strict risk constraints are enforced. The primary reason is that AI models can execute low-latency arbitrage across global markets far faster than human traders. For instance, high-frequency trading algorithms currently execute market orders in microseconds. However, uncapped authority poses systemic risk during flash crashes. Therefore, human oversight must remain as a circuit breaker.',
    duration: 75
  }
];

console.log('====================================================');
console.log('RUNNING FLUENT ANALYZER 8 TEST CASES');
console.log('====================================================\n');

testCases.forEach((tc, idx) => {
  console.log(`--- TEST CASE ${idx + 1}: ${tc.name} ---`);
  console.log(`Topic: ${tc.topic.text}`);
  console.log(`Transcript: "${tc.transcript}"`);

  const result = FluentAnalyzer.analyzeSpeech(tc.transcript, tc.topic, 'prep', tc.duration);

  console.log(`Score: ${result.score}/100 | WPM: ${result.wpm} | Fillers: ${result.fillerWordsCount}`);
  console.log(`Executive Summary: ${result.summary}`);
  console.log(`Strengths:`, result.strengths);
  console.log(`Improvements:`, result.improvements);
  console.log(`Alternatives ("You Said -> Try Saying -> Why"):`);
  result.alternatives.forEach(alt => {
    console.log(`  - YOU SAID: "${alt.original}"`);
    console.log(`    TRY SAYING: "${alt.improved}"`);
    console.log(`    WHY: ${alt.reason}`);
  });
  console.log(`Vocabulary Upgrades:`, result.vocabularyOpportunities.map(v => `${v.casual} -> ${v.recommended}`));
  console.log(`Framework Rec: ${result.frameworkRecommendation.name} (${result.frameworkRecommendation.reason})`);
  console.log(`ONE NEXT ACTION: ${result.nextAction}`);
  console.log('\n');
});
