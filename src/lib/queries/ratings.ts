import { mockData } from "@/lib/mock-data";
import { Rating } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getRatings(courseId?: string): Promise<Rating[]> {
  if (!isSupabaseConfigured()) {
    return courseId ? mockData.ratings.filter((r) => r.course_id === courseId) : mockData.ratings;
  }

  const supabase = createClient();
  let query = supabase.from("ratings").select("*").order("rating", { ascending: false });
  if (courseId) query = query.eq("course_id", courseId);
  const { data } = await query;
  return data ?? [];
}

export async function getRatingSummary(courseId?: string) {
  const ratings = await getRatings(courseId);
  const courseCount = ratings.length;
  const totalReviews = ratings.reduce((acc, item) => acc + item.review_count, 0);
  const weightedSum = ratings.reduce((acc, item) => acc + item.rating * item.review_count, 0);
  const average = totalReviews ? weightedSum / totalReviews : 0;
  return { total: totalReviews, courseCount, average: Number(average.toFixed(1)) };
}

