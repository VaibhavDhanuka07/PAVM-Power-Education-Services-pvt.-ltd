import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Film, Images } from "lucide-react";
import { getUniversityBySlug } from "@/lib/queries/universities";
import { getUniversityMedia } from "@/lib/university-media";
import { UniversityVideoPlayer } from "@/components/sections/university-video-player";

export default async function UniversityMediaPage({ params }: { params: { slug: string } }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) notFound();
  const media = await getUniversityMedia(university.slug);
  const imageUrls = media.imageUrls.length ? media.imageUrls : [university.logo ?? "/next.svg"];

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">{university.name} Media Library</h1>
        <p className="mt-2 text-slate-600">Dedicated photo and video gallery with campus tour style clips.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr,1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
            <Images className="h-5 w-5 text-blue-700" />
            Photo Gallery
          </p>
          <div className="mt-4 grid auto-rows-[180px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {imageUrls.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-3 lg:row-span-2" : ""
                }`}
              >
                <Image
                  src={url}
                  alt={`${university.name} campus photo ${idx + 1}`}
                  fill
                  sizes={idx === 0 ? "1000px" : "360px"}
                  className="object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
            <Film className="h-5 w-5 text-blue-700" />
            Campus Tour Videos
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            {media.videoUrls.length ? (
              media.videoUrls.map((url, idx) => (
                <UniversityVideoPlayer
                  key={`${url}-${idx}`}
                  src={url}
                  poster={imageUrls[idx] ?? imageUrls[0]}
                  title={`Campus Clip ${idx + 1}`}
                  className="min-h-[240px]"
                />
              ))
            ) : (
              <div className="grid gap-3">
                {imageUrls.slice(0, 2).map((url, idx) => (
                  <div key={`${url}-${idx}-video-placeholder`} className="relative min-h-[240px] overflow-hidden rounded-xl border border-slate-200">
                    <Image
                      src={url}
                      alt={`${university.name} visual highlight ${idx + 1}`}
                      fill
                      sizes="700px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/35" />
                    <p className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
                      Campus video highlights
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>

      <Link href={`/universities/${university.slug}`} className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Back to University Page
      </Link>
    </section>
  );
}
