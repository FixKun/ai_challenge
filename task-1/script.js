// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

const EMPLOYEES = [
  {
    id: 1,
    name: "Aleksander Nowak",
    title: "Senior Software Engineer",
    dept: "Platform Engineering",
  },
  {
    id: 2,
    name: "Beatrice Fontaine",
    title: "Group Manager",
    dept: "Engineering Leadership",
  },
  {
    id: 3,
    name: "Carlos Reyes",
    title: "Lead QA Engineer",
    dept: "Quality Assurance",
  },
  { id: 4, name: "Diana Kovač", title: "Product Manager", dept: "Product" },
  {
    id: 5,
    name: "Emre Yıldız",
    title: "DevOps Engineer",
    dept: "Infrastructure",
  },
  {
    id: 6,
    name: "Francesca Moretti",
    title: "Tech Lead",
    dept: "Backend Systems",
  },
  { id: 7, name: "Gábor Fekete", title: "Scrum Master", dept: "Delivery" },
  {
    id: 8,
    name: "Helena Sørensen",
    title: "Data Analyst",
    dept: "Data & Analytics",
  },
  { id: 9, name: "Ivan Petrov", title: "UX Designer", dept: "Design" },
  {
    id: 10,
    name: "Jasmine Okafor",
    title: "Software Engineer",
    dept: "Platform Engineering",
  },
  {
    id: 11,
    name: "Krzysztof Wiśniewski",
    title: "Senior DevOps Engineer",
    dept: "Infrastructure",
  },
  {
    id: 12,
    name: "Layla Hassan",
    title: "QA Engineer",
    dept: "Quality Assurance",
  },
  {
    id: 13,
    name: "Mikhail Sorokin",
    title: "Staff Engineer",
    dept: "Architecture",
  },
  { id: 14, name: "Nadia Dupont", title: "Product Manager", dept: "Product" },
  {
    id: 15,
    name: "Oscar Lindström",
    title: "Software Engineer",
    dept: "Frontend",
  },
  {
    id: 16,
    name: "Priya Subramaniam",
    title: "Senior Data Analyst",
    dept: "Data & Analytics",
  },
  {
    id: 17,
    name: "Quentin Marchand",
    title: "Tech Lead",
    dept: "Backend Systems",
  },
  { id: 18, name: "Rosamund Clarke", title: "UX Researcher", dept: "Design" },
  {
    id: 19,
    name: "Sven Bergström",
    title: "Security Engineer",
    dept: "Security",
  },
  {
    id: 20,
    name: "Tatiana Volkov",
    title: "Senior Software Engineer",
    dept: "Frontend",
  },
  {
    id: 21,
    name: "Ugo Martins",
    title: "Machine Learning Engineer",
    dept: "AI Platform",
  },
  { id: 22, name: "Valentina Cruz", title: "Scrum Master", dept: "Delivery" },
  {
    id: 23,
    name: "Willem de Boer",
    title: "Backend Engineer",
    dept: "Backend Systems",
  },
  { id: 24, name: "Xiao-Mei Huang", title: "Product Designer", dept: "Design" },
  {
    id: 25,
    name: "Yannick Bonnet",
    title: "QA Automation Engineer",
    dept: "Quality Assurance",
  },
  {
    id: 26,
    name: "Zofia Kamińska",
    title: "Engineering Manager",
    dept: "Engineering Leadership",
  },
  {
    id: 27,
    name: "Arjun Sharma",
    title: "Cloud Architect",
    dept: "Infrastructure",
  },
  {
    id: 28,
    name: "Brigitte Weiss",
    title: "Technical Writer",
    dept: "Documentation",
  },
  {
    id: 29,
    name: "Caio Ferreira",
    title: "Software Engineer",
    dept: "Platform Engineering",
  },
  {
    id: 30,
    name: "Daria Melnyk",
    title: "Senior QA Engineer",
    dept: "Quality Assurance",
  },
  {
    id: 31,
    name: "Erwan Le Gall",
    title: "Full-Stack Engineer",
    dept: "Frontend",
  },
  {
    id: 32,
    name: "Fatima Al-Rashid",
    title: "Data Engineer",
    dept: "Data & Analytics",
  },
  {
    id: 33,
    name: "Gregor Müller",
    title: "Site Reliability Engineer",
    dept: "Infrastructure",
  },
];

