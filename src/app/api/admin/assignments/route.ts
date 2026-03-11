import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { mockData } from "@/lib/mock-data";
import { isAppRole } from "@/lib/auth/roles";

const schema = z.object({
  university_id: z.string().uuid(),
  course_id: z.string().uuid(),
  fees: z.coerce.number().min(0),
  duration: z.string().min(2),
});

const updateSchema = schema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

async function getAdminClient() {
  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !isAppRole(profile?.role) || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { supabase };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    const data = mockData.universityCourses.map((item) => ({
      ...item,
      university: mockData.universities.find((u) => u.id === item.university_id) ?? null,
      course: mockData.courses.find((c) => c.id === item.course_id) ?? null,
    }));
    return NextResponse.json({ data, mock: true });
  }

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase
    .from("university_courses")
    .select("*, university:universities(id,name,slug), course:courses(id,name,slug)")
    .order("university_id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase
    .from("university_courses")
    .upsert(parsed.data, { onConflict: "university_id,course_id" })
    .select("*, university:universities(id,name,slug), course:courses(id,name,slug)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request) {
  const payload = await req.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase
    .from("university_courses")
    .update({
      university_id: parsed.data.university_id,
      course_id: parsed.data.course_id,
      fees: parsed.data.fees,
      duration: parsed.data.duration,
    })
    .eq("id", parsed.data.id)
    .select("*, university:universities(id,name,slug), course:courses(id,name,slug)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const queryId = url.searchParams.get("id");
  const body = queryId ? { id: queryId } : await req.json();
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { error } = await supabase.from("university_courses").delete().eq("id", parsed.data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

