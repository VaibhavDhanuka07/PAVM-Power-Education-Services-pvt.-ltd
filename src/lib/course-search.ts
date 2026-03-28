import { Course } from "@/lib/types";

type SearchableCourse = Pick<Course, "name" | "slug" | "description"> & {
  sector?: {
    name?: string | null;
  };
  mode?: {
    name?: string | null;
  };
};

type CourseSearchContext = {
  universityNames?: string[];
};

const SHORT_QUERY_ALIASES = new Set([
  "ba",
  "bcom",
  "bsc",
  "ma",
  "mba",
  "mca",
  "mcom",
  "msc",
  "msw",
  "pg",
  "ug",
]);

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[./,()]+/g, " ")
    .replace(/[^a-z0-9+\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

function canonicalizeDegreeName(name: string, pattern: RegExp, canonicalPrefix: string) {
  const trimmed = name.trim();
  if (!pattern.test(trimmed)) return trimmed;

  const suffix = trimmed.replace(pattern, "").trim();
  if (!suffix) return canonicalPrefix;
  if (/^\(?(honours?|hons?)\)?$/i.test(suffix)) return `${canonicalPrefix} (Honours)`;
  if (/^\(?(computer application)\)?$/i.test(suffix)) return `${canonicalPrefix} (Computer Application)`;
  return `${canonicalPrefix} ${suffix}`;
}

function buildCourseAliases(course: SearchableCourse) {
  const aliases = new Set<string>();
  const canonicalName = canonicalizeCourseName(course.name);
  const courseSlug = (course.slug ?? "").toLowerCase();

  aliases.add(course.name);
  aliases.add(canonicalName);
  aliases.add(courseSlug.replace(/-/g, " "));

  if (/^(bcom|b-com)(-|$)/.test(courseSlug)) {
    aliases.add("bcom");
    aliases.add("b.com");
    aliases.add("b com");
    aliases.add("bachelor of commerce");
    aliases.add("commerce");
  }

  if (/^(mcom|m-com)(-|$)/.test(courseSlug)) {
    aliases.add("mcom");
    aliases.add("m.com");
    aliases.add("m com");
    aliases.add("master of commerce");
    aliases.add("pg commerce");
  }

  if (/^(ma|m-a)(-|$)/.test(courseSlug)) {
    aliases.add("ma");
    aliases.add("m.a");
    aliases.add("m a");
    aliases.add("master of arts");
    aliases.add("pg arts");
    aliases.add("post graduate arts");
  }

  if (/^(msc|m-sc)(-|$)/.test(courseSlug)) {
    aliases.add("msc");
    aliases.add("m.sc");
    aliases.add("m sc");
    aliases.add("m,sc");
    aliases.add("master of science");
    aliases.add("pg science");
    aliases.add("post graduate science");
    aliases.add("science");

    if (/mathematics|maths?|math\b/i.test(canonicalName) || /mathematics/.test(courseSlug)) {
      aliases.add("mathematics");
      aliases.add("maths");
      aliases.add("math");
    }

    if (courseSlug === "m-sc-regular") {
      aliases.add("chemistry");
      aliases.add("physics");
      aliases.add("biology");
      aliases.add("botany");
      aliases.add("zoology");
      aliases.add("life science");
    }
  }

  if (/^(bsc|b-sc)(-|$)/.test(courseSlug)) {
    aliases.add("bsc");
    aliases.add("b.sc");
    aliases.add("b sc");
    aliases.add("bachelor of science");
  }

  return Array.from(aliases);
}

function buildSearchCorpus(course: SearchableCourse, context: CourseSearchContext) {
  const phrases = new Set<string>();
  const phraseCompacts = new Set<string>();
  const tokens = new Set<string>();
  const tokenCompacts = new Set<string>();

  const addPhrase = (value: string | undefined | null) => {
    if (!value) return;

    const normalized = normalizeSearchText(value);
    if (!normalized) return;

    phrases.add(normalized);
    phraseCompacts.add(normalized.replace(/\s+/g, ""));

    for (const token of normalized.split(" ")) {
      if (!token) continue;
      tokens.add(token);
      tokenCompacts.add(token.replace(/\s+/g, ""));
    }
  };

  addPhrase(course.name);
  addPhrase(canonicalizeCourseName(course.name));
  addPhrase(course.description);
  addPhrase(course.sector?.name);
  addPhrase(course.mode?.name);

  for (const universityName of context.universityNames ?? []) {
    addPhrase(universityName);
  }

  for (const alias of buildCourseAliases(course)) {
    addPhrase(alias);
  }

  return {
    phrases,
    phraseCompacts,
    tokens,
    tokenCompacts,
    combined: Array.from(phrases).join(" "),
  };
}

export function canonicalizeCourseName(name: string) {
  let normalized = name.trim();

  normalized = canonicalizeDegreeName(normalized, /^b(?:\.\s*|\s*)?com\.?\s*/i, "B.Com.");
  normalized = canonicalizeDegreeName(normalized, /^m(?:\.\s*|\s*)?com\.?\s*/i, "M.Com.");
  normalized = canonicalizeDegreeName(normalized, /^m(?:\.\s*|\s*)?a\.?\s*/i, "M.A.");
  normalized = canonicalizeDegreeName(normalized, /^m(?:\.\s*|\s*)?sc\.?\s*/i, "M.Sc.");
  normalized = canonicalizeDegreeName(normalized, /^b(?:\.\s*|\s*)?sc\.?\s*/i, "B.Sc.");

  return normalized;
}

export function scoreCourseSearchMatch(course: SearchableCourse, query: string, context: CourseSearchContext = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = compactSearchText(query);
  if (!normalizedQuery || !compactQuery) return 0;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const corpus = buildSearchCorpus(course, context);

  let score = 0;

  if (corpus.phrases.has(normalizedQuery)) score += 40;
  if (corpus.phraseCompacts.has(compactQuery)) score += 40;
  if (corpus.tokens.has(normalizedQuery) || corpus.tokenCompacts.has(compactQuery)) score += 24;

  const allTokensMatch = queryTokens.every((token) => corpus.tokens.has(token) || corpus.tokenCompacts.has(token));
  if (queryTokens.length > 1 && allTokensMatch) score += 20 + queryTokens.length;

  if (compactQuery.length >= 4 && corpus.combined.includes(normalizedQuery)) score += 8;

  if (compactQuery.length >= 4 && Array.from(corpus.phraseCompacts).some((value) => value.includes(compactQuery))) {
    score += 6;
  }

  return score;
}

export function matchesCourseSearch(course: SearchableCourse, query: string, context: CourseSearchContext = {}) {
  return scoreCourseSearchMatch(course, query, context) > 0;
}

export function tokenizeCourseQuery(query: string) {
  const normalized = normalizeSearchText(query);
  const compact = compactSearchText(query);

  const tokens = normalized
    .split(" ")
    .filter((token) => token && (token.length > 2 || SHORT_QUERY_ALIASES.has(token)));

  if (compact && SHORT_QUERY_ALIASES.has(compact) && !tokens.includes(compact)) {
    tokens.unshift(compact);
  }

  return Array.from(new Set(tokens));
}
