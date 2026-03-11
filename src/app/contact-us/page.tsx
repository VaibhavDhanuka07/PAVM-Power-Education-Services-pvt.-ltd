import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ConsultationForm } from "@/components/forms/consultation-form";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Contact PAVM EduDiscover for admissions, counselling, and course guidance.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Contact and Support
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Get in touch with our admissions team</h1>
        <p className="mt-2 text-slate-600">
          Share your preferred course, university, and mode. Our counsellor will connect with verified guidance and next admission steps.
        </p>

        <div className="mt-6">
          <ConsultationForm />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Office Contact</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-700" /> Faridabad, Haryana</p>
            <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-blue-700" /> +91 92666 02967</p>
            <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-blue-700" /> onlineuniversity2025@gmail.com</p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="inline-flex items-center gap-2 text-lg font-bold text-emerald-900">
            <ShieldCheck className="h-5 w-5" />
            User Authentication and Security
          </h3>
          <p className="mt-2 text-sm text-emerald-800">
            Every enquiry is processed through secured channels. We validate and moderate user submissions before counsellor outreach.
          </p>
        </div>
      </div>
    </section>
  );
}

