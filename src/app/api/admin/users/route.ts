import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { APP_ROLES, isAppRole } from "@/lib/auth/roles";

const updateSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(APP_ROLES),
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

  return { supabase, userId: authData.user.id };
}

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ data: [], mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;

  const { data, error } = await admin.supabase
    .from("user_profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function PUT(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const payload = await req.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;

  // Prevent accidental self-demotion from admin in one click.
  if (parsed.data.id === admin.userId && parsed.data.role !== "admin") {
    return NextResponse.json({ error: "You cannot demote your own admin role." }, { status: 400 });
  }

  const { data, error } = await admin.supabase
    .from("user_profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.id)
    .select("id, email, full_name, role, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

