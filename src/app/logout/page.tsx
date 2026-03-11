"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {
          // ignore sign out errors
        }
      }

      if (!active) return;
      router.replace("/login");
      router.refresh();
    };

    void run();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Signing you out...</h1>
      <p className="mt-2 text-sm text-slate-600">You will be redirected to the login page.</p>
    </section>
  );
}
