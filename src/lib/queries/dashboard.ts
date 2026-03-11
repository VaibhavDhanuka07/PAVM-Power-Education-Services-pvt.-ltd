import { getCourseListings } from "@/lib/queries/courses";
import { getUniversityListings } from "@/lib/queries/universities";
import { getBlogs } from "@/lib/queries/blogs";
import { getConsultationLeads } from "@/lib/queries/consultations";

export async function getDashboardStats() {
  const [courses, universities, blogs, leads] = await Promise.all([
    getCourseListings(),
    getUniversityListings(),
    getBlogs(),
    getConsultationLeads(),
  ]);

  const totalStudents = courses.reduce((acc, course) => acc + course.student_count, 0);
  const topSearchedCourses = courses
    .slice()
    .sort((a, b) => b.student_count - a.student_count)
    .slice(0, 5)
    .map((c) => ({ name: c.course.name, demand: c.student_count }));

  const topConvertingUniversities = universities
    .slice()
    .sort((a, b) => b.student_count - a.student_count)
    .slice(0, 5)
    .map((u) => ({ name: u.university.name, leads: Math.round(u.student_count / 12) }));

  const leadSources = [
    { source: "Organic Search", count: Math.round(leads.length * 0.35) },
    { source: "WhatsApp CTA", count: Math.round(leads.length * 0.3) },
    { source: "Consultation Form", count: Math.round(leads.length * 0.2) },
    { source: "AI Advisor", count: Math.round(leads.length * 0.15) },
  ];

  const funnelDropOff = [
    { stage: "Visited", value: 100 },
    { stage: "Course Search", value: 71 },
    { stage: "Shortlist", value: 43 },
    { stage: "Consultation Lead", value: 24 },
    { stage: "Enrolled", value: 11 },
  ];

  return {
    totalCourses: courses.length,
    totalUniversities: universities.length,
    totalBlogs: blogs.length,
    totalStudents,
    topSearchedCourses,
    topConvertingUniversities,
    leadSources,
    funnelDropOff,
  };
}

