import Link from "next/link";
import { ArrowRight, Clock3, Globe2, Languages, ShieldCheck, WalletCards } from "lucide-react";

const highlights = [
  {
    icon: Globe2,
    title: "Global Accessibility",
    text: "Discover online, distance, and hybrid programs you can pursue from anywhere.",
  },
  {
    icon: Languages,
    title: "English-First Guidance",
    text: "International-friendly counselling flow with clear process and document support.",
  },
  {
    icon: WalletCards,
    title: "Multi-Currency Fee Visibility",
    text: "Course cards now include approximate USD, EUR, and AED fee visibility.",
  },
  {
    icon: Clock3,
    title: "Timezone-Friendly Support",
    text: "AI counsellor and WhatsApp-first assistance for faster global response windows.",
  },
];

const regionChips = ["India", "Middle East", "Africa", "Europe", "North America", "South Asia"];

export function GlobalReadinessSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Global Learner Ready
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Built to serve students across the globe</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            Our platform is designed for international discovery, transparent comparisons, and faster counselling so students worldwide can make confident admission decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {regionChips.map((region) => (
            <span key={region} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {region}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <item.icon className="h-4 w-4" />
              {item.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/international-students" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          International Admissions Guide
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/consultation" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
          Talk to Global Counsellor
        </Link>
      </div>
    </section>
  );
}

