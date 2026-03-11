export const APP_ROLES = ["admin", "associate", "student"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type StoredAppRole = AppRole | "user";

export const APP_ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  associate: "Associate",
  student: "Student",
};

export function isAppRole(value: string | null | undefined): value is AppRole {
  return Boolean(value && APP_ROLES.includes(value as AppRole));
}

export function normalizeAppRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;
  if (value === "user") return "student";
  return isAppRole(value) ? value : null;
}

export function formatAppRoleLabel(role: AppRole) {
  return APP_ROLE_LABELS[role];
}
