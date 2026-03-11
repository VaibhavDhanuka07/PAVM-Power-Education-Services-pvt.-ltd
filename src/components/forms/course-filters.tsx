"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { University } from "@/lib/types";
import { normalizeModeSlug, slugify } from "@/lib/utils";

type Props = {
  sectors: string[];
  modes: string[];
  universities: University[];
  durations: string[];
};

function labelize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CourseFilters({ sectors, modes, universities, durations }: Props) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const values = useMemo(
    () => ({
      search: params.get("search") ?? "",
      sector: params.get("sector") ?? "",
      mode: params.get("mode") ?? "",
      university: params.get("university") ?? "",
      duration: params.get("duration") ?? "",
      level: params.get("level") ?? "",
    }),
    [params],
  );

  const [draft, setDraft] = useState(values);
  const showLevelFilter = useMemo(() => {
    const normalizedMode = normalizeModeSlug(draft.mode);
    return !normalizedMode || ["online", "distance", "regular"].includes(normalizedMode);
  }, [draft.mode]);

  useEffect(() => {
    setDraft(values);
  }, [values]);

  const availableUniversities = useMemo(() => {
    if (!draft.mode) return universities;
    return universities.filter((university) =>
      university.mode_supported.some((modeName) => normalizeModeSlug(modeName) === normalizeModeSlug(draft.mode)),
    );
  }, [draft.mode, universities]);

  useEffect(() => {
    if (!draft.university) return;
    const exists = availableUniversities.some((university) => university.slug === draft.university);
    if (!exists) {
      setDraft((prev) => ({ ...prev, university: "" }));
    }
  }, [availableUniversities, draft.university]);

  function applyFilters() {
    const next = new URLSearchParams();
    if (draft.search.trim()) next.set("search", draft.search.trim());
    if (draft.sector) next.set("sector", draft.sector);
    if (draft.mode) next.set("mode", draft.mode);
    if (draft.university) next.set("university", draft.university);
    if (draft.duration) next.set("duration", draft.duration);
    if (draft.level) next.set("level", draft.level);
    router.push(`${pathname}?${next.toString()}`);
  }

  function resetFilters() {
    setDraft({
      search: "",
      sector: "",
      mode: "",
      university: "",
      duration: "",
      level: "",
    });
    router.push(pathname);
  }

  return (
    <motion.div
      layout
      className="futuristic-surface rounded-2xl border border-slate-200 p-4 shadow-sm md:p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
        Smart filters
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Input
          placeholder="Search course or university"
          value={draft.search}
          onChange={(e) => setDraft((prev) => ({ ...prev, search: e.target.value }))}
          className="h-11 rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500"
        />

        <Select value={draft.sector} onChange={(e) => setDraft((prev) => ({ ...prev, sector: e.target.value }))} className="h-11 rounded-xl border-slate-300 bg-white text-slate-900">
          <option value="">All sectors</option>
          {sectors.map((sector) => <option key={sector} value={sector}>{labelize(sector)}</option>)}
        </Select>

        <Select
          value={draft.mode}
          onChange={(e) =>
            setDraft((prev) => {
              const nextMode = e.target.value;
              const normalized = normalizeModeSlug(nextMode);
              const keepLevel = !normalized || ["online", "distance", "regular"].includes(normalized);
              return {
                ...prev,
                mode: nextMode,
                university: "",
                level: keepLevel ? prev.level : "",
              };
            })
          }
          className="h-11 rounded-xl border-slate-300 bg-white text-slate-900"
        >
          <option value="">All modes</option>
          {modes.map((mode) => <option key={mode} value={mode}>{labelize(mode)}</option>)}
        </Select>

        <Select
          value={draft.university}
          onChange={(e) => setDraft((prev) => ({ ...prev, university: e.target.value }))}
          className="h-11 rounded-xl border-slate-300 bg-white text-slate-900"
        >
          <option value="">All universities</option>
          {availableUniversities.map((university) => <option key={university.slug} value={university.slug}>{university.name}</option>)}
        </Select>

        <Select value={draft.duration} onChange={(e) => setDraft((prev) => ({ ...prev, duration: e.target.value }))} className="h-11 rounded-xl border-slate-300 bg-white text-slate-900">
          <option value="">Any duration</option>
          {durations.map((duration) => <option key={duration} value={duration}>{duration}</option>)}
        </Select>

        {showLevelFilter ? (
          <Select value={draft.level} onChange={(e) => setDraft((prev) => ({ ...prev, level: e.target.value }))} className="h-11 rounded-xl border-slate-300 bg-white text-slate-900">
            <option value="">Any level</option>
            <option value="diploma">Diploma</option>
            <option value="bachelors">Bachelors / Graduation</option>
            <option value="pg-diploma">PG Diploma</option>
            <option value="post-graduation">Post Graduation</option>
          </Select>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}>
          <Button onClick={applyFilters} className="rounded-xl bg-blue-600 hover:bg-blue-700">
            <Search className="mr-2 h-4 w-4" />
            Apply filters
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}>
          <Button variant="outline" onClick={resetFilters} className="rounded-xl">
            Reset
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
