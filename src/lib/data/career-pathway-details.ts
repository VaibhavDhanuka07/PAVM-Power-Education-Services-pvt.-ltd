export type CareerPathwayDetail = {
  brief: string;
  whoShouldChoose: string[];
  outcomes: string[];
  roadmap: Array<{
    phase: string;
    detail: string;
  }>;
  supportIncludes: string[];
};

const defaultDetail: CareerPathwayDetail = {
  brief:
    "This integrated track combines coaching preparation with a recognized degree pathway so learners can build academic credibility and career readiness together.",
  whoShouldChoose: [
    "Students who want one guided roadmap for degree + exam prep.",
    "Working learners who need structured milestone planning.",
    "Aspirants seeking higher career confidence before final specialization.",
  ],
  outcomes: [
    "Stronger exam-readiness with parallel academic progress.",
    "Clear admission, documentation, and semester planning support.",
    "A portfolio that combines qualification, concepts, and applied practice.",
  ],
  roadmap: [
    { phase: "Foundation", detail: "Academic onboarding, core subject bridge modules, and coaching orientation." },
    { phase: "Acceleration", detail: "Weekly exam-prep cycles with degree coursework and guided doubt support." },
    { phase: "Career Readiness", detail: "Mock assessments, profile building, and final counselling for next step decisions." },
  ],
  supportIncludes: [
    "Dedicated pathway counsellor and progress checkpoints",
    "Mode-wise university shortlisting and admission guidance",
    "Timeline alerts for exams, semesters, and document submissions",
  ],
};

