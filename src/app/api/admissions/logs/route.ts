import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { admissionLogFetchSchema } from "@/lib/admissions/schema";
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

  const { data, error } = await supabase
    .from("admission_status_logs")
    .select("*")
    .eq("admission_id", parsed.data.admission_id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
