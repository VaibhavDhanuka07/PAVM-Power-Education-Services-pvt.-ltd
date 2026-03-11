import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Sparkles,
  Timer,
  ListChecks,
  Target,
} from "lucide-react";
import { CareerCombo } from "@/lib/types";
import { getCareerPathwayDetail } from "@/lib/data/career-pathway-details";

function pathwayTone(index: number) {
  const tones = [
    "from-indigo-700 via-blue-700 to-cyan-600",
    "from-blue-700 via-violet-700 to-indigo-700",
    "from-cyan-700 via-blue-700 to-indigo-700",
  ];
  return tones[index % tones.length];
}

export function CareerPathwaysSection({ pathways }: { pathways: CareerCombo[] }) {
  if (!pathways.length) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,0.25),transparent_42%)]" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100">
              <Compass className="h-3.5 w-3.5" />
              Career Pathways
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Premium Career + Degree Journeys</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 md:text-base">
              Choose a structured pathway where coaching preparation and degree completion move together with one integrated plan.
            </p>
          </div>
          <Link
            href="/career-pathways"
            className="inline-flex items-center gap-1 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            View all pathways
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
              Coaching Tracks
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{pathways.length}+</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <GraduationCap className="h-4 w-4 text-blue-700" />
              Degree Combinations
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">UG + PG</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Timer className="h-4 w-4 text-blue-700" />
              Typical Duration
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">2 - 5 Years</p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway, index) => {
            const detail = getCareerPathwayDetail(pathway.slug);

            return (
              <article
                key={pathway.slug}
                className="motion-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`relative bg-gradient-to-r ${pathwayTone(index)} px-4 py-4 text-white`}>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22),transparent_42%,rgba(255,255,255,0.08)_70%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                      <Sparkles className="h-3.5 w-3.5" />
                      {pathway.highlight_tag || "Career Combo"}
                    </p>
                    <p className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">{pathway.duration}</p>
                  </div>
                  <h3 className="relative mt-3 text-xl font-bold leading-tight">{pathway.title}</h3>
                </div>

                <div className="flex flex-1 flex-col space-y-4 p-5">
                  <div className="grid gap-2 text-sm text-slate-700">
                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="font-semibold text-slate-900">Coaching:</span> {pathway.coaching_program}
                    </p>
                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="font-semibold text-slate-900">Degree:</span> {pathway.degree_program}
                    </p>
                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="font-semibold text-slate-900">Fee Guidance:</span> {pathway.price}
                    </p>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{detail.brief}</p>

                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
                      <Target className="h-3.5 w-3.5 text-blue-700" />
                      Best For
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {detail.whoShouldChoose.slice(0, 2).map((point) => (
                        <li key={point} className="line-clamp-1">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/60 p-3">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      <ListChecks className="h-3.5 w-3.5" />
                      Outcome Highlights
                    </p>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {detail.outcomes.slice(0, 2).map((point) => (
                        <li key={point} className="line-clamp-1">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link
                      href={`/career-pathways/${pathway.slug}`}
                      className="btn-future inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    >
                      Explore Pathway
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/consultation?pathway=${pathway.slug}`}
                      className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                    >
                      Talk to Counsellor
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

