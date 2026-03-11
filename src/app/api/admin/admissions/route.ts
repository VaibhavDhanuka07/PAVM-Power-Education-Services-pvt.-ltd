import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { admissionStatusUpdateSchema } from "@/lib/admissions/schema";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ data: [], mock: true });

  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const { supabase } = auth.context;

  const { data, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const { supabase, userId } = auth.context;

  const payload = await req.json().catch(() => ({}));
  const parsed = admissionStatusUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status payload" }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabase
    .from("admissions")
    .select(
      "id, status, status_reason, admin_notes, semester_fees, semester_fee_paid, semester_fee_due, fee_updated_at, status_updated_at, associate_discount_amount, associate_discount_note, associate_discount_updated_at",
    )
    .eq("id", parsed.data.admission_id)
    .maybeSingle();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  const nextStatus = parsed.data.status ?? existing.status;
  const nextStatusReason =
    parsed.data.status_reason !== undefined ? parsed.data.status_reason : existing.status_reason;
  const nextAdminNotes =
    parsed.data.admin_notes !== undefined ? parsed.data.admin_notes : existing.admin_notes;
  const nextAssociateDiscountAmount =
    parsed.data.associate_discount_amount !== undefined
      ? parsed.data.associate_discount_amount
      : existing.associate_discount_amount;
  const nextAssociateDiscountNote =
    parsed.data.associate_discount_note !== undefined
      ? parsed.data.associate_discount_note
      : existing.associate_discount_note;

  const semesterFeesProvided = Array.isArray(parsed.data.semester_fees);
  const nextSemesterFees = semesterFeesProvided ? parsed.data.semester_fees ?? [] : existing.semester_fees ?? [];
  const feeTotals = semesterFeesProvided
    ? nextSemesterFees.reduce(
        (acc, row) => ({
          paid: acc.paid + (row.paid ?? 0),
          due: acc.due + (row.due ?? 0),
        }),
        { paid: 0, due: 0 },
      )
    : null;

  const nextSemesterFeePaid =
    parsed.data.semester_fee_paid !== undefined
      ? parsed.data.semester_fee_paid
      : feeTotals
        ? feeTotals.paid
        : existing.semester_fee_paid ?? null;
  const nextSemesterFeeDue =
    parsed.data.semester_fee_due !== undefined
      ? parsed.data.semester_fee_due
      : feeTotals
        ? feeTotals.due
        : existing.semester_fee_due ?? null;

  const updatePayload = {
    status: nextStatus,
    status_reason: nextStatusReason ?? null,
    admin_notes: nextAdminNotes ?? null,
    associate_discount_amount: nextAssociateDiscountAmount ?? null,
    associate_discount_note: nextAssociateDiscountNote ?? null,
    associate_discount_updated_at:
      parsed.data.associate_discount_amount !== undefined || parsed.data.associate_discount_note !== undefined
        ? new Date().toISOString()
        : existing.associate_discount_updated_at ?? null,
    semester_fee_paid: nextSemesterFeePaid ?? null,
    semester_fee_due: nextSemesterFeeDue ?? null,
    semester_fees: nextSemesterFees,
    fee_updated_at: semesterFeesProvided ? new Date().toISOString() : existing.fee_updated_at ?? null,
    status_updated_at: parsed.data.status ? new Date().toISOString() : existing.status_updated_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("admissions")
    .update(updatePayload)
    .eq("id", parsed.data.admission_id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parsed.data.status) {
    await supabase.from("admission_status_logs").insert({
      admission_id: parsed.data.admission_id,
      status: parsed.data.status,
      note: parsed.data.status_reason || parsed.data.admin_notes || "Status updated by admin.",
      updated_by: userId,
    });
  }

  return NextResponse.json({ ok: true, data });
}
