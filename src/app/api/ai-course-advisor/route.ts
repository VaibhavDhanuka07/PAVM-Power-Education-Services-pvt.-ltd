import { NextResponse } from "next/server";
import { z } from "zod";
import { getCourseListings } from "@/lib/queries/courses";
import { getUniversityListings } from "@/lib/queries/universities";
import { formatCourseFee, slugify } from "@/lib/utils";

const schema = z.object({
  budget: z.number().min(1000).max(2000000),
  mode: z.string().min(2),
  careerGoal: z.string().min(2),
  city: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid advisor payload." }, { status: 400 });
    }

    const { budget, mode, careerGoal, city } = parsed.data;
    const modeSlug = slugify(mode);

    const [courses, universities] = await Promise.all([
      getCourseListings({ mode: modeSlug }),
      getUniversityListings(),
    ]);

    const cityKey = city.toLowerCase();
    const goalKey = careerGoal.toLowerCase();

    const rankedCourses = courses
      .map((item) => {
        const budgetScore = budget >= item.min_fees ? 25 : Math.max(0, 25 - Math.round((item.min_fees - budget) / 5000));
        const goalScore =
          `${item.course.name} ${item.course.description} ${item.course.sector?.name ?? ""}`.toLowerCase().includes(goalKey) ? 35 : 10;
        const qualityScore = Math.round(item.average_rating * 8) + Math.min(20, Math.round(item.review_count / 20));
        return { item, score: budgetScore + goalScore + qualityScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.item);

    const rankedUniversities = universities
      .map((item) => {
        const cityScore = item.university.location.toLowerCase().includes(cityKey) ? 30 : 8;
        const modeScore = item.university.mode_supported.some((m) => slugify(m) === modeSlug) ? 30 : 0;
        const qualityScore = Math.round(item.average_rating * 10) + Math.min(20, Math.round(item.student_count / 1500));
        return { item, score: cityScore + modeScore + qualityScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.item);

    const feeMin = rankedCourses.length ? Math.min(...rankedCourses.map((c) => c.min_fees)) : 0;
    const feeMax = rankedCourses.length ? Math.max(...rankedCourses.map((c) => c.min_fees)) : 0;

    return NextResponse.json({
      summary: `Best-fit recommendations for ${mode} mode in/near ${city}.`,
      feeRange: rankedCourses.length ? `${formatCourseFee(mode, feeMin)} to ${formatCourseFee(mode, feeMax)}` : "Not available",
      universities: rankedUniversities.map((u) => ({
        id: u.university.id,
        name: u.university.name,
        slug: u.university.slug,
        location: u.university.location,
        rating: u.average_rating,
        programs: u.course_count,
      })),
      courses: rankedCourses.map((c) => ({
        id: c.course.id,
        name: c.course.name,
        slug: c.course.slug,
        duration: c.course.duration,
        fees: formatCourseFee(c.course.mode?.name, c.min_fees),
        rating: c.average_rating,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to process advisor request." }, { status: 500 });
  }
}

