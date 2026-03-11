import { slugify } from "@/lib/utils";

function normalizeDuration(duration: string) {
  const d = duration.toLowerCase();
  const yearMatch = d.match(/(\d+)\s*year/);
  if (yearMatch) {
    const years = Number(yearMatch[1]);
    return {
      years,
      semesters: Math.max(2, years * 2),
      label: `${years} year${years > 1 ? "s" : ""}`,
    };
  }

  const monthMatch = d.match(/(\d+)\s*month/);
  if (monthMatch) {
    const months = Number(monthMatch[1]);
    const years = Number((months / 12).toFixed(2));
    const semesters = months <= 6 ? 1 : 2;
    return {
      years,
      semesters,
      label: `${months} month${months > 1 ? "s" : ""}`,
    };
  }

  return {
    years: 1,
    semesters: 2,
    label: duration,
  };
}

export function getFeeBreakdown(modeName: string | undefined, totalFees: number, duration: string) {
  const modeSlug = slugify(modeName ?? "");
  if (modeSlug === "regular") {
    return {
      totalLabel: "Contact Option",
      perYearLabel: "Contact Option",
      perSemesterLabel: "Contact Option",
    };
  }

  if (!totalFees || totalFees <= 0) {
    return {
      totalLabel: "On request",
      perYearLabel: "On request",
      perSemesterLabel: "On request",
    };
  }

  const parsed = normalizeDuration(duration);
  const perYear = parsed.years > 0 ? Math.round(totalFees / parsed.years) : totalFees;
  const perSemester = parsed.semesters > 0 ? Math.round(totalFees / parsed.semesters) : totalFees;

  const fmt = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;
  return {
    totalLabel: fmt(totalFees),
    perYearLabel: fmt(perYear),
    perSemesterLabel: fmt(perSemester),
  };
}

