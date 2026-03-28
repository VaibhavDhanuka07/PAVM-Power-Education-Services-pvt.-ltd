import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreCourseSearchMatch, tokenizeCourseQuery } from "@/lib/course-search";
import { getCourseListings } from "@/lib/queries/courses";
import { getUniversities } from "@/lib/queries/universities";
import { formatCourseFee, slugify } from "@/lib/utils";

const schema = z.object({
  message: z.string().min(2).max(1200),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .max(12)
    .optional(),
});

const MODE_SLUGS = ["online", "distance", "vocational", "skill-certification", "regular"] as const;
const MODE_KEYWORDS: Record<(typeof MODE_SLUGS)[number], string[]> = {
  online: ["online", "ode", "digital"],
  distance: ["distance", "odl", "open learning"],
  vocational: ["vocational", "bvoc", "b voc", "advanced diploma", "diploma"],
  "skill-certification": ["skill", "certification", "certificate", "short course", "short-term"],
  regular: ["regular", "on campus", "on-campus", "offline", "degree college"],
};

const STOPWORDS = new Set([
  "the",
  "is",
  "are",
  "for",
  "and",
  "with",
  "from",
  "that",
  "this",
  "what",
  "which",
  "how",
  "can",
  "you",
  "please",
  "show",
  "best",
  "about",
  "course",
  "courses",
  "university",
  "universities",
  "fees",
  "fee",
  "admission",
]);

function detectMode(query: string): (typeof MODE_SLUGS)[number] | undefined {
  const q = query.toLowerCase();
  for (const mode of MODE_SLUGS) {
    if (MODE_KEYWORDS[mode].some((token) => q.includes(token))) return mode;
  }
  return undefined;
}

function tokenize(query: string) {
  return tokenizeCourseQuery(query).filter((token) => !STOPWORDS.has(token));
}

function scoreText(haystack: string, tokens: string[]) {
  if (!tokens.length) return 0;
  const h = haystack.toLowerCase();
  const haystackTokens = new Set(
    h
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean),
  );
  let score = 0;
  for (const token of tokens) {
    if (token.length <= 3) {
      if (haystackTokens.has(token)) score += 1;
      continue;
    }

    if (h.includes(token)) score += token.length > 5 ? 2 : 1;
  }
  return score;
}

