import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Users, Sparkles, BookmarkPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars } from "@/components/ui/stars";
import { FadeIn } from "@/components/sections/fade-in";
import { formatNumber, getUniversityAccent } from "@/lib/utils";
import { UniversityListing } from "@/lib/types";
import { MOST_POPULAR_UNIVERSITY_SLUGS } from "@/lib/constants";

export function UniversityGrid({ universities }: { universities: UniversityListing[] }) {
  const sortedUniversities = [...universities].sort((a, b) => {
    const aPopular = MOST_POPULAR_UNIVERSITY_SLUGS.includes(a.university.slug as (typeof MOST_POPULAR_UNIVERSITY_SLUGS)[number]) ? 1 : 0;
    const bPopular = MOST_POPULAR_UNIVERSITY_SLUGS.includes(b.university.slug as (typeof MOST_POPULAR_UNIVERSITY_SLUGS)[number]) ? 1 : 0;
    if (aPopular !== bPopular) return bPopular - aPopular;
    return b.average_rating - a.average_rating;
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sortedUniversities.map((item, index) => {
        const accent = getUniversityAccent(item.university.slug);
        const isPopular = MOST_POPULAR_UNIVERSITY_SLUGS.includes(item.university.slug as (typeof MOST_POPULAR_UNIVERSITY_SLUGS)[number]);
        return (
          <FadeIn key={item.university.id} delay={(index % 9) * 0.04}>
            <Card
              className={`motion-card group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99] ${
                isPopular
                  ? "premium-card border-blue-300 shadow-blue-900/20 ring-1 ring-blue-200"
                  : "premium-card hover:shadow-blue-900/10"
              }`}
            >
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${accent.gradient} to-transparent`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.14),transparent_35%)]" />
            {isPopular ? (
              <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/30">
                <Sparkles className="h-3 w-3" />
                Most Popular
              </div>
            ) : null}
            <CardHeader className="relative pb-3">
              <div className="flex items-start gap-3">
                {item.university.logo ? (
                  <div className={`relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 ring-4 ${accent.ring}`}>
                    <Image src={item.university.logo} alt={item.university.name} fill sizes="56px" className="object-contain" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">Logo</div>
                )}
                <div>
                  <CardTitle className="text-lg leading-tight">{item.university.name}</CardTitle>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><MapPin className="h-3.5 w-3.5" />{item.university.location}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <p className="flex items-center gap-1"><Building2 className="h-4 w-4 text-blue-600" />{item.course_count} programs</p>
                <p className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-600" />{formatNumber(item.student_count)} students</p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <Stars value={item.average_rating} />
                <span className="font-semibold">{item.average_rating}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/universities/${item.university.slug}`} className={`inline-flex rounded-lg px-3 py-2 text-sm font-semibold transition group-hover:opacity-90 active:scale-[0.98] ${accent.chip}`}>
                  View university
                </Link>
                <Link href={`/shortlist?university=${item.university.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 active:scale-[0.98]">
                  <BookmarkPlus className="h-4 w-4" />
                  Save
                </Link>
              </div>
            </CardContent>
            </Card>
          </FadeIn>
        );
      })}
    </div>
  );
}

