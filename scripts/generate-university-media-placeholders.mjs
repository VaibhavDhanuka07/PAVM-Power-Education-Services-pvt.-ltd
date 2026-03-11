import { promises as fs } from "fs";
import path from "path";

const MEDIA_ROOT = path.join(process.cwd(), "public", "universities-media");

const CARD_SCENES = [
  "Campus Life",
  "Academic Block",
  "Library & Learning",
  "Student Collaboration",
  "Labs & Innovation",
  "Events & Culture",
];

function hashCode(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toTitleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitTitle(title) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) return [title];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function buildPalette(slug) {
  const base = hashCode(slug) % 360;
  return {
    dark: `hsl(${base}, 75%, 16%)`,
    mid: `hsl(${(base + 34) % 360}, 78%, 32%)`,
    glow: `hsl(${(base + 78) % 360}, 84%, 58%)`,
    soft: `hsl(${(base + 16) % 360}, 82%, 90%)`,
    accent: `hsl(${(base + 125) % 360}, 84%, 64%)`,
  };
}

function buildSvg({
  slug,
  title,
  scene,
  width,
  height,
  palette,
  index,
}) {
  const gradientId = `grad-${slug}-${index}`;
  const glowId = `glow-${slug}-${index}`;
  const titleLines = splitTitle(title).slice(0, 2);
  const firstLine = escapeXml(titleLines[0]);
  const secondLine = titleLines[1] ? escapeXml(titleLines[1]) : "";
  const campusLabel = escapeXml(scene);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.dark}"/>
      <stop offset="0.5" stop-color="${palette.mid}"/>
      <stop offset="1" stop-color="${palette.glow}"/>
    </linearGradient>
    <radialGradient id="${glowId}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${Math.round(width * 0.74)} ${Math.round(height * 0.24)}) rotate(128) ${Math.round(width * 0.48)} ${Math.round(height * 0.48)}">
      <stop stop-color="${palette.accent}" stop-opacity="0.52"/>
      <stop offset="1" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="${Math.round(width * 0.03)}" fill="url(#${gradientId})"/>
  <rect width="${width}" height="${height}" rx="${Math.round(width * 0.03)}" fill="url(#${glowId})"/>
  <rect x="${Math.round(width * 0.04)}" y="${Math.round(height * 0.08)}" width="${Math.round(width * 0.92)}" height="${Math.round(height * 0.84)}" rx="${Math.round(width * 0.025)}" fill="white" fill-opacity="0.06"/>
  <path d="M ${Math.round(width * -0.05)} ${Math.round(height * 0.78)} C ${Math.round(width * 0.2)} ${Math.round(height * 0.65)}, ${Math.round(width * 0.35)} ${Math.round(height * 0.92)}, ${Math.round(width * 0.65)} ${Math.round(height * 0.76)} C ${Math.round(width * 0.86)} ${Math.round(height * 0.66)}, ${Math.round(width * 1.02)} ${Math.round(height * 0.84)}, ${Math.round(width * 1.1)} ${Math.round(height * 0.7)} L ${Math.round(width * 1.1)} ${height} L ${Math.round(width * -0.05)} ${height} Z" fill="${palette.soft}" fill-opacity="0.16"/>
  <circle cx="${Math.round(width * 0.12)}" cy="${Math.round(height * 0.18)}" r="${Math.round(height * 0.08)}" fill="${palette.soft}" fill-opacity="0.2"/>
  <circle cx="${Math.round(width * 0.88)}" cy="${Math.round(height * 0.86)}" r="${Math.round(height * 0.12)}" fill="${palette.accent}" fill-opacity="0.2"/>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.17)}" fill="${palette.soft}" fill-opacity="0.95" font-family="Poppins, Inter, Arial, sans-serif" font-size="${Math.round(width * 0.021)}" font-weight="700" letter-spacing="1.4">
    PAVM CAMPUS MEDIA
  </text>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.52)}" fill="white" font-family="Poppins, Inter, Arial, sans-serif" font-size="${Math.round(width * 0.06)}" font-weight="800">
    ${firstLine}
    ${secondLine ? `<tspan x="${Math.round(width * 0.07)}" dy="${Math.round(height * 0.09)}">${secondLine}</tspan>` : ""}
  </text>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.78)}" fill="${palette.soft}" font-family="Poppins, Inter, Arial, sans-serif" font-size="${Math.round(width * 0.034)}" font-weight="600">
    ${campusLabel}
  </text>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.86)}" fill="${palette.soft}" fill-opacity="0.94" font-family="Poppins, Inter, Arial, sans-serif" font-size="${Math.round(width * 0.025)}" font-weight="500">
    Distinct university-wise placeholder visuals
  </text>
</svg>
`;
}

async function getUniversitySlugs() {
  const entries = await fs.readdir(MEDIA_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== "global")
    .sort((a, b) => a.localeCompare(b));
}

async function writeSvg(filePath, svgContent) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, svgContent, "utf8");
}

async function generateForUniversity(slug) {
  const title = toTitleFromSlug(slug);
  const palette = buildPalette(slug);
  const imageDir = path.join(MEDIA_ROOT, slug, "images");

  const heroSvg = buildSvg({
    slug,
    title,
    scene: "Hero Visual",
    width: 1920,
    height: 1080,
    palette,
    index: 0,
  });

  await writeSvg(path.join(imageDir, "00-cinematic-hero.svg"), heroSvg);

  for (let i = 0; i < CARD_SCENES.length; i += 1) {
    const svg = buildSvg({
      slug,
      title,
      scene: CARD_SCENES[i],
      width: 1600,
      height: 1000,
      palette,
      index: i + 1,
    });
    await writeSvg(path.join(imageDir, `00-cinematic-${i + 1}.svg`), svg);
  }
}

async function main() {
  const slugs = await getUniversitySlugs();
  for (const slug of slugs) {
    await generateForUniversity(slug);
  }
  console.log(`Generated cinematic placeholder media for ${slugs.length} universities.`);
}

main().catch((error) => {
  console.error("Failed to generate university placeholders:", error);
  process.exit(1);
});