export function getDetailedCourseContent({
  courseName,
  sectorName,
  modeName,
  duration,
}: {
  courseName: string;
  sectorName: string;
  modeName: string;
  duration: string;
}) {
  type DomainProfile = {
    overviewFocus: string[];
    learn: string[];
    curriculum: string[];
    outcomes: string[];
  };
  type TrackProfile = {
    overview: string[];
    learn: string[];
    curriculum: string[];
    outcomes: string[];
  };

  const byDomain: Record<string, DomainProfile> = {
    management: {
      overviewFocus: [
        "business strategy, operations, and organizational decision-making",
        "leadership, team management, and execution planning",
        "finance-marketing-HR integration for real business contexts",
      ],
      learn: [
        "business models, value chains, and market positioning",
        "KPI design, reporting dashboards, and decision analysis",
        "HR and people performance systems",
        "marketing funnels, brand communication, and campaign planning",
        "financial interpretation for managerial decisions",
      ],
      curriculum: [
        "principles of management and managerial economics",
        "operations, supply chain, and project management",
        "organizational behavior and business communication",
        "strategic management and capstone business simulation",
      ],
      outcomes: [
        "readiness for analyst, coordinator, and management trainee roles",
        "confidence in presenting business plans and execution roadmaps",
      ],
    },
    "computing-and-information-technology": {
      overviewFocus: [
        "software fundamentals, data workflows, and applied technology execution",
        "problem solving through programming and systems thinking",
        "industry-aligned development practices for modern digital roles",
      ],
      learn: [
        "programming logic, algorithms, and debugging fundamentals",
        "database design, query optimization, and data handling",
        "web and application architecture basics",
        "testing, version control, and deployment workflows",
        "cybersecurity fundamentals and secure development practices",
      ],
      curriculum: [
        "core programming modules with practical lab assignments",
        "data structures, database management, and APIs",
        "software engineering lifecycle and quality assurance",
        "mini-projects and final industry-oriented capstone",
      ],
      outcomes: [
        "readiness for developer, support, QA, and data associate roles",
        "portfolio-ready projects that strengthen interview performance",
      ],
    },
    agriculture: {
      overviewFocus: [
        "modern cultivation methods, farm productivity, and agri-business basics",
        "soil-health-water-crop alignment for sustainable output",
        "value-addition and market linkage for agricultural products",
      ],
      learn: [
        "crop planning, seed selection, and seasonal scheduling",
        "soil and water management for efficient production",
        "pest and disease control practices",
        "post-harvest handling and quality maintenance",
        "agri-economics, costing, and basic farm enterprise planning",
      ],
      curriculum: [
        "crop science and practical field modules",
        "irrigation, nutrient management, and farm tools",
        "horticulture / allied-agri specialization tracks",
        "field project with productivity and yield analysis",
      ],
      outcomes: [
        "capability to manage farm operations and agri support roles",
        "improved readiness for agri-tech and agri-business pathways",
      ],
    },
    "banking-and-finance": {
      overviewFocus: [
        "financial systems, accounting workflows, and compliance fundamentals",
        "banking operations and risk-aware decision practices",
        "industry-aligned finance skills for corporate and service sectors",
      ],
      learn: [
        "financial accounting, statements, and reporting interpretation",
        "banking products, credit basics, and lending workflows",
        "taxation, compliance, and documentation processes",
        "financial analysis and planning methods",
        "customer-facing financial advisory communication",
      ],
      curriculum: [
        "accounting and finance foundation modules",
        "banking operations and regulatory awareness",
        "financial tools, reporting, and case analysis",
        "applied finance project and assessment",
      ],
      outcomes: [
        "readiness for banking operations, accounts, and finance support roles",
        "confidence in handling financial documentation and analysis tasks",
      ],
    },
    media: {
      overviewFocus: [
        "content creation, storytelling, and digital publishing ecosystems",
        "journalism ethics, communication frameworks, and audience strategy",
        "practical media production and editorial decision-making",
      ],
      learn: [
        "news writing, scripting, and content structuring",
        "reporting workflows and source validation fundamentals",
        "social media distribution and content performance basics",
        "video/audio production fundamentals",
        "brand, PR, and communication planning basics",
      ],
      curriculum: [
        "media theory and communication models",
        "journalism writing labs and production assignments",
        "digital media tools and content publishing",
        "portfolio-oriented media project",
      ],
      outcomes: [
        "readiness for content, media, communication, and PR entry roles",
        "practical portfolio that supports internships and placements",
      ],
    },
    "hotel-management": {
      overviewFocus: [
        "service excellence, hospitality operations, and guest management",
        "front office, housekeeping, and food service coordination",
        "customer-centric execution for hospitality careers",
      ],
      learn: [
        "guest handling and hospitality communication protocols",
        "front office systems and reservation processes",
        "food and beverage service standards",
        "housekeeping quality systems and audits",
        "event and property-level operations support",
      ],
      curriculum: [
        "hospitality foundation and service behavior modules",
        "department-wise operational training",
        "service quality and complaint resolution practices",
        "operations project with SOP-based execution",
      ],
      outcomes: [
        "readiness for hotel operations, F&B, and guest service roles",
        "strong service delivery and customer experience mindset",
      ],
    },
    aviation: {
      overviewFocus: [
        "airport workflows, passenger handling, and aviation service systems",
        "ground operations and travel documentation processes",
        "service discipline and safety-first operational behavior",
      ],
      learn: [
        "airport terminal operations and passenger lifecycle",
        "ticketing, fares, and travel documentation basics",
        "ground staff coordination and escalation handling",
        "safety, compliance, and service quality essentials",
        "communication standards for aviation environments",
      ],
      curriculum: [
        "aviation foundation modules and industry orientation",
        "airport and airline process labs",
        "customer service and documentation training",
        "scenario-based operational project",
      ],
      outcomes: [
        "readiness for airport, airline support, and ticketing roles",
        "confidence in service, compliance, and operational communication",
      ],
    },
    "technical-training": {
      overviewFocus: [
        "hands-on technical execution with safety and quality control",
        "tool-based practical competency for field and workshop roles",
        "industry-focused skill training aligned to real job tasks",
      ],
      learn: [
        "equipment handling and preventive maintenance basics",
        "safety protocols and operational checklists",
        "quality inspection and reporting methods",
        "troubleshooting techniques for common technical faults",
        "workflow planning for shop-floor or field execution",
      ],
      curriculum: [
        "foundation technical modules and safety training",
        "lab/workshop practical exercises",
        "specialization practice with supervised assignments",
        "final practical assessment project",
      ],
      outcomes: [
        "readiness for technician, operator, and maintenance roles",
        "higher confidence in practical troubleshooting and execution",
      ],
    },
    "mental-health": {
      overviewFocus: [
        "wellness, counseling foundations, and ethical helping practices",
        "mental health support frameworks and referral awareness",
        "communication-first care approach for community and clinical settings",
      ],
      learn: [
        "mental wellness concepts and behavioral indicators",
        "active listening and empathetic communication techniques",
        "basic counseling frameworks and case note practices",
        "crisis sensitivity and escalation protocol awareness",
        "self-care and professional boundary management",
      ],
      curriculum: [
        "mental health foundations and applied psychology basics",
        "counseling communication skill labs",
        "case-based learning and role-play assessments",
        "community wellness project",
      ],
      outcomes: [
        "readiness for support, outreach, and wellness-assistant roles",
        "improved people support communication and documentation quality",
      ],
    },
    law: {
      overviewFocus: [
        "legal fundamentals, procedural understanding, and case analysis",
        "statutory interpretation with practical legal communication",
        "application-focused legal learning for professional pathways",
      ],
      learn: [
        "legal terminology, structure, and judicial system basics",
        "case reading and legal reasoning methods",
        "drafting fundamentals and legal documentation basics",
        "ethics, compliance, and professional legal conduct",
      ],
      curriculum: [
        "constitutional and foundational legal modules",
        "procedural law and case-method practice",
        "drafting / mooting-oriented practical work",
        "capstone legal analysis project",
      ],
      outcomes: [
        "readiness for legal support, research, and documentation roles",
        "stronger analytical writing and legal interpretation skills",
      ],
    },
  };

  const byMode: Record<string, TrackProfile> = {
    online: {
      overview: [
        "flexible learning with structured digital delivery",
        "self-paced revision supported by scheduled assessments",
      ],
      learn: [
        "how to learn effectively in digital learning environments",
        "online collaboration, remote project communication, and presentation",
      ],
      curriculum: [
        "LMS-oriented learning flow with module checkpoints",
        "continuous assignments designed for remote evaluation",
      ],
      outcomes: [
        "ability to balance learning with work/personal schedules",
        "confidence in digital-first academic and professional workflows",
      ],
    },
    distance: {
      overview: [
        "high flexibility for learners who need self-managed schedules",
        "concept mastery through structured study blocks and periodic evaluation",
      ],
      learn: [
        "self-directed learning planning and progress discipline",
        "strong conceptual revision and exam-focused preparation methods",
      ],
      curriculum: [
        "term-wise study planning with milestone-based completion",
        "assessment preparation framework for distance learners",
      ],
      outcomes: [
        "strong independent learning ability for higher education pathways",
        "improved discipline and consistency in long-cycle programs",
      ],
    },
    vocational: {
      overview: [
        "hands-on skill training focused on employability and execution",
        "domain practice aligned to real workplace tasks",
      ],
      learn: [
        "practical job-role skills with workshop/lab orientation",
        "SOP-led execution and task-level quality standards",
      ],
      curriculum: [
        "practice-heavy modules with demonstrable competencies",
        "industry-use case assignments and applied assessments",
      ],
      outcomes: [
        "job-readiness for field, technical, and service roles",
        "faster transition from training to practical work environments",
      ],
    },
    "skill-certification": {
      overview: [
        "short-duration focused learning for targeted skills",
        "quick upskilling for role transition or capability enhancement",
      ],
      learn: [
        "tool-level competence and practical micro-skills",
        "rapid implementation methods for immediate workplace relevance",
      ],
      curriculum: [
        "compact modules with direct practical outcomes",
        "skill checkpoints and short-cycle assessments",
      ],
      outcomes: [
        "immediate skill visibility for jobs or freelancing",
        "strong foundation for advanced certification pathways",
      ],
    },
    regular: {
      overview: [
        "comprehensive campus-style academic depth and progression",
        "structured year-wise curriculum with broad foundational coverage",
      ],
      learn: [
        "long-form conceptual depth and discipline-level understanding",
        "holistic academic development with practical and theoretical balance",
      ],
      curriculum: [
        "semester-wise progression from fundamentals to advanced topics",
        "internal, practical, and final evaluation ecosystem",
      ],
      outcomes: [
        "strong base for placements, competitive exams, and higher studies",
        "broad academic maturity and professional preparedness",
      ],
    },
  };

  const byLevel: Record<string, TrackProfile> = {
    ug: {
      overview: ["foundational to intermediate progression for first professional entry"],
      learn: ["core concepts, communication, and employability fundamentals"],
      curriculum: ["foundation-first structure with progressive specialization"],
      outcomes: ["readiness for entry-level roles and future specialization"],
    },
    pg: {
      overview: ["advanced specialization with deeper analytical orientation"],
      learn: ["strategic thinking, advanced frameworks, and domain-level analysis"],
      curriculum: ["advanced modules, case analysis, and high-level project work"],
      outcomes: ["readiness for specialist, analyst, and managerial tracks"],
    },
    diploma: {
      overview: ["applied learning focused on practical execution speed"],
      learn: ["task-driven skills and immediate workplace implementation"],
      curriculum: ["high-practice modules and competency-based evaluation"],
      outcomes: ["quick employability in execution-focused job roles"],
    },
    certificate: {
      overview: ["short and focused skilling for specific capabilities"],
      learn: ["targeted practical competencies with direct applicability"],
      curriculum: ["compact module flow with essential concepts and tools"],
      outcomes: ["fast upskilling for immediate portfolio/job impact"],
    },
    doctoral: {
      overview: ["research-intensive learning with scholarly depth"],
      learn: ["research methods, publication discipline, and thesis development"],
      curriculum: ["methodology, review, advanced inquiry, and dissertation"],
      outcomes: ["expert-level specialization and academic/research readiness"],
    },
  };

  const sectorSlug = slugify(sectorName);
  const fallbackProfile: DomainProfile = {
    overviewFocus: [
      `core principles and practical application in ${sectorName}`,
      "industry-relevant workflow understanding and execution discipline",
      "project-based learning for job-readiness",
    ],
    learn: [
      `foundational concepts of ${sectorName}`,
      "practical tools and applied methods",
      "case-study analysis and problem solving",
      "professional communication and reporting",
      "career-oriented project execution",
    ],
    curriculum: [
      "foundation modules and practical assignments",
      "intermediate application modules and case-based exercises",
      "advanced learning with specialization support",
      "capstone/final project with mentor evaluation",
    ],
    outcomes: [
      `readiness for entry-level and growth roles in ${sectorName}`,
      "improved confidence in practical execution and communication",
    ],
  };

  const nameSlug = slugify(courseName);
  const isLawCourse = nameSlug.includes("llb") || nameSlug.includes("llm") || nameSlug.includes("law");
  const modeSlug = slugify(modeName);

  function detectLevel() {
    if (nameSlug.includes("phd")) return "doctoral";
    if (nameSlug.includes("certificate")) return "certificate";
    if (nameSlug.includes("diploma") || nameSlug.includes("pgdca") || nameSlug.includes("pg-diploma")) return "diploma";
    if (
      nameSlug.startsWith("m-") ||
      nameSlug.startsWith("ma") ||
      nameSlug.startsWith("mba") ||
      nameSlug.startsWith("mca") ||
      nameSlug.startsWith("mcom") ||
      nameSlug.startsWith("msc") ||
      nameSlug.includes("llm") ||
      nameSlug.includes("master")
    ) {
      return "pg";
    }
    return "ug";
  }

  const levelKey = detectLevel();
  const profile = (isLawCourse ? byDomain.law : byDomain[sectorSlug]) ?? fallbackProfile;
  const modeProfile = byMode[modeSlug];
  const levelProfile = byLevel[levelKey];
  const track = `${modeName} ${courseName}`.trim();

  const overview = [
    `${track} is designed as a career-focused program that combines strong theory with practical application in ${sectorName}.`,
    `The course duration is ${duration}, which allows learners to build fundamentals first and then move toward advanced, job-ready capabilities.`,
    `You will learn through structured modules, guided assignments, real-world case studies, and domain-specific problem solving.`,
    `The program emphasizes ${profile.overviewFocus[0]}, ${profile.overviewFocus[1]}, and ${profile.overviewFocus[2]}.`,
    ...(modeProfile?.overview ?? []),
    ...(levelProfile?.overview ?? []),
    `The learning journey is aligned to current industry needs, so students can confidently move to jobs, entrepreneurship, or higher studies.`,
    `Along with subject knowledge, the program also strengthens communication, analytical thinking, digital literacy, and decision-making skills.`,
    `By the end of the program, students are expected to demonstrate professional competency, project execution ability, and practical confidence.`,
  ];

  const whatYouWillLearn = [
    `Core fundamentals of ${sectorName} and how the field works in real organizations`,
    ...profile.learn,
    ...(modeProfile?.learn ?? []),
    ...(levelProfile?.learn ?? []),
    `Hands-on methods to apply concepts to practical tasks and project scenarios`,
    "Professional communication, presentation, and documentation skills",
    "Problem-solving frameworks used in industry workflows",
    "Use of digital tools and reporting methods for academic and career growth",
    "How to analyze case studies and draw data-driven conclusions",
    "Career planning, interview readiness, and profile-building best practices",
    "Ethical and professional standards relevant to the domain",
    "Time management and productivity systems for long-term performance",
    "Capstone/project development from idea to execution",
  ];

  const curriculumHighlights = [
    ...profile.curriculum,
    ...(modeProfile?.curriculum ?? []),
    ...(levelProfile?.curriculum ?? []),
    "Foundation modules to establish conceptual clarity",
    "Intermediate modules focused on application and lab/practice components",
    "Advanced modules with specialization-oriented learning",
    "Assignments, internal assessments, and practical submissions",
    "Domain-specific case studies and scenario-based exercises",
    "Final project/capstone with mentor feedback",
  ];

  const outcomes = [
    ...profile.outcomes,
    ...(modeProfile?.outcomes ?? []),
    ...(levelProfile?.outcomes ?? []),
    `Build readiness for entry-level and growth roles in ${sectorName}`,
    "Develop practical confidence to execute workplace tasks independently",
    "Improve analytical and communication capabilities required by recruiters",
    "Create a stronger academic and professional profile for future opportunities",
    "Gain a clear path for higher education, certifications, or specialization",
  ];

  return {
    overview,
    whatYouWillLearn,
    curriculumHighlights,
    outcomes,
  };
}
