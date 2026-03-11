"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppRole } from "@/lib/auth/roles";

type RolePayload = {
  role?: AppRole | null;
  email?: string | null;
};

const DASHBOARD_PATHS = [
  "/student/dashboard",
  "/associate/dashboard",
  "/admin",
] as const;

const PUBLIC_PREFIXES = [
  "/courses",
  "/universities",
  "/blog",
  "/about-us",
  "/about",
  "/contact-us",
  "/apply-now",
  "/consultation",
  "/compare",
  "/ratings",
  "/shortlist",
  "/career-pathways",
  "/programs",
  "/privacy-security",
  "/authorizations",
  "/international-students",
  "/scholarship-emi",
  "/best-vocational-courses-after-12th",
  "/online-mba-in-india",
  "/distance-bca-fees",
  "/ai-advisor",
  "/application-tracking",
  "/login",
  "/signup",
] as const;

function resolveDashboardForRole(role: AppRole) {
  if (role === "admin") return "/admin";
  if (role === "associate") return "/associate/dashboard";
  return "/student/dashboard";
}

export function RoleRedirector() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const isPublic =
      pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (isPublic) return;

    const run = async () => {
      try {
        const res = await fetch("/api/auth/role", { cache: "no-store" });
        if (!active) return;
        if (!res.ok) return;
        const json = (await res.json().catch(() => ({}))) as RolePayload;
        if (!json.role) return;

        const expected = resolveDashboardForRole(json.role);
        if (pathname.startsWith(expected)) return;

        // Redirect any logged-in user to their authority dashboard.
        router.replace(expected);
      } catch {
        // ignore role fetch failures
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  return null;
}
