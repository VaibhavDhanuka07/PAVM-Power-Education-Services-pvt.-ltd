import { NextResponse } from "next/server";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabase();
    await supabase.auth.signOut();
  }

  const redirectUrl = new URL("/", req.url);
  return NextResponse.redirect(redirectUrl);
}

