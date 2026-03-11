import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getUniversityListings } from "@/lib/queries/universities";
import { UniversityGrid } from "@/components/sections/university-grid";

export const metadata = buildMetadata({
  title: "Universities",
  description: "Compare universities by location, courses, ratings, and student enrollment.",
  path: "/universities",
});

export default async function UniversitiesPage() {
  const universities = await getUniversityListings();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"><Sparkles className="h-3.5 w-3.5" />Trusted University Network</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">All Universities</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Explore approved institutions across online, distance, vocational, skill, and regular education modes.</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs text-slate-500">Total Universities</p>
            <p className="flex items-center gap-2 text-2xl font-bold text-slate-900"><Building2 className="h-5 w-5 text-blue-600" />{universities.length}</p>
          </div>
        </div>
      </div>

      <UniversityGrid universities={universities} />

      <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-800">
        Looking for course-wise comparison? <Link href="/courses" className="font-semibold underline">Explore courses</Link>
      </div>
    </section>
  );
}

