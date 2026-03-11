import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import {
  admissionPayloadSchema,
  admissionUpdatePayloadSchema,
} from "@/lib/admissions/schema";
import { canEditAdmission } from "@/lib/admissions/access";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ data: [], mock: true });

  const auth = await requireRole(["admin", "associate", "student"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId, role } = auth.context;

  let query = supabase.from("admissions").select("*").order("created_at", { ascending: false });
  if (role !== "admin") {
    query = query.or(
      `created_by.eq.${userId},student_user_id.eq.${userId},associate_user_id.eq.${userId}`,
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const auth = await requireRole(["associate", "student"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId, role } = auth.context;

  const payload = await req.json().catch(() => ({}));
  const parsed = admissionPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid admission payload" }, { status: 400 });
  }

  const normalized = {
    ...parsed.data,
    basic_details: {
      ...parsed.data.basic_details,
      aadhar_no: parsed.data.basic_details.aadhar_no.replace(/\s+/g, ""),
      deb_id:
        parsed.data.program_mode === "online"
          ? (parsed.data.basic_details.deb_id ?? "").trim()
          : null,
    },
    personal_details: {
      ...parsed.data.personal_details,
      alternative_email: parsed.data.personal_details.alternative_email || null,
      alternative_mobile_no: parsed.data.personal_details.alternative_mobile_no || null,
    },
  };

  if (
    normalized.program_mode === "online"
    && !normalized.basic_details.deb_id
  ) {
    return NextResponse.json(
      { error: "DEB ID is required for online program admissions." },
      { status: 400 },
    );
  }

  const insertPayload = {
    ...normalized,
    created_by: userId,
    created_by_role: role,
    student_user_id: role === "student" ? userId : null,
    associate_user_id: role === "associate" ? userId : null,
    status: "submitted",
    status_reason: null,
    admin_notes: null,
    status_updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("admissions")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("admission_status_logs").insert({
    admission_id: data.id,
    status: "submitted",
    note: "Admission submitted successfully.",
    updated_by: userId,
  });

  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const auth = await requireRole(["associate", "student", "admin"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId, role } = auth.context;

  const payload = await req.json().catch(() => ({}));
  const parsed = admissionUpdatePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid admission payload" }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabase
    .from("admissions")
    .select("id, created_by, student_user_id, associate_user_id, status")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  if (!canEditAdmission(existing, userId, role)) {
    return NextResponse.json({ error: "You cannot edit this admission now." }, { status: 403 });
  }

  const normalized = {
    ...parsed.data,
    basic_details: {
      ...parsed.data.basic_details,
      aadhar_no: parsed.data.basic_details.aadhar_no.replace(/\s+/g, ""),
      deb_id:
        parsed.data.program_mode === "online"
          ? (parsed.data.basic_details.deb_id ?? "").trim()
          : null,
    },
    personal_details: {
      ...parsed.data.personal_details,
      alternative_email: parsed.data.personal_details.alternative_email || null,
      alternative_mobile_no: parsed.data.personal_details.alternative_mobile_no || null,
    },
  };

  const { data, error } = await supabase
    .from("admissions")
    .update({
      ...normalized,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("admission_status_logs").insert({
    admission_id: parsed.data.id,
    status: existing.status,
    note: "Admission details updated.",
    updated_by: userId,
  });

  return NextResponse.json({ ok: true, data });
}
