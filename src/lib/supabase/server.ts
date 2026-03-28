import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function isSupabaseEnabledByEnv() {
  return process.env.NEXT_PUBLIC_SUPABASE_ENABLED !== "false";
}

export function createClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  const noStoreFetch: typeof fetch = (input, init) =>
    fetch(input, {
      ...init,
      cache: "no-store",
    });

  return createServerClient(url, anonKey, {
    global: {
      fetch: noStoreFetch,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value, ...(options || {}) });
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value: "", ...(options || {}) });
      },
    },
  });
}

export function isSupabaseConfigured() {
  return Boolean(isSupabaseEnabledByEnv() && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}


