import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getUniversityBySlug } from "@/lib/queries/universities";
import { getCourseListings } from "@/lib/queries/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars } from "@/components/ui/stars";
import { mockData } from "@/lib/mock-data";
import { formatCourseFee, formatNumber, getUniversityAccent, slugify } from "@/lib/utils";
import { getFeeBreakdown } from "@/lib/course-content";
import { getUniversityMedia } from "@/lib/university-media";
import { UniversityVideoPlayer } from "@/components/sections/university-video-player";

const ONLINE_EXPECTED_BY_UNIVERSITY: Record<string, number> = {
  "shoolini-university": 7,
  "maharishi-markandeshwar-university": 6,
  "noida-international-university": 9,
  "suresh-gyan-vihar-university": 12,
  "bharati-vidyapeeth-university": 4,
  "marwadi-university": 4,
  "uttaranchal-university": 4,
  "mangalayatan-university": 19,
};

function hashCode(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getGuaranteedOnlineUniversityListings(universitySlug: string) {
  const university = mockData.universities.find((u) => u.slug === universitySlug);
  if (!university) return [];

  return mockData.universityCourses
    .filter((link) => link.university_id === university.id)
    .map((link) => {
      const course = mockData.courses.find((c) => c.id === link.course_id);
      if (!course || course.mode?.name !== "Online") return null;

      const rating = mockData.ratings.find((r) => r.course_id === course.id);
      return {
        course,
        min_fees: link.fees,
        university_count: 1,
        student_count: 100 + (hashCode(link.id) % 4901),
        average_rating: Number(rating?.rating ?? 0),
        review_count: rating?.review_count ?? 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.course.name.localeCompare(b.course.name));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) return {};

  return buildMetadata({
    title: university.name,
    description: university.description,
    path: `/universities/${university.slug}`,
  });
}

export default async function UniversityDetailsPage({ params }: { params: { slug: string } }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) notFound();
  const media = await getUniversityMedia(university.slug);
  const galleryImages = media.imageUrls.length ? media.imageUrls : [university.logo ?? "/next.svg"];
  const galleryVideos = media.videoUrls.slice(0, 2);

  let courses = await getCourseListings({ university: university.slug });
  const expectedOnline = ONLINE_EXPECTED_BY_UNIVERSITY[university.slug];
  if (expectedOnline) {
    const guaranteed = getGuaranteedOnlineUniversityListings(university.slug);
    if (guaranteed.length >= expectedOnline) {
      courses = guaranteed;
    } else if (courses.length < expectedOnline) {
      courses = await getCourseListings({ university: university.slug, mode: "online" });
    }
  }

  const offered = courses.slice(0, 24);
  const accent = getUniversityAccent(university.slug);
  const preferredProgramMode = university.mode_supported
    .map((mode: string) => slugify(mode))
    .find((mode: string) => mode === "regular" || mode === "online" || mode === "distance");
  const preferredCourse = offered[0]?.course;

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${accent.gradient} to-transparent`} />
        <div className="relative flex flex-wrap items-center gap-6">
          {university.logo ? (
            <div className={`relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 ring-4 ${accent.ring}`}>
              <Image src={university.logo} alt={university.name} fill sizes="80px" className="object-contain" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-500">Logo</div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{university.name}</h1>
            <p className="text-slate-600">{university.location}</p>
            <p className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${accent.chip}`}>
              Modes: {university.mode_supported.join(", ")}
            </p>
          </div>
        </div>
        <p className="mt-5 text-slate-700">{university.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Students Enrolled</CardTitle></CardHeader><CardContent>{formatNumber(4200 + offered.length * 120)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Average Rating</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><Stars value={4.2} />4.2</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Programs Offered</CardTitle></CardHeader><CardContent>{offered.length}</CardContent></Card>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900">Campus Gallery</h2>
          <p className="text-sm text-slate-500">Photos and videos of {university.name}</p>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-12">
          <div className="grid auto-rows-[170px] gap-3 sm:grid-cols-2 md:auto-rows-[185px] xl:col-span-7">
            {galleryImages.slice(0, 5).map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${
                  idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <Image
                  src={url}
                  alt={`${university.name} campus photo ${idx + 1}`}
                  fill
                  sizes={idx === 0 ? "900px" : "420px"}
                  className="object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
            {galleryVideos.length ? (
              galleryVideos.map((videoUrl, idx) => (
                <UniversityVideoPlayer
                  key={`${videoUrl}-${idx}`}
                  src={videoUrl}
                  poster={galleryImages[idx] ?? galleryImages[0]}
                  title={idx === 0 ? "Campus Tour" : "Classroom Life"}
                  className="h-full min-h-[220px]"
                />
              ))
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {galleryImages.slice(0, 2).map((imageUrl, idx) => (
                  <div key={`${imageUrl}-${idx}-placeholder`} className="relative min-h-[220px] overflow-hidden rounded-xl border border-slate-200">
                    <Image
                      src={imageUrl}
                      alt={`${university.name} campus highlights ${idx + 1}`}
                      fill
                      sizes="700px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/35" />
                    <p className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
                      Campus highlights preview
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/universities/${university.slug}/media`} className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Open Full Media Library
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Courses Offered</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {offered.map((item) => (
            <div key={item.course.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{item.course.name}</h3>
              <p className="text-sm text-slate-600">{item.course.duration} - {item.course.mode?.name}</p>
              {(() => {
                const fee = getFeeBreakdown(item.course.mode?.name, item.min_fees, item.course.duration);
                return (
                  <>
                    <p className="mt-1 text-sm font-medium text-slate-800">Total Fees: {formatCourseFee(item.course.mode?.name, item.min_fees)}</p>
                    <p className="text-xs text-slate-600">1 Year Fees: <span className="font-semibold text-slate-800">{fee.perYearLabel}</span></p>
                    <p className="text-xs text-slate-600">1 Semester Fees: <span className="font-semibold text-slate-800">{fee.perSemesterLabel}</span></p>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-bold text-slate-900">Start Admission Application</h2>
        <p className="mt-2 text-sm text-slate-700">
          Fill the complete admission form with documents and submit for admin approval.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={{
              pathname: "/apply-now",
              query: {
                mode: preferredProgramMode,
                course: preferredCourse?.name,
                stream: preferredCourse?.sector?.name,
              },
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
