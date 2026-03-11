import { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getBlogs } from "@/lib/queries/blogs";
import { getCareerPathways } from "@/lib/queries/career-pathways";
import { getCourses } from "@/lib/queries/courses";
import { getUniversities } from "@/lib/queries/universities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, careerPathways, courses, universities] = await Promise.all([
    getBlogs(),
    getCareerPathways(),
    getCourses(),
    getUniversities(),
  ]);

  const staticRoutes = [
    "",
    "/courses",
    "/universities",
    "/consultation",
    "/apply-now",
    "/contact-us",
    "/about-us",
    "/authorizations",
    "/privacy-security",
    "/blog",
    "/ratings",
    "/compare",
    "/ai-advisor",
    "/shortlist",
    "/scholarship-emi",
    "/application-tracking",
    "/career-pathways",
    "/international-students",
    "/online-mba-in-india",
    "/distance-bca-fees",
    "/best-vocational-courses-after-12th",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...courses.map((course) => ({
      url: `${SITE.url}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...universities.map((university) => ({
      url: `${SITE.url}/universities/${university.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...universities.map((university) => ({
      url: `${SITE.url}/universities/${university.slug}/media`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogs.map((blog) => ({
      url: `${SITE.url}/blog/${blog.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...careerPathways.map((pathway) => ({
      url: `${SITE.url}/career-pathways/${pathway.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

