import { getMockCourseListings, mockData } from "@/lib/mock-data";
import { Course, CourseListing, UniversityCourse } from "@/lib/types";
import { canonicalizeCourseName, matchesCourseSearch } from "@/lib/course-search";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { normalizeModeSlug, slugify } from "@/lib/utils";

type CourseFilters = {
  sector?: string;
  mode?: string;
  university?: string;
  duration?: string;
  search?: string;
  course?: string;
  level?: string;
};

type CourseLevel = "diploma" | "bachelors" | "pg-diploma" | "post-graduation";

const COURSE_LEVEL_ALIASES: Record<string, CourseLevel> = {
  diploma: "diploma",
  "pg-diploma": "pg-diploma",
  "pg-diploma-in": "pg-diploma",
  "post-graduation": "post-graduation",
  postgraduate: "post-graduation",
  "post-graduate": "post-graduation",
  masters: "post-graduation",
  master: "post-graduation",
  bachelors: "bachelors",
  bachelor: "bachelors",
  graduation: "bachelors",
  undergraduate: "bachelors",
  ug: "bachelors",
};

const PAGE_SIZE = 1000;

async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => Promise<{ data: T[] | null; error: unknown }>,
): Promise<{ data: T[] | null; error: unknown }> {
  const all: T[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await fetchPage(from, to);
    if (error) return { data: null, error };
    if (data && data.length) {
      all.push(...data);
    }
    if (!data || data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return { data: all, error: null };
}

function normalizeCourseRecord(course: Course): Course {
  const canonicalName = canonicalizeCourseName(course.name);
  return canonicalName === course.name ? course : { ...course, name: canonicalName };
}

function matchesListingSearch(item: CourseListing, query: string) {
  return matchesCourseSearch(item.course, query, { universityNames: item.university_names });
}

function normalizeCourseLevelFilter(value: string | undefined | null): CourseLevel | "" {
  const slug = slugify(value ?? "");
  if (!slug) return "";
  return COURSE_LEVEL_ALIASES[slug] ?? "";
}

function getCourseLevel(name: string): CourseLevel | null {
  const normalized = name.toLowerCase().trim();

  if (/(pg\s*diploma|post\s*graduate\s*diploma|postgraduate\s*diploma)/.test(normalized)) {
    return "pg-diploma";
  }

  if (/diploma/.test(normalized)) {
    return "diploma";
  }

  if (
    /bachelor/.test(normalized) ||
    /^b\.?\s?(tech|ca|com|sc|a|ed|ped|lib|voc)\b/.test(normalized) ||
    /^(bba|bca|bcom|bsc|ba|bjmc|bhmct|bpt|b\.?voc)\b/.test(normalized)
  ) {
    return "bachelors";
  }

  if (
    /master/.test(normalized) ||
    /^m\.?\s?(tech|ca|com|sc|a|ed|lib)\b/.test(normalized) ||
    /^(mba|mca|mcom|msc|ma|msw|llm)\b/.test(normalized) ||
    /phd|doctor/.test(normalized)
  ) {
    return "post-graduation";
  }

  return null;
}

function getProgramDomainName(name: string) {
  return name
    .replace(/^Advanced Diploma in\s+/i, "")
    .replace(/^Diploma in\s+/i, "")
    .replace(/^Bachelor Vocational in\s+/i, "")
    .replace(/^Bachelor of Vocation in\s+/i, "")
    .replace(/^Certificate in\s+/i, "")
    .trim();
}

function getProgramLevelLabel(name: string) {
  if (/^Advanced Diploma in\s+/i.test(name)) return "Advanced Diploma";
  if (/^Diploma in\s+/i.test(name)) return "Diploma";
  if (/^Bachelor Vocational in\s+/i.test(name) || /^Bachelor of Vocation in\s+/i.test(name)) return "Bachelor Vocational";
  if (/^Certificate in\s+/i.test(name)) return "Certificate";
  return "Program";
}

function isStructuredBvocLevel(slug: string) {
  return /-voc-(diploma|advanced-diploma|bachelor)$/.test(slug);
}

function collapseDomainListings(list: CourseListing[]) {
  const grouped = new Map<
    string,
    {
      items: CourseListing[];
      modeSlug: string;
      sectorSlug: string;
      domain: string;
    }
  >();

  const passthrough: CourseListing[] = [];

  for (const item of list) {
    const modeSlug = normalizeModeSlug(item.course.mode?.name ?? "");
    const shouldGroup = modeSlug === "vocational" || modeSlug === "skill-certification";
    if (!shouldGroup) {
      passthrough.push(item);
      continue;
    }

    const sectorSlug = item.course.sector?.slug ?? "sector";
    const domain = getProgramDomainName(item.course.name);
    const key = `${modeSlug}|${sectorSlug}|${domain.toLowerCase()}`;
    const existing = grouped.get(key);
    if (existing) existing.items.push(item);
    else grouped.set(key, { items: [item], modeSlug, sectorSlug, domain });
  }

  const collapsed = Array.from(grouped.values()).map((group) => {
    const items = group.items;
    const levels = items
      .map((it) => ({
        label: getProgramLevelLabel(it.course.name),
        duration: it.course.duration,
        fees: it.min_fees,
        slug: it.course.slug,
      }))
      .sort((a, b) => {
        const order: Record<string, number> = {
          Diploma: 1,
          "Advanced Diploma": 2,
          "Bachelor Vocational": 3,
          Certificate: 1,
          Program: 4,
        };
        return (order[a.label] ?? 99) - (order[b.label] ?? 99);
      });

    const representative =
      items.find((it) => /Bachelor Vocational|Bachelor of Vocation/i.test(it.course.name)) ??
      items.find((it) => /Advanced Diploma/i.test(it.course.name)) ??
      items.find((it) => /Diploma/i.test(it.course.name)) ??
      items[0];

    const totalReviews = items.reduce((acc, it) => acc + it.review_count, 0);
    const weightedRating =
      totalReviews > 0
        ? items.reduce((acc, it) => acc + it.average_rating * it.review_count, 0) / totalReviews
        : items.reduce((acc, it) => acc + it.average_rating, 0) / Math.max(items.length, 1);

    const durations = Array.from(new Set(levels.map((l) => l.duration)));

    return {
      course: {
        ...representative.course,
        name: group.domain,
        duration: durations.join(" / "),
      },
      min_fees: Math.min(...items.map((it) => it.min_fees)),
      university_count: Math.max(...items.map((it) => it.university_count)),
      university_names: Array.from(new Set(items.flatMap((it) => it.university_names ?? []))),
      student_count: items.reduce((acc, it) => acc + it.student_count, 0),
      average_rating: Number(weightedRating.toFixed(1)),
      review_count: totalReviews,
      levels,
    } satisfies CourseListing;
  });

  return [...passthrough, ...collapsed].sort((a, b) => a.course.name.localeCompare(b.course.name));
}

const CURATED_ONLINE_UNIVERSITY_SLUGS = new Set([
  "shoolini-university",
  "maharishi-markandeshwar-university",
  "noida-international-university",
  "suresh-gyan-vihar-university",
  "bharati-vidyapeeth-university",
  "marwadi-university",
  "uttaranchal-university",
  "mangalayatan-university",
]);

function hashCode(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getScopedOnlineListingsByUniversitySlug(universitySlug: string): CourseListing[] {
  const uni = mockData.universities.find((u) => u.slug === universitySlug);
  if (!uni) return [];

  return mockData.universityCourses
    .filter((row) => row.university_id === uni.id)
    .map((row) => {
      const course = mockData.courses.find((c) => c.id === row.course_id);
      if (!course || normalizeModeSlug(course.mode?.name ?? "") !== "online") return null;
      const rating = mockData.ratings.find((r) => r.course_id === course.id);
      return {
        course,
        min_fees: row.fees,
        university_count: 1,
        university_names: [uni.name],
        student_count: 100 + (hashCode(row.id) % 4901),
        average_rating: Number(rating?.rating ?? 0),
        review_count: rating?.review_count ?? 0,
      } satisfies CourseListing;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.course.name.localeCompare(b.course.name));
}

function applyFiltersToList(list: CourseListing[], filters: CourseFilters) {
  const normalizedMode = normalizeModeSlug(filters.mode);
  const levelFilter = normalizeCourseLevelFilter(filters.level);
  const allowedLevelModes = new Set(["online", "distance", "regular"]);
  const allowLevelFilter = !normalizedMode || allowedLevelModes.has(normalizedMode);
  let allowedCourseIds: Set<string> | null = null;
  if (filters.university) {
    const uni = mockData.universities.find((u) => u.slug === filters.university);
    const ids = uni ? mockData.universityCourses.filter((row) => row.university_id === uni.id).map((row) => row.course_id) : [];
    allowedCourseIds = new Set(ids);
  }

  return list.filter((item) => {
    if (filters.sector && item.course.sector?.slug !== filters.sector) return false;
    if (normalizedMode && normalizeModeSlug(item.course.mode?.name ?? "") !== normalizedMode) return false;
    if (filters.course && item.course.slug !== filters.course) return false;
    if (levelFilter && allowLevelFilter) {
      const courseMode = normalizeModeSlug(item.course.mode?.name ?? "");
      if (!allowedLevelModes.has(courseMode)) return false;
      const courseLevel = getCourseLevel(item.course.name);
      if (courseLevel !== levelFilter) return false;
    }
    if (filters.duration && !item.course.duration.toLowerCase().includes(filters.duration.toLowerCase())) return false;
    if (allowedCourseIds && !allowedCourseIds.has(item.course.id)) return false;
    if (filters.search && !matchesListingSearch(item, filters.search)) return false;
    return true;
  });
}

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return mockData.courses;

  const supabase = createClient();
  const { data, error } = await fetchAllRows<Course>(async (from, to) => {
    const { data: rows, error } = await supabase
      .from("courses")
      .select("*, sector:course_sectors(*), mode:education_modes(*)")
      .order("name", { ascending: true })
      .range(from, to);
    return { data: rows, error };
  });

  if (error || !data) return mockData.courses;
  return data.map(normalizeCourseRecord);
}

export async function getCourseBySlug(slug: string) {
  if (!isSupabaseConfigured()) return mockData.courses.find((course) => course.slug === slug) ?? null;

  const supabase = createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, sector:course_sectors(*), mode:education_modes(*)")
    .eq("slug", slug)
    .maybeSingle();

  return data ? normalizeCourseRecord(data as Course) : null;
}

export async function getCourseSectors() {
  if (!isSupabaseConfigured()) return mockData.sectors;
  const supabase = createClient();
  const { data } = await supabase.from("course_sectors").select("id, name, slug").order("name");
  return data ?? mockData.sectors;
}

export async function getEducationModes() {
  if (!isSupabaseConfigured()) return mockData.modes;
  const supabase = createClient();
  const { data } = await supabase.from("education_modes").select("id, name").order("name");
  return data ?? mockData.modes;
}

export async function getCourseListings(filters: CourseFilters = {}): Promise<CourseListing[]> {
  const list = !isSupabaseConfigured() ? getMockCourseListings() : await getCourseListingsFromDb();
  const normalizedMode = normalizeModeSlug(filters.mode);
  const levelFilter = normalizeCourseLevelFilter(filters.level);
  const allowedLevelModes = new Set(["online", "distance", "regular"]);
  const allowLevelFilter = !normalizedMode || allowedLevelModes.has(normalizedMode);

  let allowedCourseIds: Set<string> | null = null;

  if (filters.university) {
    if (!isSupabaseConfigured()) {
      const uni = mockData.universities.find((u) => u.slug === filters.university);
      const ids = uni ? mockData.universityCourses.filter((row) => row.university_id === uni.id).map((row) => row.course_id) : [];
      allowedCourseIds = new Set(ids);
    } else {
      const supabase = createClient();
      const { data: university } = await supabase.from("universities").select("id").eq("slug", filters.university).maybeSingle();

      if (university) {
        const { data: links, error } = await fetchAllRows<{ course_id: string }>(async (from, to) => {
          const { data: rows, error } = await supabase
            .from("university_courses")
            .select("course_id")
            .eq("university_id", university.id)
            .range(from, to);
          return { data: rows, error };
        });
        allowedCourseIds = error ? new Set() : new Set((links ?? []).map((row) => row.course_id));
      } else {
        allowedCourseIds = new Set();
      }
    }
  }

  const filtered = list.filter((item) => {
    if (filters.sector && item.course.sector?.slug !== filters.sector) return false;
    if (normalizedMode && normalizeModeSlug(item.course.mode?.name ?? "") !== normalizedMode) return false;
    if (filters.course && item.course.slug !== filters.course) return false;
    if (levelFilter && allowLevelFilter) {
      const courseMode = normalizeModeSlug(item.course.mode?.name ?? "");
      if (!allowedLevelModes.has(courseMode)) return false;
      const courseLevel = getCourseLevel(item.course.name);
      if (courseLevel !== levelFilter) return false;
    }
    if (filters.duration && !item.course.duration.toLowerCase().includes(filters.duration.toLowerCase())) return false;
    if (allowedCourseIds && !allowedCourseIds.has(item.course.id)) return false;
    if (filters.search && !matchesListingSearch(item, filters.search)) return false;
    return true;
  });

  // Glocal vocational should show only the BVoc domain-structured tracks
  // (Diploma / Advanced Diploma / Bachelor Vocational) to avoid mixed legacy entries.
  const scopedFiltered =
    normalizedMode === "vocational" && filters.university === "glocal-university"
      ? filtered.filter((item) => isStructuredBvocLevel(item.course.slug))
      : filtered;

  // For the curated 7 online universities, always return the exact curated
  // online catalog to avoid partial/legacy DB mappings in listing UX.
  if (filters.university && CURATED_ONLINE_UNIVERSITY_SLUGS.has(filters.university)) {
    const isOnlineContext = !normalizedMode || normalizedMode === "online";
    if (isOnlineContext) {
      const curatedScoped = getScopedOnlineListingsByUniversitySlug(filters.university);
      return collapseDomainListings(applyFiltersToList(curatedScoped, { ...filters, mode: "online", university: undefined }));
    }
  }

  if (isSupabaseConfigured() && scopedFiltered.length === 0) {
    const baseFallback = applyFiltersToList(getMockCourseListings(), filters);
    let fallbackScoped =
      normalizedMode === "vocational" && filters.university === "glocal-university"
        ? baseFallback.filter((item) => isStructuredBvocLevel(item.course.slug))
        : baseFallback;

    if (!fallbackScoped.length && filters.university) {
      const relaxedFallback = applyFiltersToList(getMockCourseListings(), { ...filters, university: undefined });
      fallbackScoped = relaxedFallback;
    }

    return collapseDomainListings(fallbackScoped);
  }

  return collapseDomainListings(scopedFiltered);
}

async function getCourseListingsFromDb(): Promise<CourseListing[]> {
  const supabase = createClient();
  const [coursesResp, linksResp, studentsResp, ratingsResp, universitiesResp] = await Promise.all([
    fetchAllRows<Course>(async (from, to) => {
      const { data: rows, error } = await supabase
        .from("courses")
        .select("*, sector:course_sectors(*), mode:education_modes(*)")
        .range(from, to);
      return { data: rows, error };
    }),
    fetchAllRows<{ course_id: string; university_id: string; fees: number }>(async (from, to) => {
      const { data: rows, error } = await supabase
        .from("university_courses")
        .select("course_id, university_id, fees")
        .range(from, to);
      return { data: rows, error };
    }),
    fetchAllRows<{ course_id: string; student_count: number }>(async (from, to) => {
      const { data: rows, error } = await supabase
        .from("students")
        .select("course_id, student_count")
        .range(from, to);
      return { data: rows, error };
    }),
    fetchAllRows<{ course_id: string; rating: number; review_count: number }>(async (from, to) => {
      const { data: rows, error } = await supabase
        .from("ratings")
        .select("course_id, rating, review_count")
        .range(from, to);
      return { data: rows, error };
    }),
    fetchAllRows<{ id: string; name: string }>(async (from, to) => {
      const { data: rows, error } = await supabase.from("universities").select("id, name").range(from, to);
      return { data: rows, error };
    }),
  ]);

  if (!coursesResp.data || !linksResp.data) return getMockCourseListings();

  const universityNameById = new Map((universitiesResp.data ?? []).map((item) => [item.id, item.name]));

  return coursesResp.data.map((course) => {
    const normalizedCourse = normalizeCourseRecord(course);
    const courseLinks = linksResp.data!.filter((row) => row.course_id === course.id);
    const minFees = courseLinks.length ? Math.min(...courseLinks.map((row) => row.fees)) : 0;
    const studentCount =
      studentsResp.data?.filter((row) => row.course_id === course.id).reduce((acc, row) => acc + row.student_count, 0) ?? 0;
    const ratingRow = ratingsResp.data?.find((row) => row.course_id === course.id);
    const universityNames = Array.from(
      new Set(courseLinks.map((row) => universityNameById.get(row.university_id)).filter((value): value is string => Boolean(value))),
    );

    return {
      course: normalizedCourse,
      min_fees: minFees,
      university_count: courseLinks.length,
      university_names: universityNames,
      student_count: studentCount,
      average_rating: Number(ratingRow?.rating ?? 0),
      review_count: ratingRow?.review_count ?? 0,
    };
  });
}

export async function getUniversityCourseLinks(courseId: string): Promise<UniversityCourse[]> {
  if (!isSupabaseConfigured()) {
    return mockData.universityCourses
      .filter((item) => item.course_id === courseId)
      .map((item) => ({
        ...item,
        course: item.course ? normalizeCourseRecord(item.course) : item.course,
        university: mockData.universities.find((u) => u.id === item.university_id),
      }));
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("university_courses")
    .select("*, university:universities(*)")
    .eq("course_id", courseId)
    .order("fees", { ascending: true });

  return (data ?? []).map((item) => ({
    ...item,
    course: item.course ? normalizeCourseRecord(item.course as Course) : item.course,
  }));
}

export async function getUniversityCourseAssignments(): Promise<UniversityCourse[]> {
  if (!isSupabaseConfigured()) {
    return mockData.universityCourses.map((item) => ({
      ...item,
      university: mockData.universities.find((u) => u.id === item.university_id),
      course: normalizeCourseRecord(mockData.courses.find((c) => c.id === item.course_id) ?? item.course!),
    }));
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("university_courses")
    .select("*, university:universities(*), course:courses(*)")
    .order("university_id", { ascending: true });

  return (data ?? []).map((item) => ({
    ...item,
    course: item.course ? normalizeCourseRecord(item.course as Course) : item.course,
  }));
}

export async function getCourseEnrollmentCount(courseId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    const listing = getMockCourseListings().find((item) => item.course.id === courseId);
    return listing?.student_count ?? 0;
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("student_count")
    .eq("course_id", courseId);

  return (data ?? []).reduce((acc, item) => acc + item.student_count, 0);
}

