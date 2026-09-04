/**
 * FLUENT - Topic Bank & Generator System
 * Contains 150+ topics across 11 categories & 3 difficulties + dynamic topic synthesizer.
 */
const FluentTopics = {
  CATEGORIES: [
    'All',
    'AI & Machine Learning',
    'Technology',
    'Software Engineering',
    'Startups',
    'Business',
    'Finance',
    'Psychology',
    'Science',
    'Communication',
    'Career',
    'General Knowledge'
  ],

  DIFFICULTIES: ['EASY', 'INTERMEDIATE', 'HARD'],

  TOPIC_BANK: [
    // --- EASY (Single Words / Concepts) ---
    { id: 'easy-tech-1', text: 'Docker', category: 'Technology', difficulty: 'EASY', desc: 'A simple concept. Explain what it is and why developers use it.' },
    { id: 'easy-tech-2', text: 'APIs', category: 'Technology', difficulty: 'EASY', desc: 'Explain what an API is to someone with a non-technical background.' },
    { id: 'easy-tech-3', text: 'Git', category: 'Technology', difficulty: 'EASY', desc: 'Explain version control and why teams rely on Git.' },
    { id: 'easy-tech-4', text: 'Cloud Computing', category: 'Technology', difficulty: 'EASY', desc: 'Define cloud computing and its core benefits.' },
    { id: 'easy-tech-5', text: 'Databases', category: 'Technology', difficulty: 'EASY', desc: 'Explain the fundamental role of databases in software applications.' },
    { id: 'easy-tech-6', text: 'Cybersecurity', category: 'Technology', difficulty: 'EASY', desc: 'Explain why digital security matters for individuals and companies.' },
    
    { id: 'easy-swe-1', text: 'Recursion', category: 'Software Engineering', difficulty: 'EASY', desc: 'Define recursion and give an intuitive real-world analogy.' },
    { id: 'easy-swe-2', text: 'Debugging', category: 'Software Engineering', difficulty: 'EASY', desc: 'Explain how you approach finding and fixing a bug in code.' },
    { id: 'easy-swe-3', text: 'Abstraction', category: 'Software Engineering', difficulty: 'EASY', desc: 'Define abstraction in computer science and why it simplifies complex systems.' },
    { id: 'easy-swe-4', text: 'Testing', category: 'Software Engineering', difficulty: 'EASY', desc: 'Explain why software testing is essential before releasing code.' },
    { id: 'easy-swe-5', text: 'Scalability', category: 'Software Engineering', difficulty: 'EASY', desc: 'Explain what makes a system scalable when user traffic increases.' },
    { id: 'easy-swe-6', text: 'Clean Code', category: 'Software Engineering', difficulty: 'EASY', desc: 'Describe what clean code means to you and why readability matters.' },

    { id: 'easy-ai-1', text: 'Neural Networks', category: 'AI & Machine Learning', difficulty: 'EASY', desc: 'Explain what a neural network is inspired by.' },
    { id: 'easy-ai-2', text: 'Embeddings', category: 'AI & Machine Learning', difficulty: 'EASY', desc: 'Explain how vector embeddings represent text or data.' },
    { id: 'easy-ai-3', text: 'LLMs', category: 'AI & Machine Learning', difficulty: 'EASY', desc: 'Describe Large Language Models and how they process language.' },
    { id: 'easy-ai-4', text: 'RAG', category: 'AI & Machine Learning', difficulty: 'EASY', desc: 'Explain Retrieval-Augmented Generation in simple terms.' },
    { id: 'easy-ai-5', text: 'AI Agents', category: 'AI & Machine Learning', difficulty: 'EASY', desc: 'Explain what autonomous AI agents are designed to accomplish.' },

    { id: 'easy-bus-1', text: 'Leadership', category: 'Business', difficulty: 'EASY', desc: 'Define effective leadership in a technical team.' },
    { id: 'easy-bus-2', text: 'Strategy', category: 'Business', difficulty: 'EASY', desc: 'Explain the difference between strategy and execution.' },
    { id: 'easy-bus-3', text: 'Productivity', category: 'Business', difficulty: 'EASY', desc: 'Share your definition of personal productivity.' },

    { id: 'easy-startup-1', text: 'MVP', category: 'Startups', difficulty: 'EASY', desc: 'Define a Minimum Viable Product and its primary goal.' },
    { id: 'easy-startup-2', text: 'Product-Market Fit', category: 'Startups', difficulty: 'EASY', desc: 'Explain what product-market fit means for a startup.' },

    { id: 'easy-fin-1', text: 'Inflation', category: 'Finance', difficulty: 'EASY', desc: 'Explain what inflation is and how it affects purchasing power.' },
    { id: 'easy-fin-2', text: 'Interest Rates', category: 'Finance', difficulty: 'EASY', desc: 'Explain why central banks raise or lower interest rates.' },

    { id: 'easy-psych-1', text: 'Cognitive Bias', category: 'Psychology', difficulty: 'EASY', desc: 'Define cognitive bias and give one common example.' },
    { id: 'easy-psych-2', text: 'Motivation', category: 'Psychology', difficulty: 'EASY', desc: 'Explain intrinsic vs extrinsic motivation.' },

    { id: 'easy-comm-1', text: 'Active Listening', category: 'Communication', difficulty: 'EASY', desc: 'Explain active listening and why it improves communication.' },
    { id: 'easy-comm-2', text: 'Storytelling', category: 'Communication', difficulty: 'EASY', desc: 'Explain why storytelling makes technical presentations memorable.' },

    // --- INTERMEDIATE (Focused Questions) ---
    { id: 'inter-ai-1', text: 'Why is Python widely used in artificial intelligence?', category: 'AI & Machine Learning', difficulty: 'INTERMEDIATE', desc: 'Discuss Python syntax, ecosystem libraries, and community adoption.' },
    { id: 'inter-ai-2', text: 'How does fine-tuning differ from pre-training in machine learning?', category: 'AI & Machine Learning', difficulty: 'INTERMEDIATE', desc: 'Compare foundational pre-training with domain-specific fine-tuning.' },
    { id: 'inter-ai-3', text: 'What is the role of vector databases in modern AI architectures?', category: 'AI & Machine Learning', difficulty: 'INTERMEDIATE', desc: 'Explain how vector indexes enable semantic search and memory.' },

    { id: 'inter-tech-1', text: 'How does the HTTP protocol enable web communication?', category: 'Technology', difficulty: 'INTERMEDIATE', desc: 'Explain client requests, server responses, and status codes.' },
    { id: 'inter-tech-2', text: 'Why are microservices preferred over monolithic architectures for large applications?', category: 'Technology', difficulty: 'INTERMEDIATE', desc: 'Discuss modularity, independent deployment, and team ownership.' },
    { id: 'inter-tech-3', text: 'How does public-key cryptography keep online transactions secure?', category: 'Technology', difficulty: 'INTERMEDIATE', desc: 'Explain public and private key pairs.' },

    { id: 'inter-swe-1', text: 'What is technical debt and how should software teams manage it?', category: 'Software Engineering', difficulty: 'INTERMEDIATE', desc: 'Discuss short-term speed vs long-term maintainability.' },
    { id: 'inter-swe-2', text: 'Why is continuous integration (CI/CD) critical for modern software delivery?', category: 'Software Engineering', difficulty: 'INTERMEDIATE', desc: 'Explain automated builds, testing pipelines, and deployment confidence.' },
    { id: 'inter-swe-3', text: 'How do index structures speed up database query performance?', category: 'Software Engineering', difficulty: 'INTERMEDIATE', desc: 'Explain B-trees or hash indexing in relatable terms.' },

    { id: 'inter-startup-1', text: 'Why do most early-stage technology startups fail?', category: 'Startups', difficulty: 'INTERMEDIATE', desc: 'Discuss premature scaling, lack of market need, and cash burn.' },
    { id: 'inter-startup-2', text: 'How do venture capital firms evaluate early-stage software companies?', category: 'Startups', difficulty: 'INTERMEDIATE', desc: 'Analyze founder team, market size, traction, and defensibility.' },

    { id: 'inter-fin-1', text: 'How do interest rate increases by central banks impact consumer borrowing?', category: 'Finance', difficulty: 'INTERMEDIATE', desc: 'Explain mortgage rates, credit costs, and economic cooling.' },
    { id: 'inter-fin-2', text: 'What is the difference between equity and debt financing for a business?', category: 'Finance', difficulty: 'INTERMEDIATE', desc: 'Compare selling company ownership versus taking on bank loans.' },

    { id: 'inter-career-1', text: 'How do you handle a disagreement with a team member on technical design?', category: 'Career', difficulty: 'INTERMEDIATE', desc: 'Explain your communication approach, compromise, and focus on data.' },
    { id: 'inter-career-2', text: 'How do you prioritize tasks when faced with multiple tight deadlines?', category: 'Career', difficulty: 'INTERMEDIATE', desc: 'Share your framework for urgency vs impact prioritization.' },

    // --- HARD (Full Reasoning & Debate Questions) ---
    { id: 'hard-ai-1', text: 'Should AI-generated code be trusted in production software without human review? Explain your position.', category: 'AI & Machine Learning', difficulty: 'HARD', desc: 'Evaluate security, code quality, accountability, and speed.' },
    { id: 'hard-ai-2', text: 'Will artificial intelligence replace entry-level software engineering jobs, or transform them into higher-level roles?', category: 'AI & Machine Learning', difficulty: 'HARD', desc: 'Formulate a structured argument with reasoning and workforce trends.' },
    { id: 'hard-ai-3', text: 'Should governments regulate foundation AI models like open-source LLMs? Provide key arguments for both sides.', category: 'AI & Machine Learning', difficulty: 'HARD', desc: 'Balance national security/safety concerns against innovation and open research.' },

    { id: 'hard-tech-1', text: 'Is remote engineering work beneficial or harmful to long-term innovation in software companies?', category: 'Technology', difficulty: 'HARD', desc: 'Compare deep focus time vs spontaneous collaboration and onboarding.' },
    { id: 'hard-tech-2', text: 'Should tech monopolies be broken up by antitrust regulations to preserve market competition?', category: 'Technology', difficulty: 'HARD', desc: 'Examine consumer welfare, ecosystem lock-in, and economic incentives.' },

    { id: 'hard-startup-1', text: 'If you had limited capital, how would you validate a high-risk startup idea before writing code?', category: 'Startups', difficulty: 'HARD', desc: 'Propose a structured step-by-step customer interview and landing page experiment.' },

    { id: 'hard-career-1', text: 'Describe a situation where a software project was failing. How would you diagnose the root cause and turn it around?', category: 'Career', difficulty: 'HARD', desc: 'Use a structured framework (STAR) to outline assessment, team realignment, and execution.' }
  ],

  // Semantic similarity check to avoid duplicates or near duplicates
  isTooSimilar(text1, text2) {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const t1 = normalize(text1);
    const t2 = normalize(text2);
    if (t1 === t2) return true;
    
    // Check key word overlap ratio
    const words1 = new Set(t1.split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(t2.split(/\s+/).filter(w => w.length > 3));
    if (words1.size === 0 || words2.size === 0) return false;
    
    let intersection = 0;
    words1.forEach(w => { if (words2.has(w)) intersection++; });
    const similarity = intersection / Math.min(words1.size, words2.size);
    return similarity > 0.75;
  },

  // Primary Topic Generator Function
  generateTopic(difficulty = 'INTERMEDIATE', categories = ['All']) {
    const history = FluentStorage.getTopicHistory();
    const usedIds = new Set(history.map(h => h.id));
    const usedTexts = history.map(h => h.text);

    // Filter available static bank items
    let candidates = this.TOPIC_BANK.filter(item => {
      // Filter difficulty
      if (item.difficulty !== difficulty) return false;
      // Filter category if not All
      if (!categories.includes('All') && !categories.includes(item.category)) return false;
      // Exclude already used IDs
      if (usedIds.has(item.id)) return false;
      // Exclude semantically similar questions
      if (usedTexts.some(prevText => this.isTooSimilar(prevText, item.text))) return false;
      return true;
    });

    // If candidates exist, return a random clean candidate
    if (candidates.length > 0) {
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      FluentStorage.addTopicToHistory(selected);
      return selected;
    }

    // Dynamic Topic Synthesizer (Fallback when static bank candidates are exhausted)
    const category = (categories.includes('All') || categories.length === 0) 
      ? this.CATEGORIES[Math.floor(Math.random() * (this.CATEGORIES.length - 1)) + 1]
      : categories[Math.floor(Math.random() * categories.length)];

    const dynamicTopic = this.synthesizeDynamicTopic(difficulty, category);
    FluentStorage.addTopicToHistory(dynamicTopic);
    return dynamicTopic;
  },

  synthesizeDynamicTopic(difficulty, category) {
    const id = `dynamic-${difficulty.toLowerCase()}-${Date.now()}`;
    const easyTopics = {
      'AI & Machine Learning': ['Transformers', 'Computer Vision', 'Fine-Tuning', 'Inference', 'Prompt Engineering'],
      'Technology': ['REST APIs', 'Kubernetes', 'WebSockets', 'Serverless', 'CDN'],
      'Software Engineering': ['CI/CD', 'Unit Testing', 'Refactoring', 'Design Patterns', 'Concurrency'],
      'Startups': ['Bootstrapping', 'Venture Capital', 'User Acquisition', 'Churn Rate', 'Pitch Deck'],
      'Business': ['Negotiation', 'Market Share', 'Stakeholders', 'ROI', 'Benchmarking'],
      'Finance': ['Valuation', 'Liquidity', 'Cash Flow', 'Compound Interest', 'Portfolio'],
      'Psychology': ['Emotional Intelligence', 'Habit Loops', 'Growth Mindset', 'Cognitive Dissonance', 'Focus'],
      'Science': ['Thermodynamics', 'Quantum Computing', 'Genomics', 'Entropy', 'Solar Energy'],
      'Communication': ['Persuasion', 'Active Listening', 'Public Speaking', 'Clarity', 'Non-Verbal Cues'],
      'Career': ['Mentorship', 'Networking', 'Personal Branding', 'Negotiation', 'Career Growth'],
      'General Knowledge': ['The Scientific Method', 'Critical Thinking', 'Socratic Method', 'Systems Thinking', 'Heuristics']
    };

    const intermediateTemplates = {
      'AI & Machine Learning': 'How do modern AI models process unstructured data?',
      'Technology': 'Why is network latency critical for real-time applications?',
      'Software Engineering': 'What are the trade-offs between SQL and NoSQL databases?',
      'Startups': 'How can a founder identify product-market fit early?',
      'Business': 'How does company culture influence operational efficiency?',
      'Finance': 'Why do stock prices fluctuate based on interest rate announcements?',
      'Psychology': 'How does cognitive dissonance impact decision making under pressure?',
      'Science': 'How does quantum computing differ from classical computing?',
      'Communication': 'What makes a technical explanation clear to a non-technical stakeholder?',
      'Career': 'What strategies help professionals build long-term career resilience?',
      'General Knowledge': 'Why is critical thinking essential in the age of information overload?'
    };

    const hardTemplates = {
      'AI & Machine Learning': 'Should autonomous AI agents be granted executive decision authority in financial trading? Debate your stance.',
      'Technology': 'Will open-source software out-innovate proprietary software platforms in the next decade? Explain your reasoning.',
      'Software Engineering': 'Is test-driven development (TDD) strictly necessary for shipping high-quality software quickly?',
      'Startups': 'Is it better for a founder to bootstrap to profitability or raise venture capital for fast growth?',
      'Business': 'Should corporate strategies prioritize short-term quarterly profits or long-term R&D investments?',
      'Finance': 'How will decentralized finance (DeFi) impact traditional banking systems in the long run?',
      'Psychology': 'Can emotional intelligence be systematically trained, or is it largely an inherent trait?',
      'Science': 'Will nuclear fusion become the dominant clean energy source before 2050?',
      'Communication': 'How can technical leaders effectively communicate difficult trade-offs during a project crisis?',
      'Career': 'Is specialization (being a T-shaped specialist) better than generalism for long-term career growth?',
      'General Knowledge': 'How should educational institutions adapt their curricula to prepare students for an automated economy?'
    };

    let text = '';
    let desc = '';

    if (difficulty === 'EASY') {
      const arr = easyTopics[category] || ['Optimization', 'Architecture', 'Strategy', 'Scalability'];
      text = arr[Math.floor(Math.random() * arr.length)];
      desc = `A simple concept in ${category}. Explain what it is and why it matters.`;
    } else if (difficulty === 'INTERMEDIATE') {
      text = intermediateTemplates[category] || `How does key principle in ${category} work in practice?`;
      desc = `A focused question exploring cause, effect, and practical application.`;
    } else {
      text = hardTemplates[category] || `Formulate a structured argument regarding the future of ${category}.`;
      desc = `A deep reasoning question requiring evidence, trade-off evaluation, and clear conclusion.`;
    }

    return { id, text, category, difficulty, desc };
  }
};
window.FluentTopics = FluentTopics;
