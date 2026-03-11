import { NextResponse } from "next/server";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { normalizeAppRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

function noStore<T extends object>(payload: T, init?: ResponseInit) {
  const response = NextResponse.json(payload, init);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return noStore({ ok: true, role: null, email: null, mock: true });
  }

  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return noStore({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, email")
    .eq("id", authData.user.id)
    .maybeSingle();

  const role = normalizeAppRole(profile?.role);

  return noStore({
    ok: true,
    role,
    email: authData.user.email ?? profile?.email ?? null,
  });
}
