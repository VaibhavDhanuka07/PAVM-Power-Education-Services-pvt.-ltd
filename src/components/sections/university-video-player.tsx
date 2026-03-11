"use client";

import { useState } from "react";
import { AlertCircle, ExternalLink, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function UniversityVideoPlayer({
  src,
  poster,
  title,
  className,
}: {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("flex h-56 w-full flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-4 text-center", className)}>
        <AlertCircle className="h-5 w-5 text-amber-700" />
        <p className="mt-2 text-sm font-semibold text-amber-900">Video preview unavailable</p>
        <p className="mt-1 text-xs text-amber-800">Open directly in a new tab.</p>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Video
        </a>
      </div>
    );
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-slate-200 bg-black", className)}>
      <video
        className="h-full min-h-[220px] w-full object-cover"
        controls
        muted
        playsInline
        preload="metadata"
        poster={poster}
        onError={() => setFailed(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
        <PlayCircle className="h-3.5 w-3.5" />
        {title}
      </div>
    </div>
  );
}
