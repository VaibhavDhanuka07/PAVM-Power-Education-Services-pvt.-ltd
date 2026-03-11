import { BadgeCheck, Clock3, PhoneCall, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ConsultationForm } from "@/components/forms/consultation-form";

export const metadata = buildMetadata({
  title: "Consultation",
  description: "Request personalized consultation for university and course selection.",
  path: "/consultation",
});

export default function ConsultationPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          Free Career Counselling
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Get your personalized university shortlist</h1>
        <p className="mt-2 text-slate-600">
          Share your goal and we will recommend best-fit universities, courses, fees, and admission steps across online, distance, vocational, skill, and regular modes.
        </p>

        <div className="mt-6">
          <ConsultationForm />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">What you will get</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="inline-flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-blue-700" />Mode-wise course shortlist</li>
            <li className="inline-flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-blue-700" />University and fee comparison</li>
            <li className="inline-flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-blue-700" />Admission process guidance</li>
            <li className="inline-flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-blue-700" />Counsellor support till enrollment</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Fast response support</h3>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4 text-blue-700" />Typical response time: under 30 minutes</p>
          <a href="tel:+919266602967" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <PhoneCall className="h-4 w-4" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
