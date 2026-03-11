export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  course_interest: string;
  message: string;
};

export type LeadScoreResult = {
  score: number;
  grade: "Hot" | "Warm" | "Cold";
  assignedCounsellor: string;
  followUpPlan: string[];
};

const COUNSELLORS = [
  "Anita Sharma",
  "Rahul Verma",
  "Priya Mehta",
  "Sandeep Kumar",
];

function containsAny(value: string, keywords: string[]) {
  const v = value.toLowerCase();
  return keywords.some((k) => v.includes(k));
}

export function scoreLead(input: LeadInput): LeadScoreResult {
  let score = 30;
  const text = `${input.course_interest} ${input.message}`.toLowerCase();

  if (containsAny(text, ["admission", "apply", "enroll", "enrol"])) score += 20;
  if (containsAny(text, ["fees", "budget", "emi", "scholarship"])) score += 15;
  if (containsAny(text, ["today", "urgent", "asap", "immediately"])) score += 20;
  if (containsAny(text, ["mba", "bba", "bca", "mca", "distance", "online", "regular", "vocational", "skill"])) score += 10;
  if (input.phone.replace(/\D/g, "").length >= 10) score += 5;

  score = Math.min(100, score);
  const grade = score >= 75 ? "Hot" : score >= 50 ? "Warm" : "Cold";
  const assignedCounsellor = COUNSELLORS[score % COUNSELLORS.length];

  const followUpPlan =
    grade === "Hot"
      ? ["Immediate WhatsApp intro", "Call within 15 minutes", "Share shortlist in 1 hour"]
      : grade === "Warm"
        ? ["WhatsApp intro in 1 hour", "Call within 6 hours", "Reminder next morning"]
        : ["Email program guide", "WhatsApp follow-up in 24 hours", "Call in 48 hours"];

  return { score, grade, assignedCounsellor, followUpPlan };
}