const ACTIVITIES = [
  // Aleksander Nowak (1)
  {
    empId: 1,
    name: "Advanced Kubernetes Workshop (12.03.25)",
    category: "Public Speaking",
    date: "2025-03-12",
    points: 64,
  },
  {
    empId: 1,
    name: "Internal Tech Blog: Service Mesh Patterns",
    category: "Writing",
    date: "2025-01-20",
    points: 24,
  },
  {
    empId: 1,
    name: "Open Source PR: gRPC load balancer fix",
    category: "Open Source",
    date: "2025-04-08",
    points: 40,
  },
  {
    empId: 1,
    name: "Mentored Q1 Graduate Cohort",
    category: "Mentoring",
    date: "2025-02-14",
    points: 48,
  },
  {
    empId: 1,
    name: "Observability Roadmap Presentation",
    category: "Public Speaking",
    date: "2024-11-06",
    points: 56,
  },
  {
    empId: 1,
    name: "Platform Architecture Knowledge Share",
    category: "Knowledge Sharing",
    date: "2024-09-18",
    points: 32,
  },
  {
    empId: 1,
    name: "API Gateway Proof of Concept",
    category: "Innovation",
    date: "2024-07-22",
    points: 36,
  },
  {
    empId: 1,
    name: "All-Hands: Microservices Migration (18.12.25)",
    category: "Public Speaking",
    date: "2025-12-18",
    points: 72,
  },

  // Beatrice Fontaine (2)
  {
    empId: 2,
    name: "Engineering Culture Summit Keynote",
    category: "Public Speaking",
    date: "2025-06-10",
    points: 80,
  },
  {
    empId: 2,
    name: "Leadership Handbook Chapter Contribution",
    category: "Writing",
    date: "2025-03-05",
    points: 28,
  },
  {
    empId: 2,
    name: "Quarterly Retrospective Facilitation",
    category: "Knowledge Sharing",
    date: "2025-01-30",
    points: 36,
  },
  {
    empId: 2,
    name: "New Manager Onboarding Program",
    category: "Mentoring",
    date: "2025-07-14",
    points: 60,
  },
  {
    empId: 2,
    name: "Diversity Hiring Process Innovation",
    category: "Innovation",
    date: "2024-10-09",
    points: 44,
  },

  // Carlos Reyes (3)
  {
    empId: 3,
    name: "QA Automation Framework Intro",
    category: "Public Speaking",
    date: "2025-05-21",
    points: 56,
  },
  {
    empId: 3,
    name: "Bug Triage Best Practices Wiki",
    category: "Knowledge Sharing",
    date: "2025-02-18",
    points: 20,
  },
  {
    empId: 3,
    name: "Mentored Junior QA Engineers",
    category: "Mentoring",
    date: "2025-04-03",
    points: 48,
  },
  {
    empId: 3,
    name: "Open Source: Selenium Helper Library",
    category: "Open Source",
    date: "2024-12-11",
    points: 36,
  },
  {
    empId: 3,
    name: "Test Coverage Innovation Initiative",
    category: "Innovation",
    date: "2025-08-07",
    points: 40,
  },
  {
    empId: 3,
    name: "QA Guild Lightning Talk",
    category: "Public Speaking",
    date: "2025-09-15",
    points: 24,
  },

  // Diana Kovač (4)
  {
    empId: 4,
    name: "Product Discovery Workshop",
    category: "Knowledge Sharing",
    date: "2025-03-20",
    points: 32,
  },
  {
    empId: 4,
    name: "Roadmap Planning Presentation Q3",
    category: "Public Speaking",
    date: "2025-07-02",
    points: 48,
  },
  {
    empId: 4,
    name: "Product Spec Writing Guide",
    category: "Writing",
    date: "2025-01-15",
    points: 20,
  },
  {
    empId: 4,
    name: "Innovation Sprint Facilitator",
    category: "Innovation",
    date: "2025-10-08",
    points: 52,
  },

  // Emre Yıldız (5)
  {
    empId: 5,
    name: "CI/CD Pipeline Talk (22.04.25)",
    category: "Public Speaking",
    date: "2025-04-22",
    points: 48,
  },
  {
    empId: 5,
    name: "Terraform Module Contribution",
    category: "Open Source",
    date: "2025-02-10",
    points: 32,
  },
  {
    empId: 5,
    name: "On-Call Runbook Overhaul",
    category: "Knowledge Sharing",
    date: "2025-06-14",
    points: 24,
  },
  {
    empId: 5,
    name: "Infrastructure Cost Optimisation Hack",
    category: "Innovation",
    date: "2024-11-19",
    points: 44,
  },
  {
    empId: 5,
    name: "Mentored Intern on Cloud Fundamentals",
    category: "Mentoring",
    date: "2025-08-04",
    points: 36,
  },

  // Francesca Moretti (6)
  {
    empId: 6,
    name: "Backend Guild Tech Talk",
    category: "Public Speaking",
    date: "2025-05-08",
    points: 56,
  },
  {
    empId: 6,
    name: "Clean Architecture Article",
    category: "Writing",
    date: "2025-03-28",
    points: 20,
  },
  {
    empId: 6,
    name: "Domain-Driven Design Workshop",
    category: "Knowledge Sharing",
    date: "2025-01-10",
    points: 40,
  },
  {
    empId: 6,
    name: "Open Source: Kafka consumer utility",
    category: "Open Source",
    date: "2024-10-30",
    points: 28,
  },
  {
    empId: 6,
    name: "Mentored Mid-Level Engineers Q2",
    category: "Mentoring",
    date: "2025-04-17",
    points: 48,
  },

  // Gábor Fekete (7)
  {
    empId: 7,
    name: "Agile Retrospectives Workshop",
    category: "Knowledge Sharing",
    date: "2025-02-25",
    points: 28,
  },
  {
    empId: 7,
    name: "Scrum Certification Prep Guide",
    category: "Writing",
    date: "2025-05-13",
    points: 16,
  },
  {
    empId: 7,
    name: "Team Health Check Innovation",
    category: "Innovation",
    date: "2025-07-22",
    points: 32,
  },
  {
    empId: 7,
    name: "Lightning Talk: Psychological Safety",
    category: "Public Speaking",
    date: "2025-09-03",
    points: 24,
  },

  // Helena Sørensen (8)
  {
    empId: 8,
    name: "Data Storytelling Conference Talk",
    category: "Public Speaking",
    date: "2025-06-17",
    points: 64,
  },
  {
    empId: 8,
    name: "SQL Optimisation Tips Article",
    category: "Writing",
    date: "2025-02-07",
    points: 24,
  },
  {
    empId: 8,
    name: "Analytics Dashboard Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-04-29",
    points: 32,
  },
  {
    empId: 8,
    name: "Open Source: dbt macro pack",
    category: "Open Source",
    date: "2025-01-22",
    points: 36,
  },
  {
    empId: 8,
    name: "Mentored Data Analyst Apprentices",
    category: "Mentoring",
    date: "2025-08-19",
    points: 44,
  },

  // Ivan Petrov (9)
  {
    empId: 9,
    name: "Design Systems Lightning Talk",
    category: "Public Speaking",
    date: "2025-03-11",
    points: 40,
  },
  {
    empId: 9,
    name: "UX Research Methods Guide",
    category: "Writing",
    date: "2025-01-27",
    points: 20,
  },
  {
    empId: 9,
    name: "Figma Component Library Contribution",
    category: "Open Source",
    date: "2025-05-06",
    points: 28,
  },
  {
    empId: 9,
    name: "Accessibility Innovation Sprint",
    category: "Innovation",
    date: "2025-09-11",
    points: 36,
  },

  // Jasmine Okafor (10)
  {
    empId: 10,
    name: "Intro to GraphQL Workshop",
    category: "Public Speaking",
    date: "2025-04-14",
    points: 48,
  },
  {
    empId: 10,
    name: "Open Source: React hook library",
    category: "Open Source",
    date: "2025-02-22",
    points: 36,
  },
  {
    empId: 10,
    name: "Frontend Performance Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-06-03",
    points: 24,
  },
  {
    empId: 10,
    name: "Mentored Graduate Developer",
    category: "Mentoring",
    date: "2025-07-30",
    points: 40,
  },
  {
    empId: 10,
    name: "Engineering Blog: Web Vitals Deep Dive",
    category: "Writing",
    date: "2025-01-08",
    points: 16,
  },

  // Krzysztof Wiśniewski (11)
  {
    empId: 11,
    name: "GitOps Deployment Workshop",
    category: "Knowledge Sharing",
    date: "2025-05-19",
    points: 40,
  },
  {
    empId: 11,
    name: "Helm Chart Open Source Contribution",
    category: "Open Source",
    date: "2025-03-03",
    points: 32,
  },
  {
    empId: 11,
    name: "Incident Response Automation Innovation",
    category: "Innovation",
    date: "2025-08-14",
    points: 52,
  },
  {
    empId: 11,
    name: "DevOps Community Lightning Talk",
    category: "Public Speaking",
    date: "2025-10-07",
    points: 44,
  },

  // Layla Hassan (12)
  {
    empId: 12,
    name: "Exploratory Testing Workshop",
    category: "Knowledge Sharing",
    date: "2025-03-24",
    points: 24,
  },
  {
    empId: 12,
    name: "Test Plan Writing Guide",
    category: "Writing",
    date: "2025-01-14",
    points: 16,
  },
  {
    empId: 12,
    name: "Mentored Junior QA",
    category: "Mentoring",
    date: "2025-06-09",
    points: 32,
  },
  {
    empId: 12,
    name: "Chaos Engineering Innovation Proposal",
    category: "Innovation",
    date: "2025-09-22",
    points: 36,
  },

  // Mikhail Sorokin (13)
  {
    empId: 13,
    name: "System Design Masterclass",
    category: "Public Speaking",
    date: "2025-07-16",
    points: 72,
  },
  {
    empId: 13,
    name: "Architecture Decision Records Guide",
    category: "Writing",
    date: "2025-03-10",
    points: 28,
  },
  {
    empId: 13,
    name: "Open Source: distributed tracing library",
    category: "Open Source",
    date: "2025-05-28",
    points: 48,
  },
  {
    empId: 13,
    name: "Mentored Senior Engineers",
    category: "Mentoring",
    date: "2025-02-05",
    points: 56,
  },
  {
    empId: 13,
    name: "Event-Driven Architecture Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-09-04",
    points: 36,
  },
  {
    empId: 13,
    name: "Platform Innovation: service mesh POC",
    category: "Innovation",
    date: "2025-11-01",
    points: 44,
  },

  // Nadia Dupont (14)
  {
    empId: 14,
    name: "Product Strategy Lightning Talk",
    category: "Public Speaking",
    date: "2025-04-30",
    points: 40,
  },
  {
    empId: 14,
    name: "Jobs-to-be-Done Framework Guide",
    category: "Writing",
    date: "2025-02-12",
    points: 20,
  },
  {
    empId: 14,
    name: "Product Analytics Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-06-25",
    points: 28,
  },
  {
    empId: 14,
    name: "Zero-to-One Feature Innovation",
    category: "Innovation",
    date: "2025-08-20",
    points: 44,
  },

  // Oscar Lindström (15)
  {
    empId: 15,
    name: "CSS Architecture Talk",
    category: "Public Speaking",
    date: "2025-03-18",
    points: 36,
  },
  {
    empId: 15,
    name: "Open Source: CSS utility library",
    category: "Open Source",
    date: "2025-01-29",
    points: 28,
  },
  {
    empId: 15,
    name: "Frontend Mentorship Sessions",
    category: "Mentoring",
    date: "2025-07-08",
    points: 32,
  },
  {
    empId: 15,
    name: "Web Animation Innovation",
    category: "Innovation",
    date: "2025-10-15",
    points: 40,
  },

  // Priya Subramaniam (16)
  {
    empId: 16,
    name: "Data Governance Workshop",
    category: "Knowledge Sharing",
    date: "2025-05-07",
    points: 44,
  },
  {
    empId: 16,
    name: "ML Feature Engineering Article",
    category: "Writing",
    date: "2025-02-28",
    points: 24,
  },
  {
    empId: 16,
    name: "Open Source: pandas extension",
    category: "Open Source",
    date: "2025-04-16",
    points: 32,
  },
  {
    empId: 16,
    name: "Predictive Analytics Innovation",
    category: "Innovation",
    date: "2025-07-23",
    points: 52,
  },
  {
    empId: 16,
    name: "Mentored Data Science Intern",
    category: "Mentoring",
    date: "2025-09-10",
    points: 36,
  },
  {
    empId: 16,
    name: "Conference Talk: Real-Time Analytics",
    category: "Public Speaking",
    date: "2025-11-13",
    points: 56,
  },

  // Quentin Marchand (17)
  {
    empId: 17,
    name: "API Design Principles Workshop",
    category: "Knowledge Sharing",
    date: "2025-04-24",
    points: 40,
  },
  {
    empId: 17,
    name: "REST vs GraphQL Article",
    category: "Writing",
    date: "2025-02-03",
    points: 20,
  },
  {
    empId: 17,
    name: "Open Source: FastAPI middleware",
    category: "Open Source",
    date: "2025-06-19",
    points: 36,
  },
  {
    empId: 17,
    name: "Backend Guild Innovation Hack",
    category: "Innovation",
    date: "2025-08-27",
    points: 44,
  },

  // Rosamund Clarke (18)
  {
    empId: 18,
    name: "User Research Methods Talk",
    category: "Public Speaking",
    date: "2025-05-14",
    points: 48,
  },
  {
    empId: 18,
    name: "Research Repository Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-03-06",
    points: 28,
  },
  {
    empId: 18,
    name: "UX Writing Style Guide",
    category: "Writing",
    date: "2025-01-21",
    points: 20,
  },
  {
    empId: 18,
    name: "Continuous Discovery Innovation",
    category: "Innovation",
    date: "2025-09-29",
    points: 36,
  },

  // Sven Bergström (19)
  {
    empId: 19,
    name: "Zero Trust Security Workshop",
    category: "Public Speaking",
    date: "2025-06-23",
    points: 64,
  },
  {
    empId: 19,
    name: "Threat Modelling Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-04-11",
    points: 40,
  },
  {
    empId: 19,
    name: "Open Source: SAST scanner plugin",
    category: "Open Source",
    date: "2025-02-17",
    points: 44,
  },
  {
    empId: 19,
    name: "Secure SDLC Innovation",
    category: "Innovation",
    date: "2025-08-05",
    points: 48,
  },
  {
    empId: 19,
    name: "Security Champions Mentoring Program",
    category: "Mentoring",
    date: "2025-10-20",
    points: 56,
  },

  // Tatiana Volkov (20)
  {
    empId: 20,
    name: "React Performance Optimisation Talk",
    category: "Public Speaking",
    date: "2025-03-26",
    points: 56,
  },
  {
    empId: 20,
    name: "Open Source: React DevTools plugin",
    category: "Open Source",
    date: "2025-01-31",
    points: 40,
  },
  {
    empId: 20,
    name: "Frontend Mentorship Program Lead",
    category: "Mentoring",
    date: "2025-05-22",
    points: 52,
  },
  {
    empId: 20,
    name: "Micro-Frontend Architecture Article",
    category: "Writing",
    date: "2025-07-10",
    points: 24,
  },
  {
    empId: 20,
    name: "Design Token Innovation",
    category: "Innovation",
    date: "2025-09-18",
    points: 36,
  },
  {
    empId: 20,
    name: "State Management Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-11-06",
    points: 32,
  },

  // Ugo Martins (21)
  {
    empId: 21,
    name: "ML Model Deployment Workshop",
    category: "Knowledge Sharing",
    date: "2025-04-07",
    points: 48,
  },
  {
    empId: 21,
    name: "LLM Fine-Tuning Article",
    category: "Writing",
    date: "2025-02-19",
    points: 24,
  },
  {
    empId: 21,
    name: "Open Source: LangChain connector",
    category: "Open Source",
    date: "2025-06-02",
    points: 52,
  },
  {
    empId: 21,
    name: "AI Feature Innovation Sprint",
    category: "Innovation",
    date: "2025-08-12",
    points: 60,
  },
  {
    empId: 21,
    name: "Conference: Responsible AI (29.10.25)",
    category: "Public Speaking",
    date: "2025-10-29",
    points: 72,
  },

  // Valentina Cruz (22)
  {
    empId: 22,
    name: "Agile Ceremonies Optimisation Talk",
    category: "Public Speaking",
    date: "2025-05-27",
    points: 40,
  },
  {
    empId: 22,
    name: "Team Dynamics Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-03-14",
    points: 24,
  },
  {
    empId: 22,
    name: "Mentored New Scrum Masters",
    category: "Mentoring",
    date: "2025-07-01",
    points: 36,
  },
  {
    empId: 22,
    name: "Kanban Innovation Pilot",
    category: "Innovation",
    date: "2025-09-08",
    points: 32,
  },

  // Willem de Boer (23)
  {
    empId: 23,
    name: "Distributed Systems Talk",
    category: "Public Speaking",
    date: "2025-04-28",
    points: 52,
  },
  {
    empId: 23,
    name: "Open Source: Go concurrency toolkit",
    category: "Open Source",
    date: "2025-02-24",
    points: 44,
  },
  {
    empId: 23,
    name: "Database Indexing Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-06-16",
    points: 32,
  },
  {
    empId: 23,
    name: "Backend Mentorship Sessions",
    category: "Mentoring",
    date: "2025-08-25",
    points: 40,
  },

  // Xiao-Mei Huang (24)
  {
    empId: 24,
    name: "Design Tokens Workshop",
    category: "Knowledge Sharing",
    date: "2025-03-17",
    points: 28,
  },
  {
    empId: 24,
    name: "Inclusive Design Article",
    category: "Writing",
    date: "2025-01-13",
    points: 16,
  },
  {
    empId: 24,
    name: "Open Source: Figma plugin",
    category: "Open Source",
    date: "2025-05-09",
    points: 32,
  },
  {
    empId: 24,
    name: "Motion Design Innovation",
    category: "Innovation",
    date: "2025-07-28",
    points: 40,
  },

  // Yannick Bonnet (25)
  {
    empId: 25,
    name: "Test Automation Trends Talk",
    category: "Public Speaking",
    date: "2025-06-04",
    points: 44,
  },
  {
    empId: 25,
    name: "Open Source: Playwright helper",
    category: "Open Source",
    date: "2025-04-01",
    points: 32,
  },
  {
    empId: 25,
    name: "QA Knowledge Base Initiative",
    category: "Knowledge Sharing",
    date: "2025-02-06",
    points: 24,
  },
  {
    empId: 25,
    name: "Performance Testing Innovation",
    category: "Innovation",
    date: "2025-09-16",
    points: 36,
  },
  {
    empId: 25,
    name: "Mentored QA Interns",
    category: "Mentoring",
    date: "2025-11-04",
    points: 28,
  },

  // Zofia Kamińska (26)
  {
    empId: 26,
    name: "Engineering Org Design Talk",
    category: "Public Speaking",
    date: "2025-07-09",
    points: 68,
  },
  {
    empId: 26,
    name: "Career Ladder Framework Guide",
    category: "Writing",
    date: "2025-03-22",
    points: 28,
  },
  {
    empId: 26,
    name: "Manager Mentorship Program",
    category: "Mentoring",
    date: "2025-05-15",
    points: 60,
  },
  {
    empId: 26,
    name: "Team Topology Innovation",
    category: "Innovation",
    date: "2025-10-01",
    points: 48,
  },
  {
    empId: 26,
    name: "Cross-Team Knowledge Share Series",
    category: "Knowledge Sharing",
    date: "2025-01-09",
    points: 36,
  },

  // Arjun Sharma (27)
  {
    empId: 27,
    name: "Multi-Cloud Strategy Workshop",
    category: "Public Speaking",
    date: "2025-06-30",
    points: 64,
  },
  {
    empId: 27,
    name: "Cloud Cost Engineering Article",
    category: "Writing",
    date: "2025-04-18",
    points: 24,
  },
  {
    empId: 27,
    name: "Open Source: Pulumi provider module",
    category: "Open Source",
    date: "2025-02-28",
    points: 44,
  },
  {
    empId: 27,
    name: "FinOps Innovation Initiative",
    category: "Innovation",
    date: "2025-08-21",
    points: 52,
  },
  {
    empId: 27,
    name: "Cloud Certification Mentorship",
    category: "Mentoring",
    date: "2025-10-12",
    points: 40,
  },

  // Brigitte Weiss (28)
  {
    empId: 28,
    name: "Docs-as-Code Workshop",
    category: "Knowledge Sharing",
    date: "2025-05-01",
    points: 28,
  },
  {
    empId: 28,
    name: "API Documentation Best Practices",
    category: "Writing",
    date: "2025-03-09",
    points: 24,
  },
  {
    empId: 28,
    name: "Open Source: OpenAPI template",
    category: "Open Source",
    date: "2025-01-17",
    points: 20,
  },
  {
    empId: 28,
    name: "Developer Experience Innovation",
    category: "Innovation",
    date: "2025-07-15",
    points: 32,
  },

  // Caio Ferreira (29)
  {
    empId: 29,
    name: "Event Sourcing Talk",
    category: "Public Speaking",
    date: "2025-04-09",
    points: 44,
  },
  {
    empId: 29,
    name: "Open Source: Java event bus library",
    category: "Open Source",
    date: "2025-02-14",
    points: 36,
  },
  {
    empId: 29,
    name: "CQRS Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-06-26",
    points: 28,
  },
  {
    empId: 29,
    name: "Mentored Junior Engineers Q3",
    category: "Mentoring",
    date: "2025-08-31",
    points: 40,
  },

  // Daria Melnyk (30)
  {
    empId: 30,
    name: "QA Strategy Conference Talk",
    category: "Public Speaking",
    date: "2025-07-24",
    points: 56,
  },
  {
    empId: 30,
    name: "Quality Engineering Handbook",
    category: "Writing",
    date: "2025-05-30",
    points: 28,
  },
  {
    empId: 30,
    name: "Open Source: Allure report plugin",
    category: "Open Source",
    date: "2025-03-20",
    points: 36,
  },
  {
    empId: 30,
    name: "Shift-Left Testing Innovation",
    category: "Innovation",
    date: "2025-09-25",
    points: 44,
  },
  {
    empId: 30,
    name: "Mentored Cross-Team QA Engineers",
    category: "Mentoring",
    date: "2025-11-18",
    points: 48,
  },

  // Erwan Le Gall (31)
  {
    empId: 31,
    name: "Module Federation Workshop",
    category: "Knowledge Sharing",
    date: "2025-04-23",
    points: 36,
  },
  {
    empId: 31,
    name: "TypeScript Advanced Patterns Article",
    category: "Writing",
    date: "2025-02-20",
    points: 20,
  },
  {
    empId: 31,
    name: "Open Source: Vite plugin toolkit",
    category: "Open Source",
    date: "2025-06-12",
    points: 32,
  },
  {
    empId: 31,
    name: "Monorepo Innovation Pilot",
    category: "Innovation",
    date: "2025-08-07",
    points: 40,
  },

  // Fatima Al-Rashid (32)
  {
    empId: 32,
    name: "Data Pipeline Reliability Talk",
    category: "Public Speaking",
    date: "2025-05-20",
    points: 52,
  },
  {
    empId: 32,
    name: "Stream Processing Knowledge Share",
    category: "Knowledge Sharing",
    date: "2025-03-28",
    points: 32,
  },
  {
    empId: 32,
    name: "Open Source: Apache Flink connector",
    category: "Open Source",
    date: "2025-01-30",
    points: 48,
  },
  {
    empId: 32,
    name: "Data Mesh Innovation Initiative",
    category: "Innovation",
    date: "2025-09-05",
    points: 56,
  },
  {
    empId: 32,
    name: "Mentored Data Engineers",
    category: "Mentoring",
    date: "2025-07-17",
    points: 36,
  },

  // Gregor Müller (33)
  {
    empId: 33,
    name: "SRE Incident Management Workshop",
    category: "Public Speaking",
    date: "2025-06-11",
    points: 60,
  },
  {
    empId: 33,
    name: "SLO/SLI Knowledge Share",
    category: "Education",
    date: "2025-04-03",
    points: 40,
  },
  {
    empId: 33,
    name: "Open Source: Prometheus exporter",
    category: "University Partnership",
    date: "2025-02-09",
    points: 44,
  },
  {
    empId: 33,
    name: "Error Budget Innovation Framework",
    category: "University Partnership",
    date: "2025-08-28",
    points: 52,
  },
  {
    empId: 33,
    name: "Reliability Mentorship Program",
    category: "Education",
    date: "2025-10-23",
    points: 48,
  },
];

