import Image from "next/image";
import Link from "next/link";
import { University } from "@/lib/types";

export function UniversityLogoStrip({ universities }: { universities: University[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trusted Universities</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Partner University Network</h2>
        </div>
        <Link href="/universities" className="text-sm font-semibold text-blue-700 hover:underline">
          View all universities
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {universities.map((university) => (
          <Link
            key={university.id}
            href={`/universities/${university.slug}`}
            className="motion-card group rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
          >
            <div className="relative mx-auto h-10 w-full max-w-[96px]">
              {university.logo ? (
                <Image
                  src={university.logo}
                  alt={university.name}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">Logo</div>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-center text-xs font-medium text-slate-700 group-hover:text-blue-700">{university.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
