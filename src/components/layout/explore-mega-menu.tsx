"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { University } from "@/lib/types";
import { normalizeModeSlug } from "@/lib/utils";

const FALLBACK_MODE_UNIVERSITIES: Record<string, string[]> = {
  regular: [
    "marwadi-university",
    "noida-international-university",
    "rayat-bahra-university",
    "dr-preeti-global-university",
    "coer-university",
    "guru-nanak-university-hyderabad",
    "niat",
    "suryadatta-group-of-institutions",
    "north-east-christian-university",
  ],
  online: [
    "shoolini-university",
    "uttaranchal-university",
    "marwadi-university",
    "mangalayatan-university",
    "maharishi-markandeshwar-university",
    "noida-international-university",
    "suresh-gyan-vihar-university",
    "bharati-vidyapeeth-university",
  ],
  distance: [
    "mangalayatan-university",
    "bharati-vidyapeeth-university",
  ],
  vocational: [
    "glocal-university",
  ],
  "skill-certification": [
    "glocal-university",
  ],
};

const REQUIRED_MODE_ORDER = ["Regular", "Online", "Distance", "Vocational", "Skill Certification"];

function normalizeModeName(mode: string) {
  return normalizeModeSlug(mode);
}

function universitySupportsMode(university: University, mode: string) {
  const wanted = normalizeModeName(mode);
  const raw = university.mode_supported;
  const normalizedModes = Array.isArray(raw)
    ? raw.map((value) => normalizeModeName(value))
    : String(raw ?? "")
        .split(",")
        .map((value) => normalizeModeName(value));

  return normalizedModes.includes(wanted);
}

export function ExploreMegaMenu({
  universities,
  modeOrder,
}: {
  universities: University[];
  modeOrder: string[];
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuTop, setMenuTop] = useState(132);
  const [menuLeft, setMenuLeft] = useState(16);
  const orderedModes = useMemo(() => {
    const normalized = new Set(modeOrder.map((mode) => normalizeModeSlug(mode)));
    const merged = [...modeOrder];
    for (const mode of REQUIRED_MODE_ORDER) {
      const slug = normalizeModeSlug(mode);
      if (!normalized.has(slug)) {
        merged.push(mode);
        normalized.add(slug);
      }
    }
    return merged;
  }, [modeOrder]);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuTop(Math.max(12, Math.round(rect.bottom + 8)));
      const menuWidth =
        menuRef.current?.offsetWidth ?? Math.min(1240, Math.max(320, window.innerWidth - 12));
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - menuWidth - 12);
      setMenuLeft(Math.round(left));
    };

    updatePosition();
    const timer = window.setTimeout(updatePosition, 0);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open]);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="nav-link-animated inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 xl:text-[15px]" type="button">
        Explore <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ top: `${menuTop}px`, left: `${menuLeft}px` }}
            className="futuristic-surface fixed z-[70] w-[min(1240px,calc(100vw-0.75rem))] overflow-x-hidden rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:w-[min(1240px,calc(100vw-1.5rem))] md:p-4"
          >
            <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Select mode, then choose your preferred university
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-5">
              {orderedModes.map((mode) => {
                const modeSlug = normalizeModeSlug(mode);
                const fallbackSlugs = FALLBACK_MODE_UNIVERSITIES[modeSlug] ?? [];

                const modeList = universities.filter((u) => universitySupportsMode(u, mode));
                const fallbackList = universities.filter((u) => fallbackSlugs.includes(u.slug));
                const list = Array.from(new Map([...modeList, ...fallbackList].map((u) => [u.slug, u])).values());

                return (
                  <div key={mode} className="min-w-0 rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm">
                    <Link href={`/programs/${modeSlug}`} className="text-[13px] font-bold text-blue-700 hover:underline">
                      {mode}
                    </Link>
                    <div className="mt-2 max-h-52 space-y-1 overflow-auto pr-1">
                      {list.length ? (
                        list.map((u) => (
                          <Link
                            key={u.slug}
                            href={`/courses?mode=${modeSlug}&university=${u.slug}`}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-2 py-1 text-xs leading-snug text-slate-700 hover:bg-slate-100"
                          >
                            {u.name}
                          </Link>
                        ))
                      ) : (
                        <p className="rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-500">No universities mapped yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
