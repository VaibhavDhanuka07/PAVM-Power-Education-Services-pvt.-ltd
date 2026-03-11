import Link from "next/link";
import { ArrowRight, BadgeCheck, PhoneCall } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function ConsultationCta() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-10 text-white shadow-xl shadow-blue-900/10">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
          <BadgeCheck className="h-3.5 w-3.5" />
          Free Expert Guidance
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Need help choosing the right course?</h2>
        <p className="mt-2 max-w-3xl text-slate-200">
          Talk to an education counsellor and get a personalized shortlist across online, distance, vocational, and regular degree programs.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/consultation" className={`${buttonVariants()} rounded-xl bg-blue-500 hover:bg-blue-600`}>
            Book Free Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a href="tel:+919266602967" className={`${buttonVariants({ variant: "outline" })} rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20`}>
            <PhoneCall className="mr-2 h-4 w-4" />
            Call Counsellor
          </a>
        </div>
      </div>
    </section>
  );
}
