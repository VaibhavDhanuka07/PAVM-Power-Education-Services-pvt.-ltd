import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { normalizeAppRole } from "@/lib/auth/roles";
import { getCourses } from "@/lib/queries/courses";
import { getAdmissionsForCurrentUser } from "@/lib/queries/admissions";
import { AdmissionSubmissionForm } from "@/components/admissions/admission-submission-form";
import { AdmissionStatusBoard } from "@/components/admissions/admission-status-board";
import { AuthenticationMessage } from "@/components/ui/authentication-message";

export const metadata = buildMetadata({
  title: "Student Dashboard",
  description: "Student admission dashboard for direct admission submission and approval tracking.",
  path: "/student/dashboard",
});

export default async function StudentDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Student dashboard requires Supabase authentication configuration.
        </p>
      </section>
    );
  }

  const supabase = createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login?next=/student/dashboard");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  const role = normalizeAppRole(profile?.role);

  if (role === "associate") {
    redirect("/associate/dashboard");
  }
  if (role === "admin") {
    redirect("/admin");
  }
  if (role !== "student") {
    redirect("/");
  }

  const [courses, admissions] = await Promise.all([
    getCourses(),
    getAdmissionsForCurrentUser(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Student Admission Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Complete your admission form, upload required documents, and track status updates from admin in real time.
        </p>
        <AuthenticationMessage className="mt-4" />
      </div>

      <AdmissionSubmissionForm
        role="student"
        courseOptions={courses.map((course) => ({ id: course.id, name: course.name }))}
      />

      <AdmissionStatusBoard role="student" initialAdmissions={admissions} />
    </section>
  );
}
