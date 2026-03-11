import { buildMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { getUniversities } from "@/lib/queries/universities";
import { getCourses, getCourseSectors, getEducationModes, getUniversityCourseAssignments } from "@/lib/queries/courses";
import { getBlogs } from "@/lib/queries/blogs";
import { getConsultationLeads } from "@/lib/queries/consultations";
import { AdminUniversityForm } from "@/components/forms/admin-university-form";
import { AdminCourseForm } from "@/components/forms/admin-course-form";
import { AdminAssignmentForm } from "@/components/forms/admin-assignment-form";
import { AdminBlogForm } from "@/components/forms/admin-blog-form";
import { AdminManagementPanel } from "@/components/admin/admin-management-panel";
import { AdminUserRoleManager } from "@/components/admin/admin-user-role-manager";
import { AdminAdmissionsPanel } from "@/components/admin/admin-admissions-panel";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { AppRole, normalizeAppRole } from "@/lib/auth/roles";
import { scoreLead } from "@/lib/lead-scoring";
import { getAllAdmissionsForAdmin } from "@/lib/queries/admissions";

export const metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Manage universities, courses, blogs, and consultation leads.",
  path: "/admin",
});

export default async function AdminPage() {
  let currentRole: AppRole | null = null;
  let userRows: Array<{
    id: string;
    email: string;
    full_name: string | null;
    role: AppRole;
    created_at: string;
  }> = [];

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabase();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) redirect("/login?next=/admin");

    const { data: myProfile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();

    currentRole = normalizeAppRole(myProfile?.role);
    if (currentRole !== "admin") redirect("/");

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });

    userRows = (profiles ?? [])
      .map((item) => {
        const role = normalizeAppRole(item.role);
        if (!role) return null;

        return {
        id: item.id,
        email: item.email,
        full_name: item.full_name,
        role,
        created_at: item.created_at ?? "",
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  const [stats, universities, courses, blogs, leads, sectors, modes, assignments, admissions] = await Promise.all([
    getDashboardStats(),
    getUniversities(),
    getCourses(),
    getBlogs(),
    getConsultationLeads(),
    getCourseSectors(),
    getEducationModes(),
    getUniversityCourseAssignments(),
    getAllAdmissionsForAdmin(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage universities, courses, assignments, blogs, and consultation leads.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Courses</p><p className="text-2xl font-bold">{stats.totalCourses}</p></div>
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Universities</p><p className="text-2xl font-bold">{stats.totalUniversities}</p></div>
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Blogs</p><p className="text-2xl font-bold">{stats.totalBlogs}</p></div>
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Students</p><p className="text-2xl font-bold">{stats.totalStudents}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Add University</h2>
          <AdminUniversityForm />
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Add Course</h2>
          <AdminCourseForm sectors={sectors.map((s) => ({ id: s.id, name: s.name }))} modes={modes.map((m) => ({ id: m.id, name: m.name }))} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Assign Course to University</h2>
          <AdminAssignmentForm
            universities={universities.map((u) => ({ id: u.id, name: u.name }))}
            courses={courses.map((c) => ({ id: c.id, name: c.name, duration: c.duration }))}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Publish Blog</h2>
          <AdminBlogForm />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="mb-3 text-lg font-semibold">University and Course Management</h2>
        <p className="mb-4 text-sm text-slate-600">
          Edit, delete, and manage universities, courses, and course-fee mappings from one place.
        </p>
        <AdminManagementPanel
          universities={universities.map((u) => ({
            id: u.id,
            name: u.name,
            slug: u.slug,
            location: u.location,
            mode_supported: u.mode_supported,
            logo: u.logo,
            description: u.description,
          }))}
          courses={courses.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            duration: c.duration,
            sector_id: c.sector_id,
            mode_id: c.mode_id,
            sector: c.sector
              ? {
                  id: c.sector.id,
                  name: c.sector.name,
                  slug: c.sector.slug,
                }
              : null,
            mode: c.mode
              ? {
                  id: c.mode.id,
                  name: c.mode.name,
                }
              : null,
          }))}
          assignments={assignments.map((a) => ({
            id: a.id,
            university_id: a.university_id,
            course_id: a.course_id,
            fees: Number(a.fees),
            duration: a.duration,
            university: a.university
              ? {
                  id: a.university.id,
                  name: a.university.name,
                }
              : null,
            course: a.course
              ? {
                  id: a.course.id,
                  name: a.course.name,
                }
              : null,
          }))}
          sectors={sectors.map((s) => ({ id: s.id, name: s.name }))}
          modes={modes.map((m) => ({ id: m.id, name: m.name }))}
        />
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Consultation Leads</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Course Interest</th>
                <th className="py-2">Lead Score</th>
                <th className="py-2">Assigned Counsellor</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100">
                  <td className="py-2">{lead.name}</td>
                  <td className="py-2">{lead.email}</td>
                  <td className="py-2">{lead.phone}</td>
                  <td className="py-2">{lead.course_interest}</td>
                  <td className="py-2">
                    {(() => {
                      const scored = scoreLead({
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        course_interest: lead.course_interest,
                        message: lead.message,
                      });
                      return <span className="font-semibold text-blue-700">{scored.score} ({scored.grade})</span>;
                    })()}
                  </td>
                  <td className="py-2">
                    {(() => {
                      const scored = scoreLead({
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        course_interest: lead.course_interest,
                        message: lead.message,
                      });
                      return scored.assignedCounsellor;
                    })()}
                  </td>
                  <td className="py-2">{lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Secure production setup: protect `/admin` and `/api/admin/*` with Supabase Auth role checks (service role or RLS policies for admin users only).
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Current Content Snapshot</h2>
        <p className="mt-1 text-sm text-slate-600">Universities: {universities.length} | Courses: {courses.length} | Blogs: {blogs.length}</p>
      </div>

      <AdminUserRoleManager users={userRows} />

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="mb-3 text-lg font-semibold">Admissions Approval and Notices</h2>
        <p className="mb-4 text-sm text-slate-600">
          Review admissions submitted by associates/students, accept or reject, and publish notices/datesheets visible in their dashboards.
        </p>
        <AdminAdmissionsPanel admissions={admissions} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Admin Analytics: Top Searched Courses</h2>
          <div className="mt-3 space-y-2">
            {stats.topSearchedCourses.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="font-semibold text-blue-700">{item.demand.toLocaleString("en-IN")} searches</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Top Converting Universities</h2>
          <div className="mt-3 space-y-2">
            {stats.topConvertingUniversities.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="font-semibold text-emerald-700">{item.leads.toLocaleString("en-IN")} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Lead Sources</h2>
          <div className="mt-3 space-y-2">
            {stats.leadSources.map((item) => (
              <div key={item.source} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{item.source}</span>
                <span className="font-semibold text-blue-700">{item.count.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Funnel Drop-off</h2>
          <div className="mt-3 space-y-3">
            {stats.funnelDropOff.map((item) => (
              <div key={item.stage}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                  <span>{item.stage}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


