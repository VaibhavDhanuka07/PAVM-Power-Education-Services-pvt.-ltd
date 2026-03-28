import { promises as fs } from "fs";
import path from "path";

export type UniversityMedia = {
  imageUrls: string[];
  videoUrls: string[];
};

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const UNIVERSITY_MEDIA_ROOT = path.join(PUBLIC_ROOT, "universities-media");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const IMAGE_EXTENSION_PRIORITY: Record<string, number> = {
  ".avif": 0,
  ".webp": 1,
  ".jpg": 2,
  ".jpeg": 2,
  ".png": 3,
  ".svg": 4,
};

function toWebPath(absolutePath: string) {
  const relative = path.relative(PUBLIC_ROOT, absolutePath).replace(/\\/g, "/");
  return `/${relative}`;
}

async function directoryExists(dirPath: string) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function listMediaFiles(dirPath: string, extensions: Set<string>) {
  if (!(await directoryExists(dirPath))) return [];

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aHero = aLower.includes("hero");
      const bHero = bLower.includes("hero");
      if (aHero && !bHero) return -1;
      if (!aHero && bHero) return 1;
      const aPriority = IMAGE_EXTENSION_PRIORITY[path.extname(aLower)] ?? 10;
      const bPriority = IMAGE_EXTENSION_PRIORITY[path.extname(bLower)] ?? 10;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .map((name) => toWebPath(path.join(dirPath, name)));
}

async function getLogoFallback(slug: string) {
  const logoCandidates = [
    path.join(PUBLIC_ROOT, "logos", "universities", `${slug}.jpeg`),
    path.join(PUBLIC_ROOT, "logos", "universities", `${slug}.jpg`),
    path.join(PUBLIC_ROOT, "logos", "universities", `${slug}.png`),
    path.join(PUBLIC_ROOT, "logos", "universities", `${slug}.webp`),
    path.join(PUBLIC_ROOT, "logos", "universities", `${slug}.svg`),
  ];

  for (const candidate of logoCandidates) {
    try {
      await fs.access(candidate);
      return toWebPath(candidate);
    } catch {
      continue;
    }
  }

  return null;
}

async function getFallbackMedia(slug: string): Promise<UniversityMedia> {
  const globalImageDir = path.join(UNIVERSITY_MEDIA_ROOT, "global", "images");
  const globalVideoDir = path.join(UNIVERSITY_MEDIA_ROOT, "global", "videos");

  const [globalImages, globalVideos, logoFallback] = await Promise.all([
    listMediaFiles(globalImageDir, IMAGE_EXTENSIONS),
    listMediaFiles(globalVideoDir, VIDEO_EXTENSIONS),
    getLogoFallback(slug),
  ]);

  const imageUrls = globalImages.length ? globalImages : logoFallback ? [logoFallback] : [];
  return {
    imageUrls,
    videoUrls: globalVideos,
  };
}

export async function getUniversityMedia(slug: string): Promise<UniversityMedia> {
  const imageDir = path.join(UNIVERSITY_MEDIA_ROOT, slug, "images");
  const videoDir = path.join(UNIVERSITY_MEDIA_ROOT, slug, "videos");

  const [imageUrls, videoUrls] = await Promise.all([
    listMediaFiles(imageDir, IMAGE_EXTENSIONS),
    listMediaFiles(videoDir, VIDEO_EXTENSIONS),
  ]);

  if (imageUrls.length || videoUrls.length) {
    return { imageUrls, videoUrls };
  }

  return getFallbackMedia(slug);
}
