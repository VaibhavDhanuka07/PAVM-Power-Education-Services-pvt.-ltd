import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

const schema = z.object({
  full_name: z.string().min(2).max(120).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: unknown = {};
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  const parsed = schema.safeParse(payload);
  const fullNameFromBody = parsed.success ? parsed.data.full_name : "";
  const fullNameFromMeta =
    typeof authData.user.user_metadata?.full_name === "string" ? authData.user.user_metadata.full_name : null;
  const fullName = fullNameFromBody || fullNameFromMeta || null;

  const { error } = await supabase.from("user_profiles").insert({
    id: authData.user.id,
    email: authData.user.email ?? "user@unknown.local",
    full_name: fullName,
    role: "student",
  });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
