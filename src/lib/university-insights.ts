type UniversityInsight = {
  approvals: string[];
  placementSupport: string;
  eligibility: string;
  duration: string;
  brochureCta: string;
};

const DEFAULT_INSIGHT: UniversityInsight = {
  approvals: ["UGC", "NAAC", "AICTE*"],
  placementSupport: "Career counselling + placement assistance",
  eligibility: "10+2 for UG, Graduation for PG",
  duration: "1 to 4 years (program dependent)",
  brochureCta: "Get detailed counselling for latest eligibility and seat availability",
};

const UNIVERSITY_INSIGHTS: Record<string, Partial<UniversityInsight>> = {
  "mangalayatan-university": {
    approvals: ["UGC", "AICTE", "NAAC A+"],
    placementSupport: "Placement cell + interview prep support",
  },
  "noida-international-university": {
    approvals: ["UGC", "AICTE", "NAAC"],
    placementSupport: "Corporate tie-ups + employability training",
  },
  "bharati-vidyapeeth-university": {
    approvals: ["UGC", "NAAC", "DEB"],
    placementSupport: "Industry mentor sessions + placement support",
  },
  "glocal-university": {
    approvals: ["UGC", "Skill-domain alignment"],
    placementSupport: "Skill-based placement and apprenticeship support",
    eligibility: "Varies by vocational and skill track",
  },
  "dr-preeti-global-university": {
    approvals: ["UGC"],
    placementSupport: "Counselling and career support cell",
  },
};

export function getUniversityInsight(slug: string): UniversityInsight {
  const override = UNIVERSITY_INSIGHTS[slug] ?? {};
  return {
    ...DEFAULT_INSIGHT,
    ...override,
  };
}