function toModeLabel(slug?: string) {
  if (!slug) return "All modes";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isEducationScoped(query: string) {
  const q = query.toLowerCase();
  const keywords = [
    "course",
    "university",
    "college",
    "admission",
    "fee",
    "fees",
    "eligibility",
    "duration",
    "online",
    "distance",
    "vocational",
    "skill",
    "regular",
    "mba",
    "bba",
    "bca",
    "mca",
    "b.com",
    "bcom",
    "m.a",
    "ma",
    "m.sc",
    "msc",
    "mcom",
    "chemistry",
    "physics",
    "biology",
    "counselling",
  ];
  return keywords.some((keyword) => q.includes(keyword));
}

async function buildDynamicContext(message: string) {
  const mode = detectMode(message);
  const tokens = tokenize(message);

  const [courses, universities] = await Promise.all([
    getCourseListings(mode ? { mode } : {}),
    getUniversities(),
  ]);

  const matchedUniversities = universities
    .map((university) => {
      const modeBoost = mode
        ? university.mode_supported.some((modeName) => slugify(modeName) === mode)
          ? 2
          : 0
        : 0;
      const score =
        modeBoost +
        scoreText(`${university.name} ${university.location} ${university.mode_supported.join(" ")}`, tokens);
      return { university, score };
    })
    .filter((item) => item.score > 0 || tokens.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const matchedCourses = courses
    .map((item) => {
      const score = scoreCourseSearchMatch(item.course, message, { universityNames: item.university_names });
      return { item, score };
    })
    .filter((entry) => entry.score > 0 || tokens.length === 0)
    .sort((a, b) => b.score - a.score || b.item.average_rating - a.item.average_rating)
    .slice(0, 8)
    .map((entry) => entry.item);

  const contextLines = [
    `User selected context mode: ${toModeLabel(mode)}`,
    `Top universities (${matchedUniversities.length}):`,
    ...matchedUniversities.map(
      ({ university }) => `- ${university.name} (${university.location}) | Modes: ${university.mode_supported.join(", ")}`,
    ),
    `Top matching courses (${matchedCourses.length}):`,
    ...matchedCourses.map(
      (course) =>
        `- ${course.course.name} | Mode: ${course.course.mode?.name ?? "-"} | Sector: ${
          course.course.sector?.name ?? "-"
        } | Duration: ${course.course.duration} | Fees: ${formatCourseFee(course.course.mode?.name, course.min_fees)} | Rating: ${
          course.average_rating
        } (${course.review_count} reviews) | Universities: ${course.university_count}`,
    ),
    "Counsellor contact: +91 9266602967 | onlineuniversity2025@gmail.com",
  ];

  return {
    mode,
    matchedCourses,
    matchedUniversities,
    context: contextLines.join("\n"),
  };
}

function buildDynamicFallback(
  message: string,
  data: Awaited<ReturnType<typeof buildDynamicContext>>,
) {
  const { mode, matchedCourses, matchedUniversities } = data;

  if (!isEducationScoped(message)) {
    return "I can help with course selection, university comparison, fee guidance, and admission support for Online, Distance, Vocational, Skill Certification, and Regular programs. Please ask an education-related query.";
  }

  const uniLine =
    matchedUniversities.length > 0
      ? `Top universities: ${matchedUniversities.map((item) => item.university.name).slice(0, 4).join(", ")}.`
      : "I can shortlist universities once you share preferred mode and course.";

  const courseLine =
    matchedCourses.length > 0
      ? `Best matches: ${matchedCourses
          .slice(0, 4)
          .map((course) => `${course.course.name} (${formatCourseFee(course.course.mode?.name, course.min_fees)})`)
          .join(", ")}.`
      : "I can suggest matching courses if you share your interest (for example MBA, BCA, Data Science, Aviation).";

  return `${mode ? `${toModeLabel(mode)} mode selected. ` : ""}${uniLine} ${courseLine} Share your budget and qualification so I can give the most accurate shortlist.`;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload." }, { status: 400 });
    }

    const dynamicData = await buildDynamicContext(parsed.data.message);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: buildDynamicFallback(parsed.data.message, dynamicData),
        source: "fallback-dynamic",
      });
    }

    const system = `You are "PAVM AI Counsellor", an expert education admissions assistant.
Rules:
1) Answer only education/admissions queries relevant to this platform.
2) Use provided dynamic context to recommend best-fit options.
3) Keep answer concise, useful, and action-oriented.
4) Include: mode, top 2-4 university suggestions, top 2-4 course suggestions, and one next-step question.
5) If user asks off-topic questions, redirect politely to counselling scope.
`;

    const messages = [
      { role: "system", content: system },
      {
        role: "system",
        content: `Dynamic data snapshot:\n${dynamicData.context}`,
      },
      ...((parsed.data.history ?? []).map((item) => ({ role: item.role, content: item.content })) as Array<{
        role: string;
        content: string;
      }>),
      { role: "user", content: parsed.data.message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.35,
        max_tokens: 550,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        reply: buildDynamicFallback(parsed.data.message, dynamicData),
        source: "fallback-dynamic",
      });
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply =
      json.choices?.[0]?.message?.content?.trim() ||
      buildDynamicFallback(parsed.data.message, dynamicData);

    return NextResponse.json({ reply, source: "openai-dynamic" });
  } catch {
    return NextResponse.json({
      reply:
        "I can help with mode selection, fees, eligibility, and university/course comparison. Please share your preferred mode and course interest.",
      source: "fallback",
    });
  }
}
