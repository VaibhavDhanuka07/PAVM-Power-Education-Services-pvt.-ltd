import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function BrandLockup({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-950 via-blue-900 to-indigo-900 text-white shadow-md shadow-blue-900/30 ring-1 ring-white/10 sm:h-11 sm:w-11">
        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-900 sm:text-[12px]">
          PAVM Power Education Services
        </span>
        <span className="block text-[10px] font-semibold text-slate-600 sm:text-[11px]">
          Pvt. Ltd.
        </span>
      </span>
    </Link>
  );
}
