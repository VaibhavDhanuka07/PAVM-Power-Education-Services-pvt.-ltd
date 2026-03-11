import { LockKeyhole, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PrivacyChecklistForm } from "@/components/forms/privacy-checklist-form";

export const metadata = buildMetadata({
  title: "Privacy and Security Policy",
  description: "Read privacy and security practices for PAVM EduDiscover user data and submissions.",
  path: "/privacy-security",
});

export default function PrivacySecurityPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <LockKeyhole className="h-3.5 w-3.5" />
          Privacy and Security
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Privacy and Security Policy</h1>
        <p className="mt-3 text-slate-700">
          This page explains how we collect, use, and protect user information submitted on PAVM EduDiscover.
        </p>
      </header>

      <article className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2 text-sm text-slate-700">
            We collect basic contact and preference details such as name, phone, email, and course interest when users submit consultation or review forms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. How We Use Information</h2>
          <p className="mt-2 text-sm text-slate-700">
            Submitted data is used to provide counselling support, shortlist relevant programs, and improve platform quality and user experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Security Controls</h2>
          <p className="mt-2 text-sm text-slate-700">
            We use secured APIs and controlled access patterns. Sensitive records are handled through authenticated workflows and moderation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Data Sharing</h2>
          <p className="mt-2 text-sm text-slate-700">
            We do not sell user data. Information is shared only when required for counselling or admission process coordination.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">5. User Rights</h2>
          <p className="mt-2 text-sm text-slate-700">
            Users can contact us to update or remove submitted details wherever applicable and legally allowed.
          </p>
        </section>
      </article>

      <div className="inline-flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
        <p>Authentication message: submissions are verified and protected under our security workflow.</p>
      </div>

      <PrivacyChecklistForm />
    </section>
  );
}
