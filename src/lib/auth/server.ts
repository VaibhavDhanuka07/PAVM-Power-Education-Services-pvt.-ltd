import { NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { AppRole, normalizeAppRole } from "@/lib/auth/roles";

export type AuthContext = {
  supabase: ReturnType<typeof createServerSupabase>;
  userId: string;
  email: string;
  role: AppRole;
};

export async function getAuthenticatedUserWithRole(): Promise<
  | { ok: true; context: AuthContext }
  | { ok: false; response: NextResponse }
> {
  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  const role = normalizeAppRole(profile?.role);

  if (profileError || !role) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Profile not found" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    context: {
      supabase,
      userId: authData.user.id,
      email: authData.user.email ?? "",
      role,
    },
  };
}

export async function requireRole(
  allowedRoles: AppRole[],
): Promise<
  | { ok: true; context: AuthContext }
  | { ok: false; response: NextResponse }
> {
  const auth = await getAuthenticatedUserWithRole();
  if (!auth.ok) return auth;

  if (!allowedRoles.includes(auth.context.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return auth;
}