export const careerPathwayDetails: Record<string, CareerPathwayDetail> = {
  "upsc-career-pathway": {
    brief:
      "A long-horizon pathway built for civil services aspirants who want continuous UPSC preparation while completing graduation and post-graduation without academic gaps.",
    whoShouldChoose: [
      "UPSC aspirants who want a stable Plan A + Plan B structure.",
      "Students targeting public policy, governance, and administrative careers.",
      "Learners who need disciplined year-wise mentoring and timeline planning.",
    ],
    outcomes: [
      "Improved UPSC attempt readiness with concept-first preparation.",
      "Recognized UG + PG degree continuity for long-term career security.",
      "Stronger writing, policy analysis, and interview communication ability.",
    ],
    roadmap: [
      { phase: "Year 1-2", detail: "NCERT + base syllabus coverage, answer writing basics, and graduation core coursework." },
      { phase: "Year 3-4", detail: "Optional subject depth, mains-focused practice, and postgraduate academic specialization." },
      { phase: "Year 5", detail: "Prelims-mains simulation, interview mentoring, and final attempt planning." },
    ],
    supportIncludes: [
      "UPSC-aligned study planner with revision calendar",
      "Degree selection guidance based on optional and interest areas",
      "Interview-prep and documentation support for academic continuity",
    ],
  },
  "chartered-accountant-pathway": {
    brief:
      "Designed for commerce-focused aspirants, this pathway aligns CA coaching milestones with bachelor degree progress to avoid preparation conflicts and exam overload.",
    whoShouldChoose: [
      "Students targeting CA with BCom/BBA/BA commerce relevance.",
      "Aspirants who want audit, taxation, and finance career depth early.",
      "Learners looking for guided attempt strategy with academic backup.",
    ],
    outcomes: [
      "Balanced CA preparation with academic performance consistency.",
      "Practical understanding of accounts, tax, compliance, and reporting.",
      "Higher employability for finance, audit, and consulting entry roles.",
    ],
    roadmap: [
      { phase: "Foundation Stage", detail: "CA base modules, accounting fundamentals, and semester discipline setup." },
      { phase: "Intermediate Stage", detail: "Tax, law, costing depth with parallel university coursework and assessments." },
      { phase: "Final Stage", detail: "Advanced revision, mock exam cycles, and profile positioning for internships/roles." },
    ],
    supportIncludes: [
      "CA coaching calendar synced with university exam windows",
      "Subject prioritization and attempt strategy counselling",
      "Progress reviews for weak-area correction and performance tracking",
    ],
  },
  "company-secretary-pathway": {
    brief:
      "A governance-first pathway that combines CS preparation with bachelor-level academic development for students targeting corporate law, compliance, and secretarial practice.",
    whoShouldChoose: [
      "Students interested in corporate governance and legal compliance.",
      "Aspirants planning CS milestones with a structured academic track.",
      "Learners targeting compliance, secretarial, or advisory roles.",
    ],
    outcomes: [
      "Strong fundamentals in company law, governance, and compliance systems.",
      "Bachelor qualification plus CS-prep progress for better role fit.",
      "Confidence for corporate legal and secretarial job pathways.",
    ],
    roadmap: [
      { phase: "Core Preparation", detail: "Business law basics, communication writing, and degree subject mapping." },
      { phase: "Governance Depth", detail: "Corporate law frameworks, compliance practice, and applied case analysis." },
      { phase: "Professional Readiness", detail: "Exam simulations, legal drafting practice, and role-specific counselling." },
    ],
    supportIncludes: [
      "CS aligned roadmap with university semester timeline",
      "Compliance-focused mentoring and attempt planning",
      "Career guidance for governance and corporate secretarial domains",
    ],
  },
  "advanced-finance-pathway": {
    brief:
      "This premium finance track blends CPA + CMA preparation with MBA/MCom to build global accounting, strategy, and management capability for high-growth finance careers.",
    whoShouldChoose: [
      "Professionals targeting global accounting and finance roles.",
      "Students planning advanced credentials with management depth.",
      "Aspirants pursuing finance analytics, FP&A, or consulting tracks.",
    ],
    outcomes: [
      "Global finance literacy with management-level business context.",
      "Readiness for leadership pathways in accounting and strategy teams.",
      "Better profile value for multinational and cross-border roles.",
    ],
    roadmap: [
      { phase: "Finance Core", detail: "Accounting standards, financial statement analysis, and quantitative foundations." },
      { phase: "Advanced Track", detail: "CPA/CMA competency modules with MBA/MCom functional specialization." },
      { phase: "Global Career Prep", detail: "Case-led application, interview readiness, and role-mapped guidance." },
    ],
    supportIncludes: [
      "Global certification planning with academic alignment",
      "Fee + timeline counselling for multi-stage preparation",
      "Career positioning for domestic and international finance pathways",
    ],
  },
  "engineering-research-pathway": {
    brief:
      "A technical pathway for aspirants preparing for GATE while pursuing MCA/MSc, with focus on deep problem-solving, research exposure, and advanced domain mastery.",
    whoShouldChoose: [
      "Graduates targeting GATE and higher technical specialization.",
      "Students interested in research-driven tech careers.",
      "Aspirants planning transition into advanced engineering or analytics roles.",
    ],
    outcomes: [
      "Improved technical depth and structured GATE performance readiness.",
      "Advanced academic qualification with practical project orientation.",
      "Career flexibility across research, engineering, and specialist roles.",
    ],
    roadmap: [
      { phase: "Concept Reinforcement", detail: "Core technical revision, mathematics strengthening, and academic onboarding." },
      { phase: "Problem Solving", detail: "GATE-level test drills with project-based MCA/MSc learning integration." },
      { phase: "Research and Transition", detail: "Mock assessments, specialization counselling, and next-step planning." },
    ],
    supportIncludes: [
      "Technical mentor checkpoints and topic-wise progress insights",
      "Research-oriented degree pathway planning",
      "Exam strategy support and academic scheduling assistance",
    ],
  },
  "chartered-accountant-advanced-pathway": {
    brief:
      "An advanced CA-integrated postgraduate pathway for learners who want deeper strategic and managerial capability alongside professional accounting progression.",
    whoShouldChoose: [
      "Graduates preparing for advanced finance and strategy roles.",
      "CA aspirants who want MBA/MCom/MA depth in parallel.",
      "Professionals seeking stronger profile differentiation in finance careers.",
    ],
    outcomes: [
      "Professional accounting preparation with managerial decision ability.",
      "Postgraduate qualification that strengthens role mobility.",
      "Improved readiness for consulting, audit, and finance leadership paths.",
    ],
    roadmap: [
      { phase: "Postgraduate Foundation", detail: "Advanced business concepts and CA-aligned subject planning." },
      { phase: "Professional Integration", detail: "Exam cycle preparation with applied management and finance modules." },
      { phase: "Leadership Positioning", detail: "Case portfolios, mock interviews, and role-specific career counselling." },
    ],
    supportIncludes: [
      "Integrated CA + PG schedule design",
      "Academic + professional milestone monitoring",
      "Counselling support for specialization and role targeting",
    ],
  },
  "company-secretary-advanced-pathway": {
    brief:
      "A postgraduate governance and compliance pathway that combines CS preparation with advanced degree options for corporate policy, legal operations, and strategic governance roles.",
    whoShouldChoose: [
      "Graduates targeting senior compliance and governance pathways.",
      "CS aspirants seeking postgraduate depth with career clarity.",
      "Learners aiming for legal-policy and board support functions.",
    ],
    outcomes: [
      "Advanced governance and legal-compliance capability.",
      "Stronger decision-making and reporting skill for corporate contexts.",
      "Higher readiness for compliance, governance, and policy-facing roles.",
    ],
    roadmap: [
      { phase: "Governance Core", detail: "Corporate law depth, policy frameworks, and postgraduate subject alignment." },
      { phase: "Compliance Execution", detail: "CS preparation sprint with drafting, reporting, and applied casework." },
      { phase: "Strategic Readiness", detail: "Interview mentoring, communication refinement, and progression planning." },
    ],
    supportIncludes: [
      "CS + postgraduate progression roadmap",
      "Compliance documentation and learning support",
      "Career counselling for governance and legal operations profiles",
    ],
  },
};

export function getCareerPathwayDetail(slug: string): CareerPathwayDetail {
  return careerPathwayDetails[slug] ?? defaultDetail;
}
