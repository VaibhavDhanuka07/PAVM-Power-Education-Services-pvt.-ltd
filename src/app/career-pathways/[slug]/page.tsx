import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
  Route,
  ShieldCheck,
} from "lucide-react";
import { PathwayApplyForm } from "@/components/forms/pathway-apply-form";
import { getCareerPathwayBySlug, getCareerPathways } from "@/lib/queries/career-pathways";
import { buildMetadata } from "@/lib/seo";
import { getCareerPathwayDetail } from "@/lib/data/career-pathway-details";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const pathways = await getCareerPathways();
  return pathways.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const pathway = await getCareerPathwayBySlug(params.slug);

  if (!pathway) {
    return buildMetadata({
      title: "Career Pathway",
      description: "Integrated professional coaching and degree pathway.",
      path: `/career-pathways/${params.slug}`,
    });
  }

  return buildMetadata({
    title: pathway.title,
    description: pathway.description,
    path: `/career-pathways/${pathway.slug}`,
  });
}

export default async function CareerPathwayDetailPage({ params }: PageProps) {
  const pathway = await getCareerPathwayBySlug(params.slug);
  if (!pathway) notFound();

  const detail = getCareerPathwayDetail(pathway.slug);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 md:px-6">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,.16),transparent_36%)]" />
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
            <Sparkles className="h-3.5 w-3.5" />
            {pathway.highlight_tag || "Career Combo"}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">{pathway.title}</h1>
          <p className="mt-3 max-w-4xl text-sm text-blue-50 md:text-base">{detail.brief}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/25 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-blue-100">Coaching Program</p>
              <p className="mt-1 text-sm font-semibold">{pathway.coaching_program}</p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-blue-100">Degree Options</p>
              <p className="mt-1 text-sm font-semibold">{pathway.degree_program}</p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-blue-100">Estimated Duration</p>
              <p className="mt-1 text-sm font-semibold">{pathway.duration}</p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-blue-100">Fee Plan</p>
              <p className="mt-1 text-sm font-semibold">{pathway.price}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
              <BriefcaseBusiness className="h-5 w-5 text-blue-700" />
              Career Overview
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{detail.brief}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              This pathway combines <strong>{pathway.coaching_program}</strong> with <strong>{pathway.degree_program}</strong> so
              learners build exam momentum and academic qualification in one consistent timeline.
            </p>
          </article>

          <article className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <Target className="h-5 w-5 text-blue-700" />
                Who Should Choose This
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {detail.whoShouldChoose.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <Trophy className="h-5 w-5 text-blue-700" />
                Outcome You Can Expect
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {detail.outcomes.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
              <Route className="h-5 w-5 text-blue-700" />
              Full Learning Roadmap
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {detail.roadmap.map((step) => (
                <div key={step.phase} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{step.phase}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
              Support and Guidance Included
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {detail.supportIncludes.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <GraduationCap className="h-5 w-5 text-blue-700" />
                Degree Options
              </h3>
              <p className="mt-3 text-sm text-slate-700">{pathway.degree_program}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <Clock3 className="h-5 w-5 text-blue-700" />
                Course Timeline
              </h3>
              <p className="mt-3 text-sm text-slate-700">{pathway.duration} structured timeline based on chosen program load.</p>
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <PathwayApplyForm pathwayTitle={pathway.title} pathwaySlug={pathway.slug} />
          <a
            href="/consultation"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Book Free Counselling
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

