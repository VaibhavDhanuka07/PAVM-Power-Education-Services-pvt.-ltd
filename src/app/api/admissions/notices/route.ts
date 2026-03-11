import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { admissionLogFetchSchema, admissionNoticeSchema } from "@/lib/admissions/schema";
import { canAccessAdmission } from "@/lib/admissions/access";

export async function GET(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ data: [], mock: true });

  const auth = await requireRole(["admin", "associate", "student"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId, role } = auth.context;

  const admissionId = new URL(req.url).searchParams.get("admission_id");
  const parsed = admissionLogFetchSchema.safeParse({ admission_id: admissionId });
  if (!parsed.success) {
    return NextResponse.json({ error: "admission_id is required." }, { status: 400 });
  }

  const { data: admission, error: admissionError } = await supabase
    .from("admissions")
    .select("id, created_by, student_user_id, associate_user_id, status")
    .eq("id", parsed.data.admission_id)
    .maybeSingle();

  if (admissionError || !admission) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }
  if (!canAccessAdmission(admission, userId, role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let query = supabase
    .from("admission_notices")
    .select("*")
    .eq("admission_id", parsed.data.admission_id)
    .order("created_at", { ascending: false });

  if (role === "student") query = query.eq("visible_to_student", true);
  if (role === "associate") query = query.eq("visible_to_associate", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId } = auth.context;

  const payload = await req.json().catch(() => ({}));
  const parsed = admissionNoticeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid notice payload" }, { status: 400 });
  }

  const { data: admission, error: admissionError } = await supabase
    .from("admissions")
    .select("id")
    .eq("id", parsed.data.admission_id)
    .maybeSingle();

  if (admissionError || !admission) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("admission_notices")
    .insert({
      ...parsed.data,
      file_url: parsed.data.file_url || null,
      created_by: userId,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
