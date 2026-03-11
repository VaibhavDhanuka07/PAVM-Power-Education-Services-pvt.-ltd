"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Megaphone, Sparkles, Clock3, BadgeIndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { CourseListing } from "@/lib/types";
import { formatCourseFee, slugify } from "@/lib/utils";

const AD_GRADIENTS = [
  "from-blue-700 via-indigo-700 to-violet-700",
  "from-cyan-700 via-blue-700 to-indigo-700",
  "from-teal-700 via-cyan-700 to-blue-700",
  "from-slate-800 via-blue-800 to-indigo-800",
  "from-indigo-700 via-blue-700 to-cyan-700",
];

const AD_LINES = [
  "Limited seats available for this intake.",
  "High-demand program with guided admissions.",
  "Top learner choice this admission season.",
  "Scholarship and EMI support available.",
  "Fast-track support from counsellor team.",
];

function pick(seed: string, list: string[]) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return list[Math.abs(hash) % list.length];
}

type MarqueeSpeed = "slow" | "normal" | "fast";
type MarqueeDirection = "rtl" | "ltr";

const SPEED_PRESETS: Record<MarqueeSpeed, number> = {
  slow: 56,
  normal: 40,
  fast: 26,
};

export function PromotedCoursesSection({
  courses,
  title = "Promoted Courses",
  subtitle = "Featured programs spotlighted for this admission cycle.",
}: {
  courses: CourseListing[];
  title?: string;
  subtitle?: string;
}) {
  const [speed, setSpeed] = useState<MarqueeSpeed>("normal");
  const [direction, setDirection] = useState<MarqueeDirection>("rtl");

  const { topRow, bottomRow } = useMemo(() => {
    if (!courses.length) {
      return { topRow: [] as CourseListing[], bottomRow: [] as CourseListing[] };
    }

    const top = courses.filter((_, index) => index % 2 === 0);
    const bottomSeed = courses.filter((_, index) => index % 2 !== 0);

    return {
      topRow: top.length ? top : courses,
      bottomRow: bottomSeed.length ? bottomSeed : courses,
    };
  }, [courses]);

  if (!courses.length) return null;

  const primaryDuration = SPEED_PRESETS[speed];
  const secondaryDuration = Math.max(18, primaryDuration - 6);
  const firstDirection = direction === "rtl" ? "normal" : "reverse";
  const secondDirection = direction === "rtl" ? "reverse" : "normal";

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl"
        animate={{ x: [0, 24, -12, 0], y: [0, 12, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl"
        animate={{ x: [0, -26, 16, 0], y: [0, -14, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700"
            animate={{ scale: [1, 1.04, 1], opacity: [1, 0.86, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Sponsored Highlights
          </motion.p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="rounded-xl border border-slate-200 bg-white p-1 text-[11px] font-semibold text-slate-600 shadow-sm sm:text-xs">
            <span className="px-2 py-1">Speed</span>
            {(["slow", "normal", "fast"] as MarqueeSpeed[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSpeed(value)}
                className={`rounded-md px-2.5 py-1 uppercase tracking-wide transition ${
                  speed === value ? "bg-blue-600 text-white shadow" : "hover:bg-slate-100"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-1 text-[11px] font-semibold text-slate-600 shadow-sm sm:text-xs">
            <span className="px-2 py-1">Direction</span>
            <button
              type="button"
              onClick={() => setDirection("rtl")}
              className={`rounded-md px-2.5 py-1 uppercase tracking-wide transition ${
                direction === "rtl" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-100"
              }`}
            >
              R to L
            </button>
            <button
              type="button"
              onClick={() => setDirection("ltr")}
              className={`rounded-md px-2.5 py-1 uppercase tracking-wide transition ${
                direction === "ltr" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-100"
              }`}
            >
              L to R
            </button>
          </div>

          <Link href="/courses" className="text-sm font-semibold text-blue-700 hover:underline">
            View full catalog
          </Link>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 py-2">
        <div className="sponsor-ticker whitespace-nowrap px-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Limited Seats | Admission Window Open | Scholarship Support | EMI Available | Limited Seats | Admission Window Open | Scholarship Support | EMI Available
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-white/0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-white/0" />

        {[topRow, bottomRow].map((rowCourses, rowIndex) => {
          const isFirst = rowIndex === 0;
          const isStatic = rowCourses.length <= 2;
          const loopCourses = isStatic ? rowCourses : [...rowCourses, ...rowCourses];

          return (
            <div
              key={`lane-${rowIndex}`}
              className={`${isStatic ? "flex w-full" : "sponsor-scroll-track flex w-max"} gap-4 px-4 ${isFirst ? "" : "mt-4"}`}
              style={
                isStatic
                  ? undefined
                  : {
                      animationDuration: `${isFirst ? primaryDuration : secondaryDuration}s`,
                      animationDirection: isFirst ? firstDirection : secondDirection,
                    }
              }
            >
              {loopCourses.map((item, index) => {
                const gradient = pick(item.course.slug, AD_GRADIENTS);
                const line = pick(`${item.course.slug}-line`, AD_LINES);
                const feeLabel = formatCourseFee(item.course.mode?.name, item.min_fees);
                const modeSlug = slugify(item.course.mode?.name ?? "");
                const courseTypePrefill =
                  modeSlug === "vocational"
                    ? "vocational_course"
                    : modeSlug === "skill-certification"
                      ? "skill_course"
                      : "ug_course";
                const programModePrefill =
                  modeSlug === "regular" || modeSlug === "online" || modeSlug === "distance"
                    ? modeSlug
                    : undefined;

                return (
                  <article
                    key={`ad-${rowIndex}-${item.course.id}-${index}`}
                    className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isStatic
                        ? "flex-1 basis-0 min-w-[240px]"
                        : "w-[272px] shrink-0 sm:w-[320px] md:w-[350px]"
                    }`}
                  >
                    <div className={`relative bg-gradient-to-r ${gradient} p-4 text-white`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.26),transparent_58%)]" />
                      <div className="relative">
                        <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                          <Sparkles className="h-3.5 w-3.5" />
                          Sponsored
                        </p>
                        <p className="mt-3 line-clamp-2 text-xl font-extrabold">{item.course.name}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/90">
                          {item.course.mode?.name} | {item.course.sector?.name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      <p className="line-clamp-2 text-sm text-slate-600">{line}</p>
                      <p className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <BadgeIndianRupee className="h-4 w-4 text-blue-600" />
                        Fees: <span className="font-bold text-slate-900">{feeLabel}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <Clock3 className="h-4 w-4 text-blue-600" />
                        Duration: <span className="font-semibold text-slate-900">{item.course.duration}</span>
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/courses/${item.course.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
                        >
                          View course
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={{
                            pathname: "/apply-now",
                            query: {
                              mode: programModePrefill,
                              course_type: courseTypePrefill,
                              course: item.course.name,
                              stream: item.course.sector?.name ?? "",
                            },
                          }}
                          className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                        >
                          Apply now
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
