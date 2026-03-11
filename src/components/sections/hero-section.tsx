import Link from "next/link";
import { BarChart3, CircleCheckBig, ShieldCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroProgramFinder } from "@/components/forms/hero-program-finder";
import { FadeIn } from "@/components/sections/fade-in";
import { University } from "@/lib/types";

export function HeroSection({ universities }: { universities: University[] }) {
  return (
    <section className="relative mx-auto mt-1 max-w-[99%] overflow-hidden rounded-b-3xl border border-slate-200/70 neon-outline">
      <div className="relative min-h-[66vh] w-full bg-slate-950 md:min-h-[72vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,0.38),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.36),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.28),transparent_42%)]" />
        <video
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2200&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-4519-large.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/70 to-slate-950/90" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:100%_42px]" />
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-orb hero-orb--three" />

        <div className="relative z-10 mx-auto flex min-h-[66vh] w-full max-w-7xl flex-col justify-center px-4 py-10 md:min-h-[72vh] md:px-6 md:py-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr,0.85fr] lg:gap-10">
            <div className="text-white">
              <FadeIn delay={0.02}>
                <p className="mb-4 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_0_1px_rgba(125,211,252,0.2),0_0_24px_rgba(56,189,248,0.22)]">
                  Future-Ready Education Marketplace
                </p>
              </FadeIn>
              <FadeIn delay={0.05}>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Discover 1000+ Courses from Top Universities
                </h1>
              </FadeIn>
              <FadeIn delay={0.08}>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">
                  Compare online, distance, vocational, skill, and regular programs with transparent fees, verified approvals, and admission counselling support.
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {["Global Admissions", "English Support", "Worldwide Counselling", "Multi-Currency Fee View"].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.12}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/courses" className={`${buttonVariants()} btn-future rounded-xl px-6 py-3 text-base font-semibold shadow-md`}>
                    Find Programs
                  </Link>
                  <Link
                    href="/consultation"
                    className={`${buttonVariants({ variant: "outline" })} rounded-xl border-white/35 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-white/20`}
                  >
                    Free Counselling
                  </Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.14}>
              <article className="futuristic-surface rounded-2xl border border-white/30 bg-slate-950/65 p-5 text-white shadow-2xl backdrop-blur-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Why Learners Choose Us
                </p>
                <div className="mt-4 grid gap-2 text-sm text-slate-100">
                  {[
                    "Verified UGC / AICTE / NAAC mapped universities",
                    "Career counselling with mode-wise program matching",
                    "Transparent fee breakdown and admission tracking",
                    "Global-ready support for India and overseas applicants",
                  ].map((point) => (
                    <p key={point} className="inline-flex items-start gap-2 rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 font-medium">
                      <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      {point}
                    </p>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/20 bg-slate-900/70 p-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">Trust</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-base font-extrabold text-white">
                      <ShieldCheck className="h-4 w-4 text-cyan-300" />
                      100%
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-slate-900/70 p-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">Courses</p>
                    <p className="mt-1 text-base font-extrabold text-white">1000+</p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-slate-900/70 p-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">Insights</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-base font-extrabold text-white">
                      <BarChart3 className="h-4 w-4 text-cyan-300" />
                      Live
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          </div>

          <FadeIn delay={0.17}>
            <HeroProgramFinder universities={universities} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
