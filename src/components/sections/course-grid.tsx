import Link from "next/link";
import { BadgeIndianRupee, GraduationCap, Star, Clock3, BookmarkPlus, Layers3, School } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";
import { FadeIn } from "@/components/sections/fade-in";
import { cn, formatCourseFee, formatCurrency, formatGlobalFeePreview, formatNumber, slugify } from "@/lib/utils";
import { getFeeBreakdown } from "@/lib/course-content";
import { CourseListing } from "@/lib/types";

function bannerTone(seed: string) {
  const tones = [
    "from-blue-700 to-indigo-700",
    "from-cyan-700 to-blue-700",
    "from-slate-800 to-blue-800",
    "from-indigo-700 to-violet-700",
    "from-teal-700 to-cyan-700",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return tones[Math.abs(hash) % tones.length];
}

export function CourseGrid({
  courses,
  compact = false,
  square = false,
}: {
  courses: CourseListing[];
  compact?: boolean;
  square?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch",
        square
          ? "gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
          : compact
            ? "gap-4 sm:grid-cols-2 xl:grid-cols-3"
            : "gap-6 sm:grid-cols-2 2xl:grid-cols-3",
      )}
    >
      {courses.map((item, index) => {
        const tone = bannerTone(item.course.slug);
        const fee = getFeeBreakdown(item.course.mode?.name, item.min_fees, item.course.duration);
        const globalFees = formatGlobalFeePreview(item.course.mode?.name, item.min_fees);
        const displayedStudents = Math.max(item.student_count, 7200);
        const initials = item.course.name
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join("");

        return (
          <FadeIn key={item.course.id} delay={(index % 12) * 0.03} className="min-h-0">
            <Card
              className={cn(
                "motion-card premium-card group flex h-full flex-col overflow-hidden transition-all duration-300",
                square
                  ? "min-h-[410px] rounded-2xl hover:translate-y-0 hover:shadow-lg"
                  : compact
                    ? "min-h-[520px] rounded-2xl hover:shadow-xl hover:shadow-blue-900/10"
                    : "rounded-3xl hover:shadow-xl hover:shadow-blue-900/10",
              )}
            >
              <div className={cn(`relative bg-gradient-to-r ${tone}`, square ? "h-14" : compact ? "h-20" : "h-32")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.28),transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_35%,rgba(255,255,255,0.1)_70%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className={cn("relative flex h-full items-end justify-between text-white", compact ? "px-3 pb-3" : "px-4 pb-4")}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{item.course.mode?.name}</p>
                    <p className={cn("line-clamp-1 opacity-90", square ? "max-w-[165px] text-[11px]" : compact ? "text-xs" : "text-sm")}>
                      {item.course.sector?.name}
                    </p>
                  </div>
                  <span className={cn("rounded-xl bg-white/20 font-bold shadow-inner", compact ? "px-2.5 py-1 text-base" : "px-3 py-1.5 text-xl")}>
                    {initials}
                  </span>
                </div>
              </div>

              <CardHeader
                className={cn(
                  "space-y-3 pb-2",
                  square ? "min-h-[130px] space-y-1.5 p-3 pb-1" : compact && "min-h-[170px] space-y-2 p-4 pb-2",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge className="w-fit bg-blue-50 text-blue-700">{item.course.mode?.name ?? "Program"}</Badge>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Rating</p>
                    <p className="inline-flex items-center gap-1 text-sm font-bold text-slate-800">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {item.average_rating}
                    </p>
                  </div>
                </div>
                <CardTitle className={cn("line-clamp-2 leading-tight", square ? "text-[1.06rem]" : compact ? "text-lg" : "text-xl")}>
                  {item.course.name}
                </CardTitle>
                <CardDescription className={cn("text-[13px] leading-snug", square ? "line-clamp-2" : compact ? "line-clamp-1" : "line-clamp-2")}>
                  {item.course.description}
                </CardDescription>
                {!square ? (
                  <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {slugify(item.course.sector?.name || "sector").replace(/-/g, " ")}
                  </span>
                ) : null}
              </CardHeader>

              <CardContent className={cn("flex flex-1 flex-col", compact && "p-4 pt-0")}>
                {square ? (
                  <>
                    <div className="grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2.5 font-semibold text-slate-900">
                        <BadgeIndianRupee className="h-3.5 w-3.5 text-blue-600" />
                        {formatCourseFee(item.course.mode?.name, item.min_fees)}
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2.5">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {item.average_rating} rating
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2.5">
                        <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                        {item.course.duration}
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2.5">
                        <School className="h-3.5 w-3.5 text-blue-600" />
                        {item.university_count} universities
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2.5 sm:col-span-2">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                        {formatNumber(displayedStudents)}+ enrolled
                      </p>
                    </div>
                  </>
                ) : (
                  <div className={cn("flex flex-1 flex-col text-sm text-slate-700", compact ? "space-y-2.5" : "space-y-3")}>
                    <div className={cn("rounded-xl border border-blue-100 bg-blue-50/70", compact ? "p-2.5" : "p-3")}>
                      <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <BadgeIndianRupee className="h-4 w-4 text-blue-600" />
                        {slugify(item.course.mode?.name ?? "") === "regular" ? "Fees: " : "From "}
                        {formatCourseFee(item.course.mode?.name, item.min_fees)}
                      </p>
                      <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                        <p>
                          1 Year Fees: <span className="font-semibold text-slate-800">{fee.perYearLabel}</span>
                        </p>
                        <p>
                          1 Semester Fees: <span className="font-semibold text-slate-800">{fee.perSemesterLabel}</span>
                        </p>
                      </div>
                      {!compact && globalFees ? (
                        <p className="mt-2 text-xs text-slate-600">
                          Approx global: <span className="font-semibold text-slate-800">{globalFees.usd}</span> |{" "}
                          <span className="font-semibold text-slate-800">{globalFees.eur}</span> |{" "}
                          <span className="font-semibold text-slate-800">{globalFees.aed}</span>
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                        {item.course.duration}
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <School className="h-3.5 w-3.5 text-blue-600" />
                        {item.university_count} universities
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 sm:col-span-2">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                        {formatNumber(displayedStudents)} students enrolled
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                      <Stars value={item.average_rating} />
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {item.average_rating} ({item.review_count} reviews)
                      </span>
                    </div>

                    {!compact && item.levels?.length ? (
                      <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-2">
                        <p className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          <Layers3 className="h-3.5 w-3.5" />
                          Program Levels
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.levels.map((level) => (
                            <span
                              key={`${item.course.slug}-${level.slug}`}
                              className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700"
                            >
                              {level.label}: {formatCurrency(level.fees)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className={cn("mt-auto flex flex-wrap gap-2", square ? "pt-2" : compact ? "mt-3" : "mt-4")}>
                  <Link
                    href={`/courses/${item.course.slug}`}
                    className={cn(
                      "inline-flex rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]",
                      square && "w-full justify-center",
                    )}
                  >
                    View details
                  </Link>
                  {!square ? (
                    <Link
                      href={`/shortlist?course=${item.course.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 active:scale-[0.98]"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        );
      })}
    </div>
  );
}
