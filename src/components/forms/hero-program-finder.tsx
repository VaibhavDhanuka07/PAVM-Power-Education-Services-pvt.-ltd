"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles, GraduationCap, School, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import { University } from "@/lib/types";

const MODES = ["Regular", "Online", "Distance", "Vocational", "Skill Certification"] as const;

export function HeroProgramFinder({ universities }: { universities: University[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filteredUniversities = useMemo(() => {
    if (!mode) return universities;
    return universities.filter((u) => u.mode_supported.includes(mode));
  }, [mode, universities]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (mode) params.set("mode", slugify(mode));
    if (university) params.set("university", university);
    if (search.trim()) params.set("search", search.trim());
    router.push(`/courses?${params.toString()}`);
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-7 w-full max-w-5xl rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur md:p-5"
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
        <Sparkles className="h-3.5 w-3.5" />
        Find your ideal university in seconds
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <motion.label whileHover={{ y: -2 }} className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <GraduationCap className="h-3.5 w-3.5 text-blue-700" />
            Program Mode
          </span>
          <Select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setUniversity("");
            }}
            className="h-12 rounded-xl border-slate-300 bg-white text-black"
          >
            <option value="" className="text-black">Select Program Mode</option>
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </motion.label>

        <motion.label whileHover={{ y: -2 }} className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <School className="h-3.5 w-3.5 text-blue-700" />
            University
          </span>
          <Select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="h-12 rounded-xl border-slate-300 bg-white text-black"
          >
            <option value="" className="text-black">Select University</option>
            {filteredUniversities.map((u) => (
              <option key={u.slug} value={u.slug}>{u.name}</option>
            ))}
          </Select>
        </motion.label>

        <motion.label whileHover={{ y: -2 }} className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <BookOpenCheck className="h-3.5 w-3.5 text-blue-700" />
            Course
          </span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course or university"
            className="h-12 rounded-xl border-slate-300 bg-white text-black placeholder:text-slate-500"
          />
        </motion.label>

        <motion.div whileHover={{ y: -2 }} className="space-y-1">
          <span className="inline-flex text-xs font-semibold uppercase tracking-wide text-transparent">Action</span>
          <Button type="submit" className="h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700">
            <Search className="mr-2 h-4 w-4" />
            Find Programs
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
