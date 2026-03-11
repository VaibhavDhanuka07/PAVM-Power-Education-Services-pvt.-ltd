import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getBlogs } from "@/lib/queries/blogs";
import { getCourseListings } from "@/lib/queries/courses";
import { getUniversities, getUniversityListings } from "@/lib/queries/universities";
import { HeroSection } from "@/components/sections/hero-section";
import { UniversityGrid } from "@/components/sections/university-grid";
import { UniversityLogoStrip } from "@/components/sections/university-logo-strip";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CareerPathwaysSection } from "@/components/sections/career-pathways-section";
import { PromotedCoursesSection } from "@/components/sections/promoted-courses-section";
import { GlobalReadinessSection } from "@/components/sections/global-readiness-section";
import { StatsStrip } from "@/components/sections/stats-strip";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { FadeIn } from "@/components/sections/fade-in";
import { SectorGrid } from "@/components/sections/sector-grid";
import { Bot, Scale, Calculator, Bell, ArrowUpRight, CheckCircle2, Clock3, FileCheck2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { getCareerPathways } from "@/lib/queries/career-pathways";
import { formatNumber } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Discover Universities and Courses",
  description: "Explore universities, degree programs, online courses, and skill certifications with ratings and student insights.",
  path: "/",
});

export default async function Home() {
  const [onlineCourseListings, universityListings, blogs, universities, careerPathways] = await Promise.all([
    getCourseListings({ mode: "online" }),
    getUniversityListings(),
    getBlogs(),
    getUniversities(),
    getCareerPathways(),
  ]);

  const onlineUniversityListings = universityListings.filter((item) => item.university.mode_supported.includes("Online"));
  const onlineUniversities = universities.filter((university) => university.mode_supported.includes("Online"));
  const promotedCourses = [...onlineCourseListings]
    .sort((a, b) => b.review_count - a.review_count || b.average_rating - a.average_rating)
    .slice(0, 6);
  const totalOnlineStudents = onlineCourseListings.reduce((acc, item) => acc + item.student_count, 0);
  const homepageStudentsDisplay = 7200;
  const trustIndicators = [
    { label: "Verified Approvals", value: "UGC / AICTE / NAAC", icon: ShieldCheck },
    { label: "Student Guidance", value: "End-to-end Counselling", icon: Sparkles },
    { label: "Response Time", value: "< 10 minutes on WhatsApp", icon: Clock3 },
    { label: "Admission Workflow", value: "Trackable and Transparent", icon: FileCheck2 },
  ];

  const spotlightSlugOrder = [
    "mangalayatan-university",
    "noida-international-university",
    "dr-preeti-global-university",
    "glocal-university",
    "bharati-vidyapeeth-university",
  ];

  const listingBySlug = new Map(universityListings.map((item) => [item.university.slug, item]));
  const universityBySlug = new Map(universities.map((item) => [item.slug, item]));
  const spotlightUniversities = spotlightSlugOrder
    .map((slug) => {
      const listing = listingBySlug.get(slug);
      const base = listing?.university ?? universityBySlug.get(slug);
      if (!base) return null;
      return {
        university: base,
        course_count: listing?.course_count ?? 0,
        student_count: listing?.student_count ?? 0,
        average_rating: listing?.average_rating ?? 4.4,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="relative pb-10">
      <HeroSection universities={universities} />
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:px-6 md:py-10">
        <FadeIn>
          <UniversityLogoStrip universities={onlineUniversities} />
        </FadeIn>

        <FadeIn delay={0.02}>
          <section className="grid gap-5 lg:grid-cols-[1.45fr,1fr]">
            <article className="futuristic-surface rounded-3xl border border-slate-200 p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Trusted Advantage
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                    Admissions Support Built for Clarity and Speed
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {trustIndicators.map((item) => (
                  <article key={item.label} className="motion-card rounded-xl border border-slate-200 bg-white/80 p-4">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-800">{item.value}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 text-white shadow-lg md:p-6">
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Live Platform Snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <p className="text-xs text-slate-200">Online Courses</p>
                  <p className="mt-1 text-2xl font-extrabold">{formatNumber(onlineCourseListings.length)}+</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <p className="text-xs text-slate-200">Online Universities</p>
                  <p className="mt-1 text-2xl font-extrabold">{formatNumber(onlineUniversityListings.length)}+</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <p className="text-xs text-slate-200">Students Enrolled</p>
                  <p className="mt-1 text-2xl font-extrabold">{formatNumber(homepageStudentsDisplay)}+</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <p className="text-xs text-slate-200">Career Pathways</p>
                  <p className="mt-1 text-2xl font-extrabold">{formatNumber(careerPathways.length)}+</p>
                </div>
              </div>
              <Link href="/consultation" className="btn-future mt-4 inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white">
                Start Free Counselling
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          </section>
        </FadeIn>

        <FadeIn delay={0.021}>
          <GlobalReadinessSection />
        </FadeIn>

        <FadeIn delay={0.024}>
          <CareerPathwaysSection pathways={careerPathways} />
        </FadeIn>

        <FadeIn delay={0.026}>
          <PromotedCoursesSection
            courses={promotedCourses}
            title="Sponsored Course Spotlight"
            subtitle="High-engagement programs highlighted for the current admission cycle."
          />
        </FadeIn>

        <FadeIn delay={0.03} className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Most Popular Picks
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">High-Intent Universities</h2>
              <p className="mt-1 text-sm text-slate-600">Top shortlisted universities by students on this platform.</p>
            </div>
            <Link href="/universities" className="text-sm font-semibold text-blue-700">
              Explore all universities
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {spotlightUniversities.map((item) => (
              <article
                key={item.university.slug}
                className="motion-card group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  Most Popular
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {item.university.logo ? (
                      <Image src={item.university.logo} alt={item.university.name} fill sizes="40px" className="object-contain p-1.5" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-semibold text-slate-500">LOGO</div>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm font-bold text-slate-900">{item.university.name}</p>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p>{item.course_count} programs</p>
                  <p>{formatNumber(item.student_count)} students</p>
                  <p>{item.average_rating.toFixed(1)} avg rating</p>
                </div>
                <Link
                  href={`/universities/${item.university.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 transition group-hover:text-blue-800"
                >
                  View profile
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.05} className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Browse Sectors</h2>
            <p className="text-sm text-slate-500">Domain-first exploration</p>
          </div>
          <SectorGrid />
        </FadeIn>

        <FadeIn delay={0.08} className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">All Online Universities</h2>
            <Link href="/universities" className="text-sm font-semibold text-blue-700">
              View all
            </Link>
          </div>
          <UniversityGrid universities={onlineUniversityListings} />
        </FadeIn>

        <FadeIn delay={0.12}>
          <StatsStrip students={homepageStudentsDisplay} courses={onlineCourseListings.length} universities={onlineUniversityListings.length} />
        </FadeIn>

        <FadeIn delay={0.13} className="space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Advanced Student Tools</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Link href="/ai-advisor" className="motion-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><Bot className="h-4 w-4" />AI Course Advisor</p>
              <p className="mt-2 text-sm text-slate-600">Get top 5 university and course recommendations by budget and career goal.</p>
            </Link>
            <Link href="/compare" className="motion-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><Scale className="h-4 w-4" />Compare 2.0</p>
              <p className="mt-2 text-sm text-slate-600">Side-by-side university comparison for approvals, fees, support and eligibility.</p>
            </Link>
            <Link href="/scholarship-emi" className="motion-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><Calculator className="h-4 w-4" />Scholarship + EMI</p>
              <p className="mt-2 text-sm text-slate-600">Check scholarship eligibility and monthly EMI instantly.</p>
            </Link>
            <Link href="/shortlist" className="motion-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><Bell className="h-4 w-4" />Saved Shortlist + Alerts</p>
              <p className="mt-2 text-sm text-slate-600">Save courses and get alerts for deadlines, fee updates, and new programs.</p>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.14}>
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Premium Support Stack
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">Everything needed for faster admission decisions</h3>
                <p className="mt-2 text-sm text-slate-200">
                  AI guidance, real-time comparison, application tracking, and counsellor-backed support in one workflow.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "AI + Human counselling support",
                  "Mode-wise and fee-wise comparison",
                  "Real-time application status updates",
                  "Deadline, scholarship, and EMI alerts",
                ].map((line) => (
                  <div key={line} className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm">
                    <p className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.16} className="space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Latest from Blog</h2>
          <BlogPreview blogs={blogs} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ConsultationCta />
        </FadeIn>
      </main>
    </div>
  );
}
