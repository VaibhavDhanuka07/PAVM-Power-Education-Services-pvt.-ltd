import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export function buildMetadata(params: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical = `${SITE.url}${params.path || ""}`;

  return {
    title: `${params.title} | ${SITE.name}`,
    description: params.description,
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "en-US": canonical,
        "en-GB": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url: canonical,
      siteName: SITE.name,
      type: "website",
      locale: "en_IN",
      images: params.image ? [{ url: params.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
      images: params.image ? [params.image] : undefined,
    },
  };
}