// Remap legacy categories to the three canonical ones
ACTIVITIES.forEach((a) => {
  const map = {
    "Knowledge Sharing": "Education",
    Writing: "Education",
    Mentoring: "Education",
    "Open Source": "University Partnership",
    Innovation: "University Partnership",
  };
  if (map[a.category]) a.category = map[a.category];
});

// ─────────────────────────────────────────────
//  CATEGORY METADATA
// ─────────────────────────────────────────────

const CATEGORY_META = {
  Education: {
    label: "Education",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  },
  "Public Speaking": {
    label: "Public Speaking",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  },
  "University Partnership": {
    label: "University Partnership",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  },
};

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function avatarColor(name) {
  const palette = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  return palette[Math.abs(h) % palette.length];
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(isoStr) {
  const [y, m, d] = isoStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

function quarterOfDate(isoStr) {
  const month = parseInt(isoStr.split("-")[1], 10);
  return Math.ceil(month / 3);
}

function yearOfDate(isoStr) {
  return isoStr.split("-")[0];
}

function catClass(category) {
  return "cat-" + category.toLowerCase().replace(/\s+/g, "-");
}

// ─────────────────────────────────────────────
//  POPULATE FILTERS
// ─────────────────────────────────────────────

(function populateFilters() {
  const years = [...new Set(ACTIVITIES.map((a) => yearOfDate(a.date)))].sort();
  const yearSel = document.getElementById("filter-year");
  years.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  });

  const cats = [...new Set(ACTIVITIES.map((a) => a.category))].sort();
  const catSel = document.getElementById("filter-category");
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    catSel.appendChild(opt);
  });
})();

