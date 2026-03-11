import Link from "next/link";
import { University } from "@/lib/types";
import { cn, normalizeModeSlug } from "@/lib/utils";

type SearchParams = {
  mode?: string;
  university?: string;
  sector?: string;
  duration?: string;
  search?: string;
  level?: string;
};

function buildHref(params: SearchParams) {
  const qp = new URLSearchParams();
  if (params.mode) qp.set("mode", params.mode);
  if (params.university) qp.set("university", params.university);
  if (params.sector) qp.set("sector", params.sector);
  if (params.duration) qp.set("duration", params.duration);
  if (params.search) qp.set("search", params.search);
  if (params.level) qp.set("level", params.level);
  const q = qp.toString();
  return q ? `/courses?${q}` : "/courses";
}

export function CourseQuickFilters({
  universities,
  modes,
  searchParams,
}: {
  universities: University[];
  modes: { name: string }[];
  searchParams: SearchParams;
}) {
  const activeMode = normalizeModeSlug(searchParams.mode);

  return (
    <aside className="futuristic-surface rounded-3xl border border-slate-200 p-4 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Quick Filters</h3>
      <p className="mt-1 text-xs text-slate-500">Choose mode and university in one click</p>

      <div className="custom-scrollbar mt-3 max-h-[65vh] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-11.5rem)]">
        <Link
          href="/courses"
          className={cn(
            "block rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition",
            !searchParams.mode && !searchParams.university ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
          )}
        >
          All Courses
        </Link>

        {modes.map((mode) => {
          const modeSlug = normalizeModeSlug(mode.name);
          const modeUniversities = universities.filter((u) =>
            u.mode_supported.some((modeName) => normalizeModeSlug(modeName) === modeSlug),
          );
          const modeActive = activeMode === modeSlug;

          return (
            <div key={mode.name} className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40">
              <Link
                href={buildHref({ ...searchParams, mode: modeSlug, university: undefined })}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm font-semibold",
                  modeActive ? "bg-white text-blue-700" : "text-slate-800 hover:bg-white",
                )}
              >
                {mode.name}
              </Link>

              <div className="mt-1 space-y-1">
                {modeUniversities.map((u) => {
                  const active = searchParams.university === u.slug;
                  return (
                    <Link
                      key={u.slug}
                      href={buildHref({ ...searchParams, mode: modeSlug, university: u.slug })}
                      className={cn(
                        "block rounded-md px-2 py-1 text-xs",
                        active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-white",
                      )}
                    >
                      {u.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

