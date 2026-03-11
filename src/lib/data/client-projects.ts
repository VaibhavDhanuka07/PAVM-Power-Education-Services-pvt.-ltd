export type ClientProject = {
  slug: string;
  title: string;
  client_name: string;
  client_type: "University" | "Education Group" | "Corporate";
  industry: string;
  year: string;
  logo: string;
  scope: string;
  impact: string;
  highlight: string;
};

export const clientProjects: ClientProject[] = [
  {
    slug: "mangalayatan-digital-admissions-suite",
    title: "Digital Admissions Experience",
    client_name: "Mangalayatan University",
    client_type: "University",
    industry: "Higher Education",
    year: "2025",
    logo: "/logos/universities/mangalayatan-university.jpeg",
    scope: "Admission funnel design, program listing architecture, lead routing",
    impact: "Improved enquiry-to-counselling conversion with structured program journeys",
    highlight: "Admissions Flow Optimization",
  },
  {
    slug: "noida-international-lead-automation",
    title: "Lead Automation and Program Discovery",
    client_name: "Noida International University",
    client_type: "University",
    industry: "Higher Education",
    year: "2025",
    logo: "/logos/universities/noida-international-university.jpeg",
    scope: "Program filtering UX, lead capture, campaign landing pages",
    impact: "Higher quality inbound leads with mode-wise and fee-wise discovery",
    highlight: "Lead Quality Upgrade",
  },
  {
    slug: "suresh-gyan-vihar-online-brand-page",
    title: "Online Program Brand Showcase",
    client_name: "Suresh Gyan Vihar University",
    client_type: "University",
    industry: "Online Education",
    year: "2025",
    logo: "/logos/universities/suresh-gyan-vihar-university.jpeg",
    scope: "Course storytelling, fee communication, counselling CTA systems",
    impact: "Stronger student trust through transparent program and fee communication",
    highlight: "Brand + Conversion",
  },
  {
    slug: "dr-preeti-global-multi-program-rollout",
    title: "Multi-Program Discovery Rollout",
    client_name: "Dr Preeti Global University",
    client_type: "University",
    industry: "Higher Education",
    year: "2026",
    logo: "/logos/universities/dr-preeti-global-university.jpeg",
    scope: "Program taxonomy, admissions-ready content structure, SEO routing",
    impact: "Better navigation for UG/PG pathways and higher page engagement",
    highlight: "Program Architecture",
  },
  {
    slug: "glocal-vocational-skill-ecosystem",
    title: "Vocational + Skill Ecosystem Interface",
    client_name: "Glocal University",
    client_type: "University",
    industry: "Vocational & Skill Education",
    year: "2026",
    logo: "/logos/universities/glocal-university.jpeg",
    scope: "Domain-based catalogs, level bundling (certificate/diploma/degree)",
    impact: "Simplified browsing for large skill inventories and reduced confusion",
    highlight: "Skill Catalog Simplification",
  },
  {
    slug: "coer-regular-program-visibility",
    title: "Regular Program Visibility Upgrade",
    client_name: "COER University",
    client_type: "University",
    industry: "Regular Higher Education",
    year: "2026",
    logo: "/logos/universities/coer-university.jpeg",
    scope: "Mode segmentation, course intent pages, consultation-first funnels",
    impact: "Improved discoverability of regular programs and counselling requests",
    highlight: "Visibility + Discovery",
  },
  {
    slug: "rayat-bahra-admission-journey-design",
    title: "Admission Journey Design",
    client_name: "Rayat Bahra University",
    client_type: "University",
    industry: "Higher Education",
    year: "2026",
    logo: "/logos/universities/rayat-bahra-university.jpeg",
    scope: "Student-first inquiry journey, admission checkpoints, UI revamp",
    impact: "Smoother form completion and clearer status tracking experience",
    highlight: "Student Experience",
  },
  {
    slug: "bharati-vidyapeeth-counselling-pages",
    title: "Counselling-Centric Program Pages",
    client_name: "Bharati Vidyapeeth University",
    client_type: "University",
    industry: "Online & Distance Education",
    year: "2026",
    logo: "/logos/universities/bharati-vidyapeeth-university.jpeg",
    scope: "Program pages, trust badges, compare-ready content blocks",
    impact: "More informed enquiries and better decision confidence for applicants",
    highlight: "Trust and Guidance",
  },
];
