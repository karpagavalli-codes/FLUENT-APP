/**
 * FLUENT - Frameworks Library & Evaluator
 */
const FluentFrameworks = {
  FRAMEWORKS: [
    {
      id: 'prep',
      name: 'PREP Framework',
      tagline: 'Point — Reason — Example — Point',
      purpose: 'Ideal for clear, concise professional answers and impromptu speaking.',
      steps: [
        { letter: 'P', label: 'Point', desc: 'State your main idea directly in one clear sentence.' },
        { letter: 'R', label: 'Reason', desc: 'Explain why your point is true or important.' },
        { letter: 'E', label: 'Example', desc: 'Provide a concrete example or data point supporting your reason.' },
        { letter: 'P', label: 'Point', desc: 'Restate your main point to wrap up with impact.' }
      ],
      explanation: 'PREP forces you to state your conclusion upfront, provide logical backing with an example, and close cleanly without rambling.',
      example: 'Point: Docker improves deployment reliability.\nReason: Containers package applications with their exact dependencies.\nExample: Our team eliminated environment bugs between local laptops and AWS staging.\nPoint: Therefore, Docker is essential for consistent releases.'
    },
    {
      id: 'star',
      name: 'STAR Framework',
      tagline: 'Situation — Task — Action — Result',
      purpose: 'The standard framework for behavioral and technical job interviews.',
      steps: [
        { letter: 'S', label: 'Situation', desc: 'Set the context by describing the background or challenge.' },
        { letter: 'T', label: 'Task', desc: 'Explain the specific responsibility or goal you had to achieve.' },
        { letter: 'A', label: 'Action', desc: 'Detail the concrete steps you personally took to address it.' },
        { letter: 'R', label: 'Result', desc: 'Share the quantifiable outcome and key lesson learned.' }
      ],
      explanation: 'STAR structures past experiences into compelling stories that demonstrate problem-solving and ownership.',
      example: 'Situation: Our database queries were timing out during peak traffic.\nTask: I was tasked with reducing API latency under 200ms.\nAction: I added Redis caching for frequent read queries and optimized slow indexes.\nResult: API response time dropped by 65%, handling 10k active users.'
    },
    {
      id: '5w1h',
      name: '5W1H Framework',
      tagline: 'What — Why — Who — When — Where — How',
      purpose: 'Perfect for introducing new technical concepts, architecture, or project proposals.',
      steps: [
        { letter: 'W', label: 'What', desc: 'Define what the concept or system is.' },
        { letter: 'W', label: 'Why', desc: 'Explain why it matters or what problem it solves.' },
        { letter: 'W', label: 'Who', desc: 'Identify who uses or benefits from it.' },
        { letter: 'W', label: 'When', desc: 'Explain when it should be implemented.' },
        { letter: 'W', label: 'Where', desc: 'Locate where it fits in the architecture.' },
        { letter: 'H', label: 'How', desc: 'Explain how it works mechanically.' }
      ],
      explanation: '5W1H ensures no fundamental details are missed when explaining complex domain topics to stakeholders.',
      example: 'What: Retrieval-Augmented Generation (RAG).\nWhy: Prevents LLM hallucinations using external documents.\nWho: AI developers and enterprise users.\nWhen: When answers require up-to-date private data.\nWhere: Between user query and LLM inference.\nHow: By fetching relevant vector embeddings before prompting.'
    },
    {
      id: 'pcs',
      name: 'Problem → Cause → Solution',
      tagline: 'Problem — Root Cause — Solution',
      purpose: 'Essential for technical post-mortems, bug reporting, and product strategy pitch.',
      steps: [
        { letter: 'P', label: 'Problem', desc: 'Describe the symptom or failure clearly.' },
        { letter: 'C', label: 'Cause', desc: 'Analyze the underlying root cause.' },
        { letter: 'S', label: 'Solution', desc: 'Propose actionable steps to resolve it permanently.' }
      ],
      explanation: 'Focuses immediately on diagnostic clarity and practical problem solving.',
      example: 'Problem: High customer churn on our signup flow.\nCause: The multi-step verification form takes over 4 minutes.\nSolution: Implement single-click OAuth social login to cut friction by 80%.'
    },
    {
      id: 'cer',
      name: 'Claim → Evidence → Reasoning',
      tagline: 'Claim — Evidence — Reasoning',
      purpose: 'Great for analytical discussions, technical debates, and code reviews.',
      steps: [
        { letter: 'C', label: 'Claim', desc: 'State your position or hypothesis.' },
        { letter: 'E', label: 'Evidence', desc: 'Present empirical data, benchmarks, or code metrics.' },
        { letter: 'R', label: 'Reasoning', desc: 'Connect how the evidence logically proves your claim.' }
      ],
      explanation: 'Replaces opinion with structured argumentation backed by data.',
      example: 'Claim: Microservices are premature for our 3-person team.\nEvidence: Benchmark shows monolith deployment takes 30s while service mesh adds 4 hours overhead.\nReasoning: Developer velocity depends on low infrastructure overhead at this stage.'
    },
    {
      id: 'ccc',
      name: 'Compare → Contrast → Conclusion',
      tagline: 'Compare — Contrast — Recommendation',
      purpose: 'Ideal for technology selection (e.g. SQL vs NoSQL, React vs Vue).',
      steps: [
        { letter: 'C', label: 'Compare', desc: 'Identify shared features and common goals.' },
        { letter: 'C', label: 'Contrast', desc: 'Highlight key differences in trade-offs and performance.' },
        { letter: 'C', label: 'Conclusion', desc: 'Give a clear recommendation based on the use case.' }
      ],
      explanation: 'Demonstrates balanced technical evaluation before making a decision.',
      example: 'Compare: Both SQL and NoSQL persist structured application data.\nContrast: SQL enforces ACID compliance while NoSQL scales horizontally for unstructured documents.\nConclusion: Use PostgreSQL for financial transactions, MongoDB for dynamic user feeds.'
    }
  ],

  getById(id) {
    return this.FRAMEWORKS.find(f => f.id === id) || this.FRAMEWORKS[0];
  }
};
window.FluentFrameworks = FluentFrameworks;
