import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getCourseBySlug, getCourseEnrollmentCount, getCourses, getUniversityCourseLinks } from "@/lib/queries/courses";
import { getRatings, getRatingSummary } from "@/lib/queries/ratings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars } from "@/components/ui/stars";
import { formatCourseFee, formatCurrency, formatNumber, slugify } from "@/lib/utils";
import { getDetailedCourseContent, getFeeBreakdown } from "@/lib/course-content";

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return {};

  return buildMetadata({
    title: course.name,
    description: course.description,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailsPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();
  const modeSlug = slugify(course.mode?.name ?? "");
  const isDomainMode = modeSlug === "vocational" || modeSlug === "skill-certification";
  const applyCourseType =
    modeSlug === "vocational"
      ? "vocational_course"
      : modeSlug === "skill-certification"
        ? "skill_course"
        : "ug_course";
  const applyProgramMode =
    modeSlug === "regular" || modeSlug === "online" || modeSlug === "distance"
      ? modeSlug
      : undefined;

  const allCourses = isDomainMode ? await getCourses() : [];
  const domainName = getProgramDomainName(course.name);
  const sameDomainCourses = isDomainMode
    ? allCourses.filter((c) =>
        slugify(c.mode?.name ?? "") === modeSlug &&
        c.sector?.slug === course.sector?.slug &&
        getProgramDomainName(c.name).toLowerCase() === domainName.toLowerCase(),
      )
    : [];

  const siblingLevels = isDomainMode && sameDomainCourses.length > 0 ? sameDomainCourses : [course];

  const [links, ratings, summary, enrolled] = await Promise.all([
    getUniversityCourseLinks(course.id),
    getRatings(course.id),
    getRatingSummary(course.id),
    getCourseEnrollmentCount(course.id),
  ]);

  const aggregate = ratings[0];
  const courseContent = getDetailedCourseContent({
    courseName: course.name,
    sectorName: course.sector?.name ?? "this domain",
    modeName: course.mode?.name ?? "Program",
    duration: course.duration,
  });

  const levelDetails = await Promise.all(
    siblingLevels.map(async (levelCourse) => {
      const levelLinks = await getUniversityCourseLinks(levelCourse.id);
      return {
        slug: levelCourse.slug,
        label: getProgramLevelLabel(levelCourse.name),
        duration: levelCourse.duration,
        minFees: levelLinks.length ? Math.min(...levelLinks.map((l) => l.fees)) : 0,
      };
    }),
  );

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-blue-700">{course.mode?.name} | {course.sector?.name}</p>
        <h1 className="mt-2 text-3xl font-bold">{isDomainMode ? domainName : course.name}</h1>
        <p className="mt-4 max-w-4xl text-slate-700">{course.description}</p>
      </div>

      {isDomainMode ? (
        <Card>
          <CardHeader><CardTitle>Available Program Levels</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {levelDetails.map((level) => (
                <div key={level.slug} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-semibold">{level.label}</p>
                  <p className="text-sm text-slate-600">{level.duration}</p>
                  <p className="text-sm text-slate-800">From {formatCurrency(level.minFees)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>Duration</CardTitle></CardHeader><CardContent>{course.duration}</CardContent></Card>
        <Card><CardHeader><CardTitle>Universities</CardTitle></CardHeader><CardContent>{links.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Students</CardTitle></CardHeader><CardContent>{formatNumber(enrolled)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Rating</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><Stars value={summary.average} />{summary.average}</div></CardContent></Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Universities Offering This Course</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {links.map((link) => (
            <div key={link.id} className="rounded-xl border border-slate-200 p-4">
              {(() => {
                const fee = getFeeBreakdown(course.mode?.name, link.fees, link.duration);
                return (
                  <>
              <p className="font-semibold text-slate-900">{link.university?.name}</p>
                    <p className="text-sm text-slate-600">Total Fees: {formatCourseFee(course.mode?.name, link.fees)} | {link.duration}</p>
                    <p className="text-xs text-slate-600">1 Year Fees: <span className="font-semibold text-slate-800">{fee.perYearLabel}</span></p>
                    <p className="text-xs text-slate-600">1 Semester Fees: <span className="font-semibold text-slate-800">{fee.perSemesterLabel}</span></p>
              {link.university?.slug && <Link href={`/universities/${link.university.slug}`} className="text-sm font-semibold text-blue-700">View university</Link>}
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold">Course Description and Learning Journey</h2>
        <div className="mt-4 space-y-4 text-slate-700">
          {courseContent.overview.map((paragraph) => (
            <p key={paragraph} className="leading-7">{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900">What You Will Learn</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {courseContent.whatYouWillLearn.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Curriculum Highlights</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {courseContent.curriculumHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-900">Program Outcomes</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {courseContent.outcomes.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <h2 className="text-2xl font-bold">Course Rating Snapshot</h2>
        <p className="mt-2 text-slate-600">Average rating: <strong>{aggregate?.rating ?? 0}</strong></p>
        <p className="text-slate-600">Total reviews: <strong>{aggregate?.review_count ?? 0}</strong></p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-2xl font-bold text-slate-900">Admission Procedure</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Shortlist your preferred university from the list above.</li>
          <li>Click Apply Now and fill complete admission details.</li>
          <li>Counsellor verifies eligibility and shares fee/scholarship options.</li>
          <li>Complete application and upload required documents.</li>
          <li>Receive admission confirmation and onboarding details.</li>
        </ol>
        <div className="mt-4">
          <Link
            href={{
              pathname: "/apply-now",
              query: {
                mode: applyProgramMode,
                course_type: applyCourseType,
                course: course.name,
                stream: course.sector?.name ?? "",
              },
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
