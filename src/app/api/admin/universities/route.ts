import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { mockData } from "@/lib/mock-data";
import { isAppRole } from "@/lib/auth/roles";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  mode_supported: z.union([z.string().min(2), z.array(z.string().min(1)).min(1)]),
  logo: z.string().url().optional().or(z.literal("")),
});

const updateSchema = schema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

function normalizeModes(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

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

  return { supabase };
}

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ data: mockData.universities, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase.from("universities").select("*").order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase.from("universities").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    location: parsed.data.location,
    mode_supported: normalizeModes(parsed.data.mode_supported),
    logo: parsed.data.logo || null,
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request) {
  const payload = await req.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { data, error } = await supabase
    .from("universities")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      location: parsed.data.location,
      mode_supported: normalizeModes(parsed.data.mode_supported),
      logo: parsed.data.logo || null,
    })
    .eq("id", parsed.data.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const queryId = url.searchParams.get("id");
  const body = queryId ? { id: queryId } : await req.json();
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, mock: true });

  const admin = await getAdminClient();
  if ("error" in admin) return admin.error;
  const supabase = admin.supabase;
  const { error } = await supabase.from("universities").delete().eq("id", parsed.data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

