import Link from "next/link";
import { Scale, ShieldCheck, BadgeHelp, BriefcaseBusiness, Clock3, GraduationCap } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getUniversities, getUniversityListings } from "@/lib/queries/universities";
import { getCourseListings } from "@/lib/queries/courses";
import { formatNumber } from "@/lib/utils";
import { getUniversityInsight } from "@/lib/university-insights";

export const metadata = buildMetadata({
  title: "Compare Universities",
  description: "Compare up to 4 universities side by side by approvals, fees, ratings, support, eligibility and duration.",
  path: "/compare",
});

export default async function ComparePage({ searchParams }: { searchParams: { universities?: string } }) {
  const [universities, listings, courses] = await Promise.all([
    getUniversities(),
    getUniversityListings(),
    getCourseListings(),
  ]);

  const selectedSlugs =
    searchParams.universities?.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 4) ??
    universities.slice(0, 4).map((u) => u.slug);

  const selected = universities.filter((u) => selectedSlugs.includes(u.slug)).slice(0, 4);

  const compareRows = selected.map((university) => {
    const insight = getUniversityInsight(university.slug);
    const listing = listings.find((item) => item.university.id === university.id);
    const universityCourses = courses.filter((item) =>
      item.course.mode?.name ? university.mode_supported.includes(item.course.mode.name) : true,
    );
    const minFee = universityCourses.length ? Math.min(...universityCourses.map((item) => item.min_fees)) : 0;
    const maxFee = universityCourses.length ? Math.max(...universityCourses.map((item) => item.min_fees)) : 0;

    return {
      university,
      insight,
      listing,
      feeRange: minFee > 0 ? `Rs ${formatNumber(minFee)} - Rs ${formatNumber(maxFee)}` : "Contact for fees",
    };
  });

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Scale className="h-3.5 w-3.5" />
          Compare Page 2.0
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Compare up to 4 Universities Side-by-Side</h1>
        <p className="mt-2 text-slate-600">
          Compare approvals, fee range, placement support, ratings, eligibility, and duration. Add slugs in URL:
          <code className="ml-1 rounded bg-slate-100 px-2 py-0.5 text-xs">/compare?universities=slug1,slug2</code>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Metric</th>
                {compareRows.map((row) => (
                  <th key={row.university.id} className="px-4 py-3 text-left font-semibold text-slate-900">
                    <Link href={`/universities/${row.university.slug}`} className="hover:text-blue-700">{row.university.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Approvals</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-approvals`} className="px-4 py-3">{row.insight.approvals.join(", ")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Fee Range</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-fees`} className="px-4 py-3">{row.feeRange}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Placement Support</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-placement`} className="px-4 py-3">{row.insight.placementSupport}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Average Rating</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-rating`} className="px-4 py-3">{row.listing?.average_rating ?? 0} / 5</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Eligibility</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-eligibility`} className="px-4 py-3">{row.insight.eligibility}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Typical Duration</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-duration`} className="px-4 py-3">{row.insight.duration}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Programs</td>
                {compareRows.map((row) => (
                  <td key={`${row.university.id}-programs`} className="px-4 py-3">{row.listing?.course_count ?? 0}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {compareRows.map((row) => (
          <article key={`${row.university.id}-snapshot`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="line-clamp-2 text-lg font-bold text-slate-900">{row.university.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{row.university.location}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-blue-700" />{row.insight.approvals[0]}</li>
              <li className="inline-flex items-start gap-2"><BriefcaseBusiness className="mt-0.5 h-4 w-4 text-blue-700" />{row.insight.placementSupport}</li>
              <li className="inline-flex items-start gap-2"><BadgeHelp className="mt-0.5 h-4 w-4 text-blue-700" />{row.insight.eligibility}</li>
              <li className="inline-flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 text-blue-700" />{row.insight.duration}</li>
              <li className="inline-flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 text-blue-700" />{row.listing?.course_count ?? 0} programs</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

