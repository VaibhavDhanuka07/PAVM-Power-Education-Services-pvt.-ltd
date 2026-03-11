import Link from "next/link";
import { cookies } from "next/headers";
import { ChevronDown, Globe2, Mail, MapPin, Menu, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ExploreMegaMenu } from "@/components/layout/explore-mega-menu";
import { BrandLockup } from "@/components/layout/brand-lockup";
import { HeaderAuthControls, HeaderAuthMenu } from "@/components/layout/header-auth-controls";
import { getUniversities } from "@/lib/queries/universities";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { AppRole, normalizeAppRole } from "@/lib/auth/roles";
import { normalizeModeSlug } from "@/lib/utils";

const modeOrder = ["Regular", "Online", "Distance", "Vocational", "Skill Certification"];
const fallbackModeUniversities: Record<string, string[]> = {
  regular: [
    "marwadi-university",
    "noida-international-university",
    "rayat-bahra-university",
    "dr-preeti-global-university",
    "coer-university",
    "guru-nanak-university-hyderabad",
    "niat",
    "suryadatta-group-of-institutions",
    "north-east-christian-university",
  ],
  online: [
    "shoolini-university",
    "uttaranchal-university",
    "marwadi-university",
    "mangalayatan-university",
    "maharishi-markandeshwar-university",
    "noida-international-university",
    "suresh-gyan-vihar-university",
    "bharati-vidyapeeth-university",
  ],
  distance: ["mangalayatan-university", "bharati-vidyapeeth-university"],
  vocational: ["glocal-university"],
  "skill-certification": ["glocal-university"],
};

const normalizeMode = (mode: string) => normalizeModeSlug(mode);

function getUniversitiesForMode(mode: string, universities: Awaited<ReturnType<typeof getUniversities>>) {
  const modeSlug = normalizeMode(mode);
  const fallbackSlugs = fallbackModeUniversities[modeSlug] ?? [];

  const mapped = universities.filter((u) => {
    const supported = Array.isArray(u.mode_supported)
      ? u.mode_supported
      : String(u.mode_supported ?? "").split(",");
    return supported.map((value) => normalizeMode(String(value))).includes(modeSlug);
  });

  const fallback = universities.filter((u) => fallbackSlugs.includes(u.slug));
  return Array.from(new Map([...mapped, ...fallback].map((u) => [u.slug, u])).values());
}

