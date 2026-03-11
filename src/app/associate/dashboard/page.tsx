import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAppRole } from "@/lib/auth/roles";
import { getCourses } from "@/lib/queries/courses";
import { getAdmissionsForCurrentUser } from "@/lib/queries/admissions";
import { AdmissionSubmissionForm } from "@/components/admissions/admission-submission-form";
import { AdmissionStatusBoard } from "@/components/admissions/admission-status-board";
import { AuthenticationMessage } from "@/components/ui/authentication-message";

export const metadata = buildMetadata({
  title: "Associate Dashboard",
  description: "Associate authority dashboard for admission submission and status tracking.",
  path: "/associate/dashboard",
});

export default async function AssociateDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Associate dashboard requires Supabase authentication configuration.
        </p>
      </section>
    );
  }

  const supabase = createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login?next=/associate/dashboard");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!isAppRole(profile?.role)) {
    redirect("/");
  }
  if (profile.role === "student") {
    redirect("/student/dashboard");
  }
  if (profile.role === "admin") {
    redirect("/admin");
  }
  if (profile.role !== "associate") {
    redirect("/");
  }

  const [courses, admissions] = await Promise.all([
    getCourses(),
    getAdmissionsForCurrentUser(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Associate Authority Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Submit complete admissions to admin and track approval/rejection, notices, and datesheets for each student.
        </p>
        <AuthenticationMessage className="mt-4" />
      </div>

      <AdmissionSubmissionForm
        role="associate"
        courseOptions={courses.map((course) => ({ id: course.id, name: course.name }))}
      />

      <AdmissionStatusBoard role="associate" initialAdmissions={admissions} />
    </section>
  );
}
