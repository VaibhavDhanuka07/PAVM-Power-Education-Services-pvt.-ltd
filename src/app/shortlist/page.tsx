import { ShortlistDashboard } from "@/components/sections/shortlist-dashboard";
import { getUniversities } from "@/lib/queries/universities";
import { getCourseListings } from "@/lib/queries/courses";
import { formatCourseFee } from "@/lib/utils";

export default async function ShortlistPage({
  searchParams,
}: {
  searchParams: { university?: string; course?: string };
}) {
  const [universities, courses] = await Promise.all([getUniversities(), getCourseListings()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <ShortlistDashboard
        universities={universities.map((u) => ({ name: u.name, slug: u.slug, location: u.location }))}
        courses={courses.map((c) => ({
          name: c.course.name,
          slug: c.course.slug,
          duration: c.course.duration,
          fees: formatCourseFee(c.course.mode?.name, c.min_fees),
        }))}
        addUniversity={searchParams.university}
        addCourse={searchParams.course}
      />
    </section>
  );
}

