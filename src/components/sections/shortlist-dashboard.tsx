"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, BookmarkCheck, CalendarClock, LogIn, MailCheck } from "lucide-react";

type SimpleUniversity = { name: string; slug: string; location: string };
type SimpleCourse = { name: string; slug: string; duration: string; fees: string };

const U_KEY = "pavm-shortlist-universities";
const C_KEY = "pavm-shortlist-courses";
const USER_KEY = "pavm-shortlist-user";

export function ShortlistDashboard({
  universities,
  courses,
  addUniversity,
  addCourse,
}: {
  universities: SimpleUniversity[];
  courses: SimpleCourse[];
  addUniversity?: string;
  addCourse?: string;
}) {
  const [savedUniversities, setSavedUniversities] = useState<string[]>([]);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem(U_KEY) ?? "[]") as string[];
    const c = JSON.parse(localStorage.getItem(C_KEY) ?? "[]") as string[];
    const email = localStorage.getItem(USER_KEY) ?? "";
    setSavedUniversities(u);
    setSavedCourses(c);
    setUserEmail(email);
  }, []);

  useEffect(() => {
    if (addUniversity) {
      setSavedUniversities((prev) => {
        const next = Array.from(new Set([...prev, addUniversity]));
        localStorage.setItem(U_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [addUniversity]);

  useEffect(() => {
    if (addCourse) {
      setSavedCourses((prev) => {
        const next = Array.from(new Set([...prev, addCourse]));
        localStorage.setItem(C_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [addCourse]);

  const shortlistedUniversities = useMemo(
    () => universities.filter((u) => savedUniversities.includes(u.slug)),
    [universities, savedUniversities],
  );
  const shortlistedCourses = useMemo(
    () => courses.filter((c) => savedCourses.includes(c.slug)),
    [courses, savedCourses],
  );

  const alerts = useMemo(() => {
    const courseAlerts = shortlistedCourses.slice(0, 6).map((course, i) => ({
      id: `c-${course.slug}`,
      title: `${course.name}: fee update expected`,
      message: "Counsellor recommendation: confirm current semester fee before applying.",
      type: "fees",
      day: `${3 + i} days`,
    }));
    const uniAlerts = shortlistedUniversities.slice(0, 6).map((u, i) => ({
      id: `u-${u.slug}`,
      title: `${u.name}: admission deadline`,
      message: "Application window likely closing soon. Book counselling for exact deadline.",
      type: "deadline",
      day: `${2 + i} days`,
    }));
    return [...courseAlerts, ...uniAlerts].slice(0, 8);
  }, [shortlistedCourses, shortlistedUniversities]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Saved Shortlist + Alerts</h1>
        <p className="mt-2 text-slate-600">
          Save courses/universities and get alerts for fee updates, deadlines, and new programs.
        </p>

        {!userEmail ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
              <LogIn className="h-4 w-4" />
              Login to sync shortlist and alerts
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="h-10 min-w-[220px] rounded-lg border border-slate-300 px-3"
              />
              <button
                type="button"
                onClick={() => {
                  const email = emailInput.trim();
                  if (!email) return;
                  localStorage.setItem(USER_KEY, email);
                  setUserEmail(email);
                }}
                className="h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700"
              >
                Authenticate
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <MailCheck className="h-4 w-4" />
            Authenticated as {userEmail}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
            <BookmarkCheck className="h-5 w-5 text-blue-700" />
            Saved Universities ({shortlistedUniversities.length})
          </p>
          <div className="mt-3 space-y-2">
            {shortlistedUniversities.length ? shortlistedUniversities.map((u) => (
              <Link key={u.slug} href={`/universities/${u.slug}`} className="block rounded-lg border border-slate-200 px-3 py-2 hover:border-blue-300 hover:bg-blue-50">
                <p className="font-semibold text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-600">{u.location}</p>
              </Link>
            )) : <p className="text-sm text-slate-500">No universities saved yet.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
            <BookmarkCheck className="h-5 w-5 text-blue-700" />
            Saved Courses ({shortlistedCourses.length})
          </p>
          <div className="mt-3 space-y-2">
            {shortlistedCourses.length ? shortlistedCourses.map((c) => (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="block rounded-lg border border-slate-200 px-3 py-2 hover:border-blue-300 hover:bg-blue-50">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-600">{c.duration} • {c.fees}</p>
              </Link>
            )) : <p className="text-sm text-slate-500">No courses saved yet.</p>}
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
          <Bell className="h-5 w-5 text-blue-700" />
          Alerts
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {alerts.length ? alerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{alert.title}</p>
              <p className="mt-1 text-xs text-slate-600">{alert.message}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                <CalendarClock className="h-3.5 w-3.5" />
                In {alert.day}
              </p>
            </div>
          )) : <p className="text-sm text-slate-500">Save courses/universities to generate alerts.</p>}
        </div>
      </article>
    </div>
  );
}

