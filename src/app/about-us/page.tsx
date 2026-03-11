import Image from "next/image";
import { CheckCircle2, Eye, Target, TrendingUp, Sparkles, ShieldCheck, Users2, Building2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ConsultationForm } from "@/components/forms/consultation-form";

const values = [
  "Excellence: Striving for the highest standards in teaching, research, and service.",
  "Integrity: Acting with honesty, ethics, and accountability.",
  "Innovation: Encouraging creativity, research, and forward-thinking.",
  "Inclusivity: Embracing diversity and ensuring an equitable environment.",
  "Collaboration: Fostering teamwork and community partnerships.",
  "Student-Centricity: Supporting student growth and success.",
  "Social Responsibility: Engaging in societal impact and civic duty.",
  "Lifelong Learning: Promoting continuous growth and curiosity.",
  "Respect: Valuing dignity, fairness, and mutual understanding.",
];

const visionPoints = [
  "Globally Recognized Center of Excellence",
  "Vibrant Learning Ecosystem",
  "Empowers Individuals to Achieve Their Full Potential",
  "Drive Societal Progress",
  "Contribute to a Sustainable and Equitable Future",
];

const trustPoints = [
  "MSME Registered and ISO Certified organization",
  "Integrated online, distance, vocational, and skill pathways",
  "Counsellor-supported admissions with transparent guidance",
  "National network of university partnerships and references",
];

const thirdPartyLogos = [
  "/logos/universities/suryadatta-group-of-institutions.jpeg",
  "/logos/universities/sanskaram-university.jpeg",
  "/logos/universities/coer-university.jpeg",
  "/logos/universities/dr-preeti-global-university.jpeg",
  "/logos/universities/rayat-bahra-university.jpeg",
  "/logos/universities/guru-nanak-university-hyderabad.jpeg",
  "/logos/universities/mangalayatan-university.jpeg",
  "/logos/universities/north-east-christian-university.jpeg",
  "/logos/universities/shoolini-university.jpeg",
  "/logos/universities/marwadi-university.jpeg",
  "/logos/universities/maharishi-markandeshwar-university.jpeg",
  "/logos/universities/aarni-university.jpeg",
  "/logos/universities/glocal-university.jpeg",
];

export const metadata = buildMetadata({
  title: "About Us",
  description: "About PAVM Power Education Services Pvt. Ltd., mission, vision, values, leadership, and academic partnerships.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6 md:py-12">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.24),transparent_36%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,0.24),transparent_40%)]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              About PAVM Power Education Services Pvt. Ltd.
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              Building an inclusive, technology-enabled education guidance ecosystem
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-200 md:text-lg">
              PAVM Power Education Services Pvt. Ltd. is an MSME Registered and ISO Certified company incorporated in 2017 by educational
              professionals with a mission to make quality education accessible, especially for underserved and under-privileged zones.
            </p>
            <p className="mt-3 text-base leading-8 text-slate-200 md:text-lg">
              We use technology to support students and parents beyond academics, including emotional well-being, counselling, and
              long-term guidance through a trusted university discovery and admissions workflow.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-300/35 bg-gradient-to-br from-slate-950/95 via-blue-950/90 to-indigo-950/90 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Trust and Reliability
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-100">
              {trustPoints.map((point) => (
                <p key={point} className="inline-flex items-start gap-2 rounded-xl border border-blue-300/20 bg-slate-900/55 px-3 py-2.5 leading-6 text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Target className="h-5 w-5 text-blue-700" />
            Mission
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            To create an environment of Academic Excellence by delivering high-quality, accessible education and impactful support systems.
            We aim to cultivate critical thinking, ethical leadership, and meaningful contribution to professions and communities.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Eye className="h-5 w-5 text-blue-700" />
            Vision
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            To become a most admired brand in education and help deserving aspirants realize their goals through quality programs, expert
            guidance, and strong university-industry associations for healthier placement opportunities.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-800 md:text-base">
            {visionPoints.map((point) => (
              <li key={point} className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-700" />
                {point}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <TrendingUp className="h-5 w-5 text-blue-700" />
          Core Values
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {values.map((value) => (
            <p key={value} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
              {value}
            </p>
          ))}
        </div>
      </article>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Promoters and Directors</h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          {["Anil Kumar Dhanuka", "Anju Aggarwal"].map((name) => (
            <article key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Users2 className="h-6 w-6" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{name}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-12 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Advisors</h3>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
          {["CA P K Aggarwal", "CA Rajneesh Jain", "Adv. Sunil Prakash"].map((name) => (
            <article key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">University and Institute Logo References</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {thirdPartyLogos.map((logo) => (
              <div key={logo} className="relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Image src={logo} alt="University partner logo" fill sizes="180px" className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">Disclaimer: Third-Party Logos</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Logos shown on this website belong to their respective universities or educational institutes. Their presence is for
            informational and partnership-reference purposes only and does not imply direct endorsement or ownership.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-700">
            All trademarks, service marks, and brand assets remain the property of their respective owners. PAVM Power Education Services Pvt. Ltd. does not claim
            intellectual property rights over third-party logos.
          </p>
        </article>
      </section>

      <section className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr,1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">Why Choose Us for Your Education?</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Discover practical benefits of working with a reliable education discovery and admissions guidance partner.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <p className="text-2xl font-bold text-slate-900">Quality Education Mapping</p>
                <p className="text-base text-slate-700">Programs aligned to UGC, AICTE, and NAAC accredited references.</p>
              </div>
            </div>
            <div className="inline-flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <p className="text-2xl font-bold text-slate-900">Flexible Learning Modes</p>
                <p className="text-base text-slate-700">Choose online, distance, vocational, skill certification, or regular programs.</p>
              </div>
            </div>
            <div className="inline-flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <p className="text-2xl font-bold text-slate-900">Career-Aligned Counselling</p>
                <p className="text-base text-slate-700">Personalized counselling and admissions support from enquiry to enrollment.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 md:text-5xl">Start Your Journey</h3>
            <p className="mt-3 text-base leading-8 text-slate-700">
              Fill in your details to receive a curated shortlist and guided admission support.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <ConsultationForm />
        </div>
      </section>
    </section>
  );
}
