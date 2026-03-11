import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCourseFee(modeName: string | undefined, value: number) {
  if (slugify(modeName ?? "") === "regular") return "Contact Option";
  if (!value || value <= 0) return "On request";
  return formatCurrency(value);
}

export function formatGlobalFeePreview(modeName: string | undefined, value: number) {
  if (slugify(modeName ?? "") === "regular") return null;
  if (!value || value <= 0) return null;

  // Approximate FX rates for quick on-page global guidance.
  const usd = Math.round(value / 83);
  const eur = Math.round(value / 90);
  const aed = Math.round(value / 22.6);

  return {
    usd: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(usd),
    eur: new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(eur),
    aed: new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(aed),
  };
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MODE_SLUG_ALIASES: Record<string, string> = {
  online: "online",
  "online-ode": "online",
  distance: "distance",
  "distance-mode": "distance",
  regular: "regular",
  "regular-mode": "regular",
  vocational: "vocational",
  "vocational-mode": "vocational",
  "skill-certification": "skill-certification",
  "skill-mode": "skill-certification",
  skill: "skill-certification",
};

export function normalizeModeSlug(value: string | undefined | null) {
  const slug = slugify(value ?? "");
  return MODE_SLUG_ALIASES[slug] ?? slug;
}

const ACCENTS = [
  { chip: "bg-sky-50 text-sky-700", ring: "ring-sky-100", gradient: "from-sky-500/15" },
  { chip: "bg-indigo-50 text-indigo-700", ring: "ring-indigo-100", gradient: "from-indigo-500/15" },
  { chip: "bg-cyan-50 text-cyan-700", ring: "ring-cyan-100", gradient: "from-cyan-500/15" },
  { chip: "bg-blue-50 text-blue-700", ring: "ring-blue-100", gradient: "from-blue-500/15" },
  { chip: "bg-teal-50 text-teal-700", ring: "ring-teal-100", gradient: "from-teal-500/15" },
  { chip: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-100", gradient: "from-emerald-500/15" },
];

export function getUniversityAccent(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