export async function Header() {
  cookies();
  const universities = await getUniversities();
  let signedInEmail: string | null = null;
  let signedInRole: AppRole | null = null;
  const desktopNavLink =
    "nav-link-animated whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98] xl:text-[15px]";

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabase();
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        signedInEmail = authData.user.email ?? null;
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();
        signedInRole = normalizeAppRole(profile?.role) ?? "student";
      }
    } catch {
      signedInEmail = null;
      signedInRole = null;
    }
  }

  const dashboardHref =
    signedInRole === "admin"
      ? "/admin"
      : signedInRole === "associate"
        ? "/associate/dashboard"
        : "/student/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-950 via-blue-950 to-slate-900 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_28px]" />
        Unlock your potential with accredited online education options.
      </div>

      <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-4 py-1.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 sm:text-sm lg:justify-end lg:px-8">
          <span className="hidden items-center gap-2 font-semibold text-blue-700 md:inline-flex"><Globe2 className="icon-brand h-4 w-4" /> Serving learners globally</span>
          <span className="inline-flex items-center gap-2"><MapPin className="icon-brand h-4 w-4" /> Faridabad, Haryana</span>
          <span className="inline-flex items-center gap-2"><Phone className="icon-brand h-4 w-4" /> 9266602967</span>
          <span className="hidden items-center gap-2 lg:inline-flex"><Mail className="icon-brand h-4 w-4" /> onlineuniversity2025@gmail.com</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr),auto] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 lg:grid-cols-[minmax(240px,320px),1fr,minmax(260px,400px)] lg:gap-4 lg:px-8">
        <BrandLockup />

        <div className="hidden justify-center lg:flex">
          <nav className="futuristic-surface flex items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            <Link href="/" className={desktopNavLink}>Home</Link>
            <ExploreMegaMenu universities={universities} modeOrder={modeOrder} />
            <Link href="/universities" className={desktopNavLink}>Universities</Link>
            <Link href="/courses" className={desktopNavLink}>Courses</Link>
            <Link href="/apply-now" className={desktopNavLink}>Apply Now</Link>
            <Link href="/ratings" className={desktopNavLink}>Reviews</Link>
            <Link href="/blog" className={desktopNavLink}>Blog</Link>

            <details className="group relative">
              <summary className="nav-link-animated flex list-none cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 xl:text-[15px]">
                More
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="futuristic-surface absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                <Link href="/about-us" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">About Us</Link>
                <Link href="/authorizations" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">Authorizations</Link>
                <Link href="/international-students" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">International Students</Link>
                <Link href="/career-pathways" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">Career Pathways</Link>
                <Link href="/ai-advisor" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">AI Advisor</Link>
                <Link href="/shortlist" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">Shortlist</Link>
                <Link href="/contact-us" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700">Contact Us</Link>
                {signedInEmail ? (
                  <>
                    <div className="my-1 h-px bg-slate-200" />
                    <Link
                      href={dashboardHref}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/logout"
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                    >
                      Logout
                    </Link>
                  </>
                ) : null}
              </div>
            </details>
          </nav>
        </div>

        <div className="hidden min-w-0 items-center justify-end gap-2 lg:flex">
          <HeaderAuthControls initialEmail={signedInEmail} initialRole={signedInRole} />
          <Link href="/consultation" className={`${buttonVariants({ size: "sm" })} btn-future h-8 rounded-xl px-3 text-xs`}>
            Free Counselling
          </Link>
        </div>

        <details className="justify-self-end lg:col-start-3 lg:hidden">
          <summary className="list-none rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute left-0 right-0 top-full z-50 border-t border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="mx-auto max-h-[calc(100vh-8.5rem)] max-w-7xl space-y-3 overflow-y-auto pr-1 sm:max-h-[calc(100vh-9.5rem)]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                Menu
              </div>
              <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Home</Link>

              <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-800">Explore by Mode</summary>
                <div className="space-y-2 p-2">
                  {modeOrder.map((mode) => {
                    const list = getUniversitiesForMode(mode, universities);
                    const modeSlug = normalizeMode(mode);

                    return (
                      <details key={mode} className="rounded-lg border border-slate-100 bg-slate-50">
                        <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-blue-700">{mode}</summary>
                        <div className="space-y-1 p-2">
                          <Link href={`/courses?mode=${modeSlug}`} className="block rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-white">
                            View all {mode}
                          </Link>
                          <Link href={`/programs/${modeSlug}`} className="block rounded-md px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-white">
                            {mode} overview
                          </Link>
                          {list.map((u) => (
                            <Link
                              key={u.slug}
                              href={`/courses?mode=${modeSlug}&university=${u.slug}`}
                              className="block rounded-md px-2 py-1 text-xs text-slate-700 hover:bg-white"
                            >
                              {u.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </details>

              <Link href="/universities" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Universities</Link>
              <Link href="/apply-now" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Apply Now</Link>
              <Link href="/about-us" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">About Us</Link>
              <Link href="/authorizations" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Authorizations</Link>
              <Link href="/international-students" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">International Students</Link>
              <Link href="/ratings" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Reviews</Link>
              <Link href="/blog" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Blog</Link>
              <Link href="/career-pathways" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Career Pathways</Link>
              <Link href="/ai-advisor" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">AI Advisor</Link>
              <Link href="/shortlist" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Shortlist</Link>
              <Link href="/contact-us" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">Contact Us</Link>
              <HeaderAuthMenu initialEmail={signedInEmail} initialRole={signedInRole} />
              <Link href="/consultation" className={`${buttonVariants()} btn-future w-full rounded-xl text-center`}>
                Free Counselling
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
