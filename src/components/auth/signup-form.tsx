"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SignupForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();

  const authorityOptions = [
    {
      value: "student",
      label: "Student Authority",
      description: "Default signup role for all new accounts.",
      available: true,
    },
    {
      value: "associate",
      label: "Associate Authority",
      description: "Granted only by admin after verification.",
      available: false,
    },
    {
      value: "admin",
      label: "Admin Authority",
      description: "Assigned manually by system admin.",
      available: false,
    },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!isSupabaseConfigured()) {
      setStatus("Supabase is not configured yet. Please set environment variables.");
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      // If auto-login is enabled, create profile immediately.
      if (data.session?.user) {
        await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name: name.trim() }),
        });
        router.push(nextPath);
        router.refresh();
        return;
      }

      setStatus("Signup successful. Please verify your email, then login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
      <p className="mt-1 text-sm text-slate-600">All new accounts are created as Student. Associate authority can be granted only by Admin.</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Authority type</p>
        <div className="mt-3 grid gap-2">
          {authorityOptions.map((option) => (
            <div
              key={option.value}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                option.available
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="text-xs text-slate-500">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSignup} className="mt-5 space-y-4">
        <Input
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
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
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-blue-700 hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
}
