import Link from "next/link";
import { Clock3, FileCheck2, Globe2, GraduationCap, Landmark, Languages, WalletCards } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "International Students",
  description:
    "Global admissions guidance for online, distance, vocational, and skill programs with document support, fee transparency, and counsellor assistance.",
  path: "/international-students",
});

const steps = [
  { title: "Explore Programs", text: "Choose mode, university, and course based on your goals and budget.", icon: GraduationCap },
  { title: "Document Guidance", text: "Get help with eligibility and required document checklist before submission.", icon: FileCheck2 },
  { title: "Application Support", text: "Receive counsellor support through every admission stage and status update.", icon: Landmark },
  { title: "Enrolment Tracking", text: "Track decision timeline and important updates from dashboard and notices.", icon: Clock3 },
];

const why = [
  { title: "Global-friendly process", text: "Built for students applying from outside India or across regions in India.", icon: Globe2 },
  { title: "English-first communication", text: "Clear, practical guidance for applications, approvals, and timelines.", icon: Languages },
  { title: "Transparent fee visibility", text: "INR with approximate global currency context for faster decisions.", icon: WalletCards },
];

export default function InternationalStudentsPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <header className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-6 text-white shadow-lg md:p-8">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Global Admissions
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">International Students Admissions Desk</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 md:text-base">
          Compare universities, understand eligibility, and apply with confidence through our structured global admissions support.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/courses" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-slate-100">
            Explore Courses
          </Link>
          <Link href="/consultation" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
            Speak to Counsellor
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {why.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <item.icon className="h-4 w-4" />
              {item.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">How international admissions work</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <step.icon className="h-4 w-4" />
                Step {index + 1}
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

