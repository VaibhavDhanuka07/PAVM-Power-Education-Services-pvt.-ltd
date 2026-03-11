"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();

  const isLockedDestination = nextPath && nextPath !== "/";
  const authorityOptions = [
    {
      value: "/student/dashboard",
      label: "Student Authority",
      description: "Apply directly and track admissions.",
    },
    {
      value: "/associate/dashboard",
      label: "Associate Authority",
      description: "Submit admissions on behalf of students.",
    },
    {
      value: "/admin",
      label: "Admin Authority",
      description: "Manage admissions, approvals, and roles.",
    },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState(
    isLockedDestination ? nextPath : "/student/dashboard",
  );
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!isSupabaseConfigured()) {
      setStatus("Supabase is not configured yet. Please set environment variables.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setStatus(error.message);
        return;
      }

      await fetch("/api/auth/profile", { method: "POST" });
      const roleRes = await fetch("/api/auth/role", { cache: "no-store" });
      const roleJson = (await roleRes.json().catch(() => ({}))) as { role?: string | null };
      const role = roleJson.role ?? null;
      const roleDestination =
        role === "admin"
          ? "/admin"
          : role === "associate"
            ? "/associate/dashboard"
            : role === "student"
              ? "/student/dashboard"
              : null;
      const dashboardTargets = new Set(["/admin", "/associate/dashboard", "/student/dashboard"]);
      const finalDestination = roleDestination && dashboardTargets.has(destination) ? roleDestination : destination;
      router.push(finalDestination);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Access your account to manage shortlist, reviews, and applications.</p>

      {!isLockedDestination ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Select authority</p>
          <div className="mt-3 grid gap-2">
            {authorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDestination(option.value)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  destination === option.value
                    ? "border-blue-300 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-slate-500">{option.description}</p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Associate authority is assigned only by admin.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500">
          You will be redirected to the requested page after login.
        </p>
      )}

      <form onSubmit={handleLogin} className="mt-5 space-y-4">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}

      <p className="mt-4 text-sm text-slate-600">
        New user?{" "}
        <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-blue-700 hover:underline">
          Create account
        </Link>
      </p>
    </Card>
  );
}
