import { mockData, getMockUniversityListings } from "@/lib/mock-data";
import { University, UniversityListing } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getUniversities(): Promise<University[]> {
  if (!isSupabaseConfigured()) return mockData.universities;

  const supabase = createClient();
  const { data, error } = await supabase.from("universities").select("*").order("name", { ascending: true });

  if (error || !data) return mockData.universities;
  return data;
}

export async function getUniversityBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return mockData.universities.find((u) => u.slug === slug) || null;
  }

  const supabase = createClient();
  const { data } = await supabase.from("universities").select("*").eq("slug", slug).maybeSingle();
  if (data) return data;
  return mockData.universities.find((u) => u.slug === slug) || null;
}

export async function getUniversityListings(): Promise<UniversityListing[]> {
  if (!isSupabaseConfigured()) return getMockUniversityListings();

  const supabase = createClient();
  const [universitiesResp, linkResp, studentsResp, ratingsResp] = await Promise.all([
    supabase.from("universities").select("*").order("name"),
    supabase.from("university_courses").select("university_id, course_id"),
    supabase.from("students").select("university_id, student_count"),
    supabase.from("ratings").select("rating, course_id"),
  ]);

  if (!universitiesResp.data || !linkResp.data) return getMockUniversityListings();

  return universitiesResp.data.map((university) => {
    const links = linkResp.data!.filter((row) => row.university_id === university.id);
    const linkedCourseIds = links.map((row) => row.course_id);
    const studentCount =
      studentsResp.data?.filter((row) => row.university_id === university.id).reduce((acc, row) => acc + row.student_count, 0) ?? 0;
    const courseRatings = ratingsResp.data?.filter((row) => linkedCourseIds.includes(row.course_id)) ?? [];
    const averageRating = courseRatings.length > 0 ? courseRatings.reduce((acc, row) => acc + row.rating, 0) / courseRatings.length : 0;

    return {
      university,
      course_count: links.length,
      student_count: studentCount,
      average_rating: Number(averageRating.toFixed(1)),
    };
  });
}

