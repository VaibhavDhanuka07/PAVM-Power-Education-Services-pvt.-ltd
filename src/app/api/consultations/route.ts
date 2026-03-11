import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { scoreLead } from "@/lib/lead-scoring";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  course_interest: z.string().min(2),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid consultation payload" }, { status: 400 });
  }

  const leadScore = scoreLead(parsed.data);

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true, leadScore });
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.from("consultations").insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: automationError } = await supabase.from("lead_automation_logs").insert({
    email: parsed.data.email,
    phone: parsed.data.phone,
    score: leadScore.score,
    grade: leadScore.grade,
    assigned_counsellor: leadScore.assignedCounsellor,
    followup_plan: leadScore.followUpPlan,
  });

  if (automationError && !automationError.message.toLowerCase().includes("does not exist")) {
    return NextResponse.json({ error: automationError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leadScore });
}


