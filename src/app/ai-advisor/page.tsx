"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";

type AdvisorResponse = {
  summary: string;
  feeRange: string;
  universities: Array<{ name: string; slug: string; location: string; rating: number; programs: number }>;
  courses: Array<{ name: string; slug: string; duration: string; fees: string; rating: number }>;
};

export default function AiAdvisorPage() {
  const [budget, setBudget] = useState(120000);
  const [mode, setMode] = useState("Online");
  const [careerGoal, setCareerGoal] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResponse | null>(null);

  async function submit() {
    if (!careerGoal.trim() || !city.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai-course-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, mode, careerGoal, city }),
      });
      const json = (await res.json()) as AdvisorResponse;
      setResult(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5" />
          AI Course Advisor
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Find your best-fit course in 30 seconds</h1>
        <p className="mt-2 text-white/90">Chat-style recommendations based on budget, mode, career goal, and city preference.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Preferred Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300 px-3">
              {["Online", "Distance", "Vocational", "Skill Certification", "Regular"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <label className="block text-sm font-semibold text-slate-700">Budget (INR)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
            />

            <label className="block text-sm font-semibold text-slate-700">Career Goal</label>
            <input
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="Example: Data Science, MBA in Marketing"
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
            />

            <label className="block text-sm font-semibold text-slate-700">Preferred City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Example: Delhi, Noida, Jaipur"
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => void submit()}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Get AI Recommendations
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!result ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center text-slate-600">
              <Bot className="h-10 w-10 text-blue-600" />
              <p className="mt-3 text-lg font-semibold text-slate-900">Your recommendations will appear here</p>
              <p className="mt-1 text-sm">Fill details and click “Get AI Recommendations”.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">{result.summary}</p>
                <p className="mt-1 text-sm text-slate-700">Estimated best-fit fee range: <span className="font-bold">{result.feeRange}</span></p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Top 5 Universities</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {result.universities.map((u) => (
                    <Link key={u.slug} href={`/universities/${u.slug}`} className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50">
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-600">{u.location}</p>
                      <p className="mt-1 text-xs text-slate-700">Rating: {u.rating} | Programs: {u.programs}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Best-fit Courses</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {result.courses.map((c) => (
                    <Link key={c.slug} href={`/courses/${c.slug}`} className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-600">{c.duration}</p>
                      <p className="mt-1 text-xs text-slate-700">Fees: {c.fees} | Rating: {c.rating}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

