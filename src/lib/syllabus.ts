import { slugify } from "@/lib/utils";

type SyllabusInfo = {
  available: boolean;
  title: string;
  description: string;
  url?: string;
};

export function getSyllabusInfo(modeName?: string): SyllabusInfo {
  const mode = slugify(modeName ?? "");

  if (mode === "vocational") {
    return {
      available: true,
      title: "Vocational Program Syllabus",
      description: "Detailed Diploma, Advanced Diploma, and Bachelor Vocational curriculum with semester-level structure.",
      url: "/brochures/glocal-vocational-syllabus.pdf",
    };
  }

  if (mode === "skill-certification") {
    return {
      available: true,
      title: "Skill Certification Syllabus",
      description: "Domain-wise skill certification curriculum with certificate and diploma outcomes.",
      url: "/brochures/glocal-skill-certification-syllabus.pdf",
    };
  }

  return {
    available: false,
    title: "Course Syllabus",
    description: "For this program, syllabus is shared by counsellor based on university and specialization.",
  };
}

