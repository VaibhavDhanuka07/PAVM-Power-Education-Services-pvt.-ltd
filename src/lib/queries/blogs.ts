import { mockData } from "@/lib/mock-data";
import { Blog } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getBlogs(): Promise<Blog[]> {
  if (!isSupabaseConfigured()) return mockData.blogs;

  const supabase = createClient();
  const { data } = await supabase.from("blogs").select("*").order("title", { ascending: true });
  if (!data || data.length === 0) return mockData.blogs;
  return data;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!isSupabaseConfigured()) return mockData.blogs.find((item) => item.slug === slug) ?? null;

  const supabase = createClient();
  const { data } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  return data ?? mockData.blogs.find((item) => item.slug === slug) ?? null;
}

