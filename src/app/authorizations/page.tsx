import Image from "next/image";
import { BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

const authorizations = [
  {
    name: "UGC Approved",
    logo: "/logos/authorizations/ugc.jpeg",
    note: "Programs aligned with UGC recognition standards.",
    status: "Approved",
  },
  {
    name: "AICTE Approved",
    logo: "/logos/authorizations/aicte.jpeg",
    note: "Technical and professional pathways mapped with AICTE context.",
    status: "Approved",
  },
  {
    name: "DEB (Distance Education Bureau)",
    logo: "/logos/authorizations/deb.jpeg",
    note: "Distance/ODL references follow DEB compliance guidance.",
    status: "Reference",
  },
  {
    name: "UGC DEB",
    logo: "/logos/authorizations/ugc-deb.jpeg",
    note: "Distance Education Bureau seal reference used for ODL mode visibility and compliance context.",
    status: "Reference",
  },
  {
    name: "AIU Approved",
    logo: "/logos/authorizations/aiu.jpeg",
    note: "University equivalence and membership references are considered.",
    status: "Approved",
  },
  {
    name: "NAAC A+",
    logo: "/logos/authorizations/naac-a-plus.jpeg",
    note: "Quality grading reference surfaced for university comparison.",
    status: "A+ Grade",
  },
  {
    name: "NSDC Skill Ecosystem",
    logo: "/logos/authorizations/nsdc.svg",
    note: "Skill and vocational pathways are mapped to employability tracks.",
    status: "Reference",
  },
  {
    name: "BCI Approved",
    logo: "/logos/authorizations/bci.jpeg",
    note: "Legal education compliance mapped with Bar Council references.",
    status: "Approved",
  },
  {
    name: "PCI Approved",
    logo: "/logos/authorizations/pci.jpeg",
    note: "Pharmacy education pathways mapped with PCI standards.",
    status: "Approved",
  },
];

export const metadata = buildMetadata({
  title: "Authorizations and Accreditations",
  description: "Authorizations and accreditation references with logos.",
  path: "/authorizations",
});

export default function AuthorizationsPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-sm md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Trust and Compliance
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Authorizations and Accreditations</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Key regulatory and quality references used while presenting university and program information on the platform.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approvals tracked</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{authorizations.length}+</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quality grade</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">NAAC A+</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance focus</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">UGC + AICTE</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student trust</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">Verified</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {authorizations.map((item) => (
          <article key={item.name} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-[84px] w-[220px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={200}
                  height={72}
                  className="h-auto max-h-[68px] w-auto max-w-[92%] object-contain"
                />
              </div>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {item.status}
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900">{item.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.note}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Regulatory confidence
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
