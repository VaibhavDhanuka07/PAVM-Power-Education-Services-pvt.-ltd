import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { normalizeAppRole } from "@/lib/auth/roles";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCourses } from "@/lib/queries/courses";
import { getAdmissionsForCurrentUser } from "@/lib/queries/admissions";
import { AdmissionSubmissionForm } from "@/components/admissions/admission-submission-form";
import { AdmissionStatusBoard } from "@/components/admissions/admission-status-board";
import { AuthenticationMessage } from "@/components/ui/authentication-message";
import {
  AdmissionCourseType,
  AdmissionLevel,
  AdmissionProgramMode,
  AdmissionType,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Apply Now",
  description: "Submit complete admission form with required details and documents for admin approval.",
  path: "/apply-now",
});

const PROGRAM_MODES: AdmissionProgramMode[] = ["regular", "online", "distance"];

function firstValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseProgramMode(value?: string): AdmissionProgramMode | undefined {
  if (!value) return undefined;
  const normalized = slugify(value);
  return PROGRAM_MODES.includes(normalized as AdmissionProgramMode)
    ? (normalized as AdmissionProgramMode)
    : undefined;
}

function parseCourseType(value?: string): AdmissionCourseType | undefined {
  if (!value) return undefined;
  const normalized = slugify(value);
  const directMap: Record<string, AdmissionCourseType> = {
    diploma: "diploma",
    "pg-diploma": "pg_diploma",
    "ug-course": "ug_course",
    "pg-course": "pg_course",
    "vocational-course": "vocational_course",
    "skill-course": "skill_course",
    vocational: "vocational_course",
    "skill-certification": "skill_course",
  };
  return directMap[normalized];
}

function parseAdmissionLevel(value?: string): AdmissionLevel | undefined {
  if (!value) return undefined;
  const normalized = slugify(value);
  const levelMap: Record<string, AdmissionLevel> = {
    "1-year-diploma": "one_year_diploma",
    "one-year-diploma": "one_year_diploma",
    "2-year-advanced-diploma": "two_year_advanced_diploma",
    "two-year-advanced-diploma": "two_year_advanced_diploma",
    "3-year-bachelors-degree": "three_year_bachelors_degree",
    "three-year-bachelors-degree": "three_year_bachelors_degree",
    "6-months-certification": "six_month_certification",
    "six-month-certification": "six_month_certification",
    "11-months-diploma": "eleven_month_diploma",
    "eleven-month-diploma": "eleven_month_diploma",
  };
  return levelMap[normalized];
}

function parseAdmissionType(value?: string): AdmissionType | undefined {
  if (!value) return undefined;
  const normalized = slugify(value);
  if (normalized === "new" || normalized === "new-admission") return "new";
  if (normalized === "lateral-entry") return "lateral_entry";
  return undefined;
}

export default async function ApplyNowPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const resolvedParams = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, rawValue]) => {
      const value = firstValue(rawValue);
      if (value) resolvedParams.set(key, value);
    });
  }

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabase();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      const suffix = resolvedParams.toString();
      const nextPath = suffix ? `/apply-now?${suffix}` : "/apply-now";
      redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }

  const [courses, admissions] = await Promise.all([
    getCourses(),
    getAdmissionsForCurrentUser(),
  ]);

  let roleForForm: "student" | "associate" = "student";
  let roleMessage: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabase();
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();
      const normalizedRole = normalizeAppRole(profile?.role);
      if (normalizedRole === "associate") {
        roleForForm = "associate";
      } else {
        roleForForm = "student";
      }
      if (normalizedRole === "admin") {
        roleMessage = "Admin accounts cannot submit admission forms. Please use Student or Associate login.";
      }
    }
  }

  const modeParam = parseProgramMode(firstValue(searchParams?.mode));
  const courseTypeParam = parseCourseType(firstValue(searchParams?.course_type))
    ?? (() => {
      const modeSlug = slugify(firstValue(searchParams?.mode) ?? "");
      if (modeSlug === "vocational") return "vocational_course";
      if (modeSlug === "skill-certification") return "skill_course";
      return undefined;
    })();
  const admissionLevelParam = parseAdmissionLevel(firstValue(searchParams?.admission_level));
  const admissionTypeParam = parseAdmissionType(firstValue(searchParams?.admission_type));

  const requestedCourse = firstValue(searchParams?.course) ?? firstValue(searchParams?.course_name) ?? "";
  const matchedCourse = courses.find((course) => {
    const needle = requestedCourse.toLowerCase();
    return course.name.toLowerCase() === needle || course.slug === slugify(requestedCourse);
  });

  const prefill = {
    admission_session: firstValue(searchParams?.admission_session),
    admission_type: admissionTypeParam,
    program_mode: modeParam,
    course_type: courseTypeParam,
    admission_level: admissionLevelParam,
    course_name: matchedCourse?.name ?? requestedCourse,
    stream_name: firstValue(searchParams?.stream),
    admission_semester: firstValue(searchParams?.semester),
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Admission Application Portal
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Apply Now</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Fill complete admission details, upload required documents (.jpg under 500KB), accept policy, and submit for admin approval.
            </p>
            <AuthenticationMessage className="mt-4" />
            {roleMessage ? (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {roleMessage}
              </p>
            ) : null}
          </div>
          <Link
            href="/privacy-security"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <ShieldCheck className="h-4 w-4" />
            Privacy & Security Policy
          </Link>
        </div>
      </div>

      {!roleMessage ? (
        <>
          <AdmissionSubmissionForm
            role={roleForForm}
            courseOptions={courses.map((course) => ({ id: course.id, name: course.name }))}
            prefill={prefill}
          />
          <AdmissionStatusBoard role={roleForForm} initialAdmissions={admissions} />
        </>
      ) : null}
    </section>
  );
}
