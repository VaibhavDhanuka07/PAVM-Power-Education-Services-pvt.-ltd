"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AppRole, formatAppRoleLabel } from "@/lib/auth/roles";

type AuthState = {
  email: string | null;
  role: AppRole | null;
};

type HeaderAuthProps = {
  initialEmail: string | null;
  initialRole: AppRole | null;
};

function useRoleRefresh(initialEmail: string | null, initialRole: AppRole | null) {
  const [state, setState] = useState<AuthState>({
    email: initialEmail,
    role: initialRole,
  });

  const updateState = (next: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...next }));
  };

  useEffect(() => {
    let active = true;

    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/role", { cache: "no-store" });
        if (!active) return;
        if (!res.ok) {
          if (res.status === 401) {
            updateState({ email: null, role: null });
          }
          return;
        }
        const json = (await res.json()) as { email?: string | null; role?: AppRole | null };
        updateState({
          email: json.email ?? null,
          role: json.role ?? null,
        });
      } catch {
        // keep last known state
      }
    };

    void fetchRole();
    const onFocus = () => void fetchRole();
    window.addEventListener("focus", onFocus);

    const interval = window.setInterval(fetchRole, 30000);

    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

function roleDashboardLabel(role: AppRole) {
  if (role === "admin") return "Admin";
  if (role === "associate") return "Associate Dashboard";
  return "Student Dashboard";
}

function roleDashboardHref(role: AppRole) {
  if (role === "admin") return "/admin";
  if (role === "associate") return "/associate/dashboard";
  return "/student/dashboard";
}

export function HeaderAuthControls({ initialEmail, initialRole }: HeaderAuthProps) {
  const { email, role } = useRoleRefresh(initialEmail, initialRole);
  const badgeLabel = useMemo(() => (role ? formatAppRoleLabel(role) : "Student"), [role]);
  const outlineButton = `${buttonVariants({ variant: "outline", size: "sm" })} h-8 px-2.5 text-xs`;
  const solidButton = `${buttonVariants({ size: "sm" })} h-8 px-2.5 text-xs`;

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={`${outlineButton} rounded-xl`}>
          Login
        </Link>
        <Link href="/signup" className={`${solidButton} rounded-xl`}>
          Sign Up
        </Link>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Signed in
          </span>
          <span className="max-w-[190px] truncate text-[11px] text-slate-600" title={email}>
            {email}
          </span>
        </div>
        <Link href="/logout" className={`${outlineButton} shrink-0 rounded-xl`}>
          Logout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Link
        href={roleDashboardHref(role)}
        className={`${outlineButton} shrink-0 rounded-xl`}
      >
        {roleDashboardLabel(role)}
      </Link>
      <div className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
          {badgeLabel}
        </span>
        <span className="max-w-[190px] truncate text-[11px] text-slate-600" title={email}>
          {email}
        </span>
      </div>
      <Link href="/logout" className={`${outlineButton} shrink-0 rounded-xl`}>
        Logout
      </Link>
    </div>
  );
}

export function HeaderAuthMenu({ initialEmail, initialRole }: HeaderAuthProps) {
  const { email, role } = useRoleRefresh(initialEmail, initialRole);

  if (!email) {
    return (
      <>
        <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">
          Login
        </Link>
        <Link href="/signup" className="block rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-slate-100">
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
        Signed in as {role ? formatAppRoleLabel(role) : "Student"}: {email}
      </div>
      {role ? (
        <Link href={roleDashboardHref(role)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">
          {roleDashboardLabel(role)}
        </Link>
      ) : null}
      <Link href="/logout" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-blue-700">
        Logout
      </Link>
    </>
  );
}
