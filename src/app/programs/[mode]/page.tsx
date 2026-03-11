import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, School } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getCourseListings } from "@/lib/queries/courses";
import { getUniversityListings } from "@/lib/queries/universities";
import { CourseGrid } from "@/components/sections/course-grid";
import { UniversityGrid } from "@/components/sections/university-grid";
import { slugify } from "@/lib/utils";

const MODE_MAP: Record<string, string> = {
  regular: "Regular",
  online: "Online",
  distance: "Distance",
  vocational: "Vocational",
  "skill-certification": "Skill Certification",
};

export async function generateMetadata({ params }: { params: { mode: string } }) {
  const modeName = MODE_MAP[params.mode];
  if (!modeName) return buildMetadata({ title: "Programs", description: "Explore programs by education mode." });

  return buildMetadata({
    title: `${modeName} Programs`,
    description: `Explore ${modeName.toLowerCase()} programs, compare universities, fees, ratings, and admission options.`,
    path: `/programs/${params.mode}`,
  });
}

export default async function ProgramModePage({ params }: { params: { mode: string } }) {
  const modeName = MODE_MAP[params.mode];
  if (!modeName) notFound();

  const [listings, universityListings] = await Promise.all([
    getCourseListings({ mode: params.mode }),
    getUniversityListings(),
  ]);

  const universities = universityListings.filter((item) => item.university.mode_supported.includes(modeName));

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Layers className="h-3.5 w-3.5" />
          Program Mode
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">{modeName} Programs</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Explore universities offering {modeName.toLowerCase()} programs. Select your preferred university or search courses to see full details, fees, and admission flow.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/courses?mode=${slugify(modeName)}`} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            View all {modeName} courses
          </Link>
          <Link href="/consultation" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Get free counselling
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
          <School className="h-5 w-5 text-blue-700" />
          Universities in {modeName}
        </h2>
        <UniversityGrid universities={universities} />
      </div>

      {params.mode === "skill-certification" ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Skill Certification Domains</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from(
              new Map(
                listings
                  .filter((item) => item.course.sector?.slug)
                  .map((item) => [item.course.sector!.slug, item.course.sector!.name]),
              ).entries(),
            )
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/courses?mode=skill-certification&sector=${slug}`}
                  className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
                >
                  {name}
                </Link>
              ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Top {modeName} Courses</h2>
        <CourseGrid courses={listings.slice(0, 30)} />
      </div>
    </section>
  );
}
