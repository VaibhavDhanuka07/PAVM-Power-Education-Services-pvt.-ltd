import { careerPathwayDefaults } from "@/lib/data/career-pathways";
import { CareerCombo } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function normalizePathway(record: Partial<CareerCombo>, fallbackId: string): CareerCombo {
  return {
    id: record.id ?? fallbackId,
    title: record.title ?? "Career Pathway",
    slug: record.slug ?? fallbackId,
    coaching_program: record.coaching_program ?? "",
    degree_program: record.degree_program ?? "",
    description: record.description ?? "",
    duration: record.duration ?? "2-3 Years",
    price: record.price ?? "Contact for Plan",
    highlight_tag: record.highlight_tag ?? "Career Combo",
  };
}

export async function getCareerPathways(): Promise<CareerCombo[]> {
  if (!isSupabaseConfigured()) return careerPathwayDefaults;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("career_combos")
      .select("*")
      .order("title", { ascending: true });

    if (error || !data || data.length === 0) return careerPathwayDefaults;

    return data.map((item, index) => normalizePathway(item, `career-pathway-${index + 1}`));
  } catch {
    return careerPathwayDefaults;
  }
}

export async function getCareerPathwayBySlug(slug: string): Promise<CareerCombo | null> {
  if (!isSupabaseConfigured()) return careerPathwayDefaults.find((item) => item.slug === slug) ?? null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("career_combos").select("*").eq("slug", slug).maybeSingle();

    if (error || !data) return careerPathwayDefaults.find((item) => item.slug === slug) ?? null;
    return normalizePathway(data, slug);
  } catch {
    return careerPathwayDefaults.find((item) => item.slug === slug) ?? null;
  }
}

