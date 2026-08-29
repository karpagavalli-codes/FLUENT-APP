/**
 * FLUENT - Career & Tech Vocabulary Database
 */
const FluentVocabulary = {
  CATEGORIES: ['All', 'AI & ML', 'Software Engineering', 'Startups', 'Business', 'Professional Communication'],

  VOCAB_BANK: [
    // AI & ML
    {
      word: 'inference',
      category: 'AI & ML',
      phonetic: '/ˈɪn.fər.əns/',
      definition: 'The process of using a trained model to make predictions on new data.',
      proMeaning: 'Running an AI model in production to process user queries rather than training it.',
      example: 'We optimized our model quantization to reduce inference latency under 50ms.',
      related: ['latency', 'throughput', 'quantization']
    },
    {
      word: 'scalability',
      category: 'AI & ML',
      phonetic: '/ˌskeɪ.ləˈbɪl.ə.ti/',
      definition: 'The capacity of a system to handle a growing amount of work by adding resources.',
      proMeaning: 'Designing infrastructure to accommodate exponential user growth without performance loss.',
      example: 'Horizontal pod autoscaling ensures system scalability during unexpected traffic spikes.',
      related: ['throughput', 'load balancing', 'elasticity']
    },
    {
      word: 'architecture',
      category: 'Software Engineering',
      phonetic: '/ˈɑː.kɪ.tek.tʃər/',
      definition: 'The overall structural design and organization of a software system.',
      proMeaning: 'High-level decisions regarding components, data flow, and system interfaces.',
      example: 'Adopting an event-driven architecture decoupled our microservices.',
      related: ['modularity', 'decoupling', 'patterns']
    },
    {
      word: 'maintainability',
      category: 'Software Engineering',
      phonetic: '/meɪnˌteɪ.nəˈbɪl.ə.ti/',
      definition: 'The ease with which software can be modified, bugs fixed, or features added.',
      proMeaning: 'Writing clean code and documentation so future engineers can update it safely.',
      example: 'Refactoring duplicate functions improved codebase maintainability.',
      related: ['clean code', 'refactoring', 'technical debt']
    },
    {
      word: 'abstraction',
      category: 'Software Engineering',
      phonetic: '/æbˈstræk.ʃən/',
      definition: 'Hiding internal execution details and exposing only essential functionality.',
      proMeaning: 'Creating clear interfaces so callers do not need to understand complex implementation.',
      example: 'The database abstraction layer lets us switch from MySQL to PostgreSQL effortlessly.',
      related: ['interface', 'encapsulation', 'decoupling']
    },
    {
      word: 'product-market fit',
      category: 'Startups',
      phonetic: '/ˈprɒd.ʌkt ˈmɑː.kɪt fɪt/',
      definition: 'The degree to which a product satisfies strong market demand.',
      proMeaning: 'Achieving organic user retention and pull where customers actively demand your solution.',
      example: 'Our 40% monthly retention rate confirmed we reached product-market fit.',
      related: ['retention', 'traction', 'validation']
    },
    {
      word: 'valuation',
      category: 'Startups',
      phonetic: '/ˌvæl.juˈeɪ.ʃən/',
      definition: 'An estimation of how much a business or company is worth.',
      proMeaning: 'Financial appraisal calculated prior to investment rounds.',
      example: 'The Series A funding round valued the company at a $25 million valuation.',
      related: ['equity', 'dilution', 'cap table']
    },
    {
      word: 'stakeholder',
      category: 'Business',
      phonetic: '/ˈsteɪkˌhəʊl.dər/',
      definition: 'Any individual or group that has an interest in the outcome of a project.',
      proMeaning: 'Engineers, product managers, executive leaders, and customers affected by a decision.',
      example: 'We presented the technical roadmap to executive stakeholders for approval.',
      related: ['alignment', 'buy-in', 'governance']
    },
    {
      word: 'articulate',
      category: 'Professional Communication',
      phonetic: '/ɑːˈtɪk.jə.lət/',
      definition: 'To express an idea clearly and fluently in spoken words.',
      proMeaning: 'Explaining complex technical trade-offs with structured clarity.',
      example: 'She articulated the architectural risks clearly during the post-mortem meeting.',
      related: ['clarify', 'elaborate', 'demonstrate']
    },
    {
      word: 'elaborate',
      category: 'Professional Communication',
      phonetic: '/ɪˈlæb.ə.reɪt/',
      definition: 'To add details, reasoning, or examples to expand upon a basic point.',
      proMeaning: 'Providing supporting context when a listener requests deeper technical insight.',
      example: 'Could you elaborate on how the cache invalidation logic handles race conditions?',
      related: ['articulate', 'substantiate', 'exemplify']
    }
  ],

  getFiltered(category = 'All') {
    if (category === 'All') return this.VOCAB_BANK;
    return this.VOCAB_BANK.filter(v => v.category === category);
  }
};
