import Link from "next/link";
import { SlidersHorizontal, Scale, Grid3X3 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getCourses, getCourseListings, getCourseSectors, getEducationModes } from "@/lib/queries/courses";
import { getUniversities } from "@/lib/queries/universities";
import { CourseFilters } from "@/components/forms/course-filters";
import { CourseGrid } from "@/components/sections/course-grid";
import { CourseQuickFilters } from "@/components/sections/course-quick-filters";
import { PromotedCoursesSection } from "@/components/sections/promoted-courses-section";
import { formatNumber, normalizeModeSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildMetadata({
  title: "Courses",
  description: "Explore courses by sector, mode, university, and duration.",
  path: "/courses",
});

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: {
    sector?: string;
    mode?: string;
    university?: string;
    duration?: string;
    search?: string;
    course?: string;
    level?: string;
  };
}) {
  const buildModeSectorHref = (mode: string, sector: string) => {
    const qp = new URLSearchParams();
    qp.set("mode", mode);
    qp.set("sector", sector);
    if (searchParams.university) qp.set("university", searchParams.university);
    if (searchParams.duration) qp.set("duration", searchParams.duration);
    if (searchParams.search) qp.set("search", searchParams.search);
    if (searchParams.course) qp.set("course", searchParams.course);
    if (searchParams.level) qp.set("level", searchParams.level);
    const query = qp.toString();
    return query ? `/courses?${query}` : "/courses";
  };

  const vocationalListingsPromise =
    searchParams.mode === "vocational" ? getCourseListings({ ...searchParams, sector: undefined }) : Promise.resolve([]);

  const [listings, universities, sectorsData, modesData, vocationalListings, allCourses] = await Promise.all([
    getCourseListings(searchParams),
    getUniversities(),
    getCourseSectors(),
    getEducationModes(),
    vocationalListingsPromise,
    getCourses(),
  ]);

  const sectors = sectorsData.map((item) => item.slug);
  const modes = Array.from(new Set(modesData.map((item) => normalizeModeSlug(item.name)).filter(Boolean)));
  const durations = Array.from(new Set(listings.map((item) => item.course.duration)));
  const promotedListings = [...listings]
    .sort((a, b) => b.review_count - a.review_count || b.average_rating - a.average_rating)
    .slice(0, 6);
  const courseOptions = allCourses
    .map((course) => ({
      slug: course.slug,
      name: course.name,
      modeName: course.mode?.name ?? "Program",
    }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.modeName.localeCompare(b.modeName));
  const courseOptionBySlug = new Map(courseOptions.map((course) => [course.slug, course]));
  const levelLabelMap: Record<string, string> = {
    diploma: "Diploma",
    bachelors: "Bachelors / Graduation",
    "pg-diploma": "PG Diploma",
    "post-graduation": "Post Graduation",
  };
  const activeFilterPairs = [
    searchParams.mode ? ["Mode", searchParams.mode] : null,
    searchParams.university ? ["University", searchParams.university] : null,
    searchParams.sector ? ["Sector", searchParams.sector] : null,
    searchParams.duration ? ["Duration", searchParams.duration] : null,
    searchParams.search ? ["Search", searchParams.search] : null,
    searchParams.course
      ? [
          "Course",
          courseOptionBySlug.get(searchParams.course)
            ? `${courseOptionBySlug.get(searchParams.course)!.name} | ${courseOptionBySlug.get(searchParams.course)!.modeName}`
            : searchParams.course,
        ]
      : null,
    searchParams.level ? ["Level", levelLabelMap[searchParams.level] ?? searchParams.level] : null,
  ].filter((item): item is [string, string] => Boolean(item));
  const vocationalSectorSlugs = new Set(
    vocationalListings
      .map((item) => item.course.sector?.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );
  const vocationalSectors = sectorsData.filter((sector) => vocationalSectorSlugs.has(sector.slug));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.25),transparent_40%)]" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[1.3fr,0.7fr]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Smart Course Discovery Engine
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Explore Programs by Mode, University, and Career Goal</h1>
            <p className="mt-2 text-slate-200">
              Compare durations, fee structures, ratings, and course outcomes with an advanced filter-first catalog.
            </p>
            {activeFilterPairs.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilterPairs.map(([label, value]) => (
                  <span key={`${label}-${value}`} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                    {label}: {value}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-right backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-200">Search Results</p>
            <p className="text-3xl font-extrabold">{formatNumber(listings.length)}</p>
            <p className="text-sm text-slate-100">courses matched</p>
            <Link href="/compare" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-200">
              <Scale className="h-4 w-4" />
              Compare universities
            </Link>
            <div className="mt-4 grid grid-cols-2 gap-2 text-left">
              <article className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2">
                <p className="text-[11px] text-slate-200">Modes</p>
                <p className="text-sm font-bold">{modes.length}</p>
              </article>
              <article className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2">
                <p className="text-[11px] text-slate-200">Sectors</p>
                <p className="text-sm font-bold">{sectors.length}</p>
              </article>
              <article className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2">
                <p className="text-[11px] text-slate-200">Universities</p>
                <p className="text-sm font-bold">{universities.length}</p>
              </article>
              <article className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2">
                <p className="text-[11px] text-slate-200">Durations</p>
                <p className="text-sm font-bold">{durations.length}</p>
              </article>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PromotedCoursesSection
          courses={promotedListings}
          title="Sponsored Course Ads"
          subtitle="Programs currently highlighted by our counselling team."
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[290px,1fr]">
        <CourseQuickFilters universities={universities} modes={modesData.map((m) => ({ name: m.name }))} searchParams={searchParams} />

        <div className="space-y-6">
          {searchParams.mode === "skill-certification" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Grid3X3 className="h-3.5 w-3.5" />
                Skill Certification Domains
              </p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {sectorsData.map((sector) => (
                  <Link
                    key={sector.slug}
                    href={buildModeSectorHref("skill-certification", sector.slug)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      searchParams.sector === sector.slug
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    }`}
                  >
                    {sector.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {searchParams.mode === "vocational" && vocationalSectors.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Grid3X3 className="h-3.5 w-3.5" />
                Vocational Domains
              </p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {vocationalSectors.map((sector) => (
                  <Link
                    key={sector.slug}
                    href={buildModeSectorHref("vocational", sector.slug)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      searchParams.sector === sector.slug
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                    }`}
                  >
                    {sector.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <CourseFilters
              sectors={sectors}
              modes={modes}
              universities={universities}
              durations={durations}
              courseOptions={courseOptions}
            />
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-inner md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-semibold text-slate-800">All Courses Catalog</p>
                <p className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  Browse all filtered results
                </p>
              </div>
              <div className="custom-scrollbar max-h-[min(60vh,720px)] overflow-y-auto overflow-x-hidden pr-2">
                <CourseGrid courses={listings} compact square />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white shadow-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Need Help Choosing?
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight">Talk to a Program Specialist</h3>
                <p className="mt-2 text-sm text-slate-200">
                  Get a custom shortlist based on your budget, goals, eligibility, and preferred mode.
                </p>
              </div>
              <div className="flex items-center justify-start gap-2 md:justify-end">
                <Link href="/consultation" className="btn-future inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white">
                  Book Free Counselling
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