// ─────────────────────────────────────────────
//  FILTER + SORT
// ─────────────────────────────────────────────

function getFilters() {
  return {
    year: document.getElementById("filter-year").value,
    quarter: document.getElementById("filter-quarter").value,
    category: document.getElementById("filter-category").value,
    search: document.getElementById("search-input").value.trim().toLowerCase(),
  };
}

function applyFilters({ year, quarter, category, search }) {
  return EMPLOYEES.filter(
    (emp) => !search || emp.name.toLowerCase().includes(search),
  )
    .map((emp) => {
      const acts = ACTIVITIES.filter((a) => {
        if (a.empId !== emp.id) return false;
        if (year && yearOfDate(a.date) !== year) return false;
        if (quarter && String(quarterOfDate(a.date)) !== quarter) return false;
        if (category && a.category !== category) return false;
        return true;
      });
      const totalPoints = acts.reduce((s, a) => s + a.points, 0);
      return { ...emp, acts, totalPoints };
    })
    .filter((e) => e.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

// ─────────────────────────────────────────────
//  RENDER PODIUM
// ─────────────────────────────────────────────

const PODIUM_ORDER = ["second", "first", "third"];
const PODIUM_RANKS = [2, 1, 3];
const PODIUM_BADGE_CLASS = ["silver", "gold", "bronze"];
const PODIUM_BLOCK_NUM = ["2", "1", "3"];

function renderPodium(sorted) {
  const podium = document.getElementById("podium");
  podium.innerHTML = "";

  const top = sorted.slice(0, 3);
  if (top.length === 0) return;

  // Slot ordering: second (idx1), first (idx0), third (idx2)
  const slots = [
    { data: top[1], slotClass: "second", badgeClass: "silver", numLabel: "2" },
    { data: top[0], slotClass: "first", badgeClass: "gold", numLabel: "1" },
    { data: top[2], slotClass: "third", badgeClass: "bronze", numLabel: "3" },
  ];

  slots.forEach(({ data, slotClass, badgeClass, numLabel }) => {
    if (!data) return;
    const slot = document.createElement("div");
    slot.className = `podium-slot ${slotClass}`;

    slot.innerHTML = `
      <div class="podium-info">
        <div class="podium-avatar-wrap">
          <div class="avatar" style="background:${avatarColor(data.name)}">${initials(data.name)}</div>
          <div class="rank-badge ${badgeClass}">${numLabel}</div>
        </div>
        <div class="podium-name">${data.name}</div>
        <div class="podium-title">${data.title}</div>
        <div class="podium-score">
          <span class="star">★</span>
          <span>${data.totalPoints}</span>
        </div>
      </div>
      <div class="podium-block">
        <span class="podium-block-num">${numLabel}</span>
      </div>
    `;
    podium.appendChild(slot);
  });
}

// ─────────────────────────────────────────────
//  RENDER RANKED LIST
// ─────────────────────────────────────────────

const chevronIcon = `<svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>`;

function renderList(sorted) {
  const list = document.getElementById("ranked-list");
  list.innerHTML = "";

  if (sorted.length === 0) {
    list.innerHTML = `<div class="empty-state">No employees match the selected filters.</div>`;
    return;
  }

  sorted.forEach((emp, idx) => {
    const card = document.createElement("div");
    card.className = "emp-card";

    const actRows = emp.acts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(
        (a) => `
        <tr>
          <td class="col-activity">${a.name}</td>
          <td class="col-category"><span class="cat-pill" title="${a.category}">${CATEGORY_META[a.category]?.icon ?? ""}${a.category}</span></td>
          <td class="col-date">${formatDate(a.date)}</td>
          <td class="col-points points-cell">+${a.points}</td>
        </tr>
      `,
      )
      .join("");

    card.innerHTML = `
      <div class="emp-row">
        <div class="emp-rank">${idx + 1}</div>
        <div class="avatar sm" style="background:${avatarColor(emp.name)}">${initials(emp.name)}</div>
        <div class="emp-info">
          <div class="emp-name">${emp.name}</div>
          <div class="emp-title">${emp.title} (${emp.dept})</div>
        </div>
        <div class="emp-meta">
          ${Object.entries(CATEGORY_META)
            .map(([cat, meta]) => {
              const count = emp.acts.filter((a) => a.category === cat).length;
              if (count === 0) return "";
              return `<div class="cat-count-item" title="${meta.label}">${meta.icon}<span>${count}</span></div>`;
            })
            .join("")}
        </div>
        <div class="emp-total">
          <span class="total-label">TOTAL</span>
          <span class="star">★</span>
          <span>${emp.totalPoints}</span>
        </div>
        ${chevronIcon}
      </div>
      <div class="activity-panel">
        <div class="activity-label">RECENT ACTIVITY</div>
        <table class="activity-table">
          <thead>
            <tr>
              <th class="col-activity">ACTIVITY</th>
              <th class="col-category">CATEGORY</th>
              <th class="col-date">DATE</th>
              <th class="col-points">POINTS</th>
            </tr>
          </thead>
          <tbody>${actRows}</tbody>
        </table>
      </div>
    `;

    card.querySelector(".emp-row").addEventListener("click", () => {
      card.classList.toggle("open");
    });

    list.appendChild(card);
  });
}

// ─────────────────────────────────────────────
//  MAIN RENDER
// ─────────────────────────────────────────────

function render() {
  const filters = getFilters();
  const sorted = applyFilters(filters);
  renderPodium(sorted);
  renderList(sorted);
}

// ─────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────

["filter-year", "filter-quarter", "filter-category"].forEach((id) => {
  document.getElementById(id).addEventListener("change", render);
});
document.getElementById("search-input").addEventListener("input", render);

// Initial render
render();
