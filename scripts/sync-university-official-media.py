from __future__ import annotations

import hashlib
import html
import io
import json
import re
import sys
import warnings
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
from PIL import Image, ImageOps


PUBLIC_ROOT = Path.cwd() / "public"
MEDIA_ROOT = PUBLIC_ROOT / "universities-media"
SOURCES_MANIFEST = MEDIA_ROOT / "official-sources.json"

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
}

IMAGE_EXT_PATTERN = re.compile(r"\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\"')\s>]*)?$", re.I)
URL_PATTERN = re.compile(r"url\(([^)]+)\)")
INLINE_IMAGE_PATTERN = re.compile(
    r"""(?:
        https?://[^\s"'()<>]+|
        [A-Za-z0-9_./%?=&:-]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'()<>]+)?
    )""",
    re.I | re.X,
)

PAGE_KEYWORDS = [
    "gallery",
    "campus",
    "life",
    "student-life",
    "infrastructure",
    "facilities",
    "about",
    "tour",
    "overview",
    "university",
]
POSITIVE_KEYWORDS = [
    "campus",
    "gallery",
    "slider",
    "slide",
    "home-sliders",
    "hero",
    "infrastructure",
    "building",
    "overview",
    "portfolio",
    "academic-blocks",
    "academic-block",
    "life-at",
    "student-life",
    "campus-life",
    "hostel",
    "library",
    "auditorium",
    "sports",
    "facility",
    "facilities",
    "lab",
    "labs",
    "other-facilities",
    "about-us",
    "about-niu",
    "location",
    "virtualtour",
    "photo-gallery",
    "header-banner",
]
NEGATIVE_KEYWORDS = [
    "logo",
    "icon",
    "favicon",
    "fav",
    "faculty",
    "chairman",
    "chancellor",
    "vice-chancellor",
    "vc",
    "director",
    "dean",
    "registrar",
    "hod",
    "award",
    "news",
    "media-image",
    "form",
    "scholarship",
    "admission",
    "apply",
    "program",
    "course",
    "ugc",
    "aicte",
    "naac",
    "approval",
    "recognition",
    "department",
    "school-of",
    "schools",
    "student-speak",
    "podcast",
    "whatsapp",
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "youtube.com",
    "rockstars",
    "convocation",
    "placement",
    "brochure",
    "mba1",
    "call.png",
    "email.png",
    "search.png",
    "facebook.png",
    "instagram.png",
    "linkedin.png",
    "youtube.png",
    "whatsapp.png",
    "google-play-store",
    "app-store",
    "clipart",
    "maps-and-flags",
    "dropdown",
    "applyshield",
    "alwaysimp",
    "story1",
    "story2",
    "story3",
    "close.png",
    "error.png",
    "success.png",
    "process-line",
    "movie-promotion",
    "holi",
    "garbotsav",
    "womens-week",
    "abhivandan",
    "alumni",
    "convocation",
    "republicday",
    "kite-festival",
    "mootcourt",
    "mou",
    "signing",
    "award",
    "awards",
    "ranking",
    "education-world",
    "ibm",
    "ken-research",
    "buttons.jpg",
    "button",
    "niaa",
    "tech-mahindra",
    "dainik-bhaskar",
    "aacsb",
    "qci",
    "career-360",
    "competition",
    "podcast",
    "moscow",
    "polytechnic",
    "hindustan-express",
    "girl.png",
    "01.png",
    "02.png",
    "03.png",
    "04.png",
    "05.png",
]

OFFICIAL_SITES: dict[str, list[str]] = {
    "aarni-university": [
        "https://arniuniversity.edu.in/",
    ],
    "bharati-vidyapeeth-university": ["https://www.bvuniversity.edu.in/"],
    "coer-university": ["https://coeruniversity.ac.in/"],
    "dr-preeti-global-university": ["https://drpreetiglobaluniversity.com/"],
    "glocal-university": ["https://glocaluniversity.edu.in/"],
    "guru-nanak-university-hyderabad": ["https://www.gnuindia.org/index.php"],
    "maharishi-markandeshwar-university": [
        "https://www.mmumullana.org/",
        "https://www.mmumullana.org/overview/",
        "https://www.mmumullana.org/campus-life/",
        "https://www.mmumullana.org/photo-gallery/",
    ],
    "mangalayatan-university": ["https://www.mangalayatan.in/"],
    "marwadi-university": [
        "https://www.marwadiuniversity.ac.in/",
        "https://www.marwadiuniversity.ac.in/gallery/",
        "https://www.marwadiuniversity.ac.in/advanced-labs-research-facilities/",
        "https://www.marwadiuniversity.ac.in/other-facilities/",
    ],
    "niat": ["https://www.niatindia.com/"],
    "noida-international-university": [
        "https://niu.edu.in/",
        "https://niu.edu.in/about-niu/",
        "https://niu.edu.in/about-noida-international-university/",
        "https://niu.edu.in/files/virtualtour/",
        "https://niu.edu.in/files/virtualtour/indexdata/index.xml",
    ],
    "north-east-christian-university": ["https://necu.ac.in/"],
    "rayat-bahra-university": ["https://rbuchd.in/"],
    "sanskaram-university": ["https://sanskaramuniversity.ac.in/"],
    "shoolini-university": ["https://shooliniuniversity.com/"],
    "subharti-university": ["https://subharti.org/"],
    "suresh-gyan-vihar-university": ["https://sgvu.edu.in/"],
    "suryadatta-group-of-institutions": ["https://www.suryadatta.org/"],
    "uttaranchal-university": ["https://www.uudoon.in/"],
}


def same_origin(left: str, right: str) -> bool:
    return urlparse(left).netloc == urlparse(right).netloc


def is_image_url(url: str) -> bool:
    return "_next/image?url=" in url or bool(IMAGE_EXT_PATTERN.search(url))


def normalize_url(base_url: str, candidate: str) -> str | None:
    candidate = html.unescape(candidate).strip()
    candidate = candidate.strip("\"' ")
    candidate = candidate.replace("%FIRSTXML%/", "")
    if candidate.startswith("./") and ("http://" in candidate or "https://" in candidate):
        candidate = candidate[2:]
    candidate = re.sub(r"[\"')\\]+$", "", candidate)
    candidate = re.sub(r"[\"']?;+$", "", candidate)
    candidate = candidate.strip()
    if not candidate or candidate.startswith("data:"):
        return None
    if "%v" in candidate or "%u" in candidate:
        return None
    if candidate in {"schema.org/WebPage", "schema.org"}:
        return None
    try:
        full = urljoin(base_url, candidate)
    except ValueError:
        return None
    parsed = urlparse(full)
    if parsed.scheme not in {"http", "https"}:
        return None
    return full


def extract_images_from_html(base_url: str, html: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    images: set[str] = set()

    selectors = [
        "img",
        "source",
        "meta[property='og:image']",
        "meta[name='twitter:image']",
    ]
    for tag in soup.select(",".join(selectors)):
        raw = (
            tag.get("src")
            or tag.get("data-src")
            or tag.get("data-lazy-src")
            or tag.get("data-background")
            or tag.get("srcset")
            or tag.get("content")
        )
        if not raw:
            continue
        first = raw.split(",")[0].strip().split(" ")[0]
        full = normalize_url(base_url, first)
        if full and is_image_url(full):
            images.add(full)

    for tag in soup.select("[style]"):
        style = tag.get("style", "")
        for match in URL_PATTERN.findall(style):
            full = normalize_url(base_url, match)
            if full and is_image_url(full):
                images.add(full)

    for match in INLINE_IMAGE_PATTERN.findall(html):
        full = normalize_url(base_url, match)
        if full and is_image_url(full):
            images.add(full)

    return images


def extract_follow_links(base_url: str, html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    found: set[str] = set()
    for tag in soup.select("a[href]"):
        href = tag.get("href", "")
        text = " ".join(tag.stripped_strings).lower()
        target = normalize_url(base_url, href)
        if not target or not same_origin(base_url, target):
            continue
        target_lower = target.lower()
        if any(keyword in target_lower or keyword in text for keyword in PAGE_KEYWORDS):
            found.add(target)
    return sorted(found)[:10]


def extract_asset_files(base_url: str, html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    assets: set[str] = set()
    for tag in soup.select("script[src],link[href]"):
        raw = tag.get("src") or tag.get("href")
        if not raw:
            continue
        full = normalize_url(base_url, raw)
        if not full or not same_origin(base_url, full):
            continue
        lower = full.lower()
        if lower.endswith(".js") or lower.endswith(".css"):
            assets.add(full)
    prioritized = sorted(
        assets,
        key=lambda asset: (
            0 if re.search(r"/(?:main|runtime|polyfills|vendor|scripts)\.js$|/(?:main|runtime|polyfills|vendor|scripts)\.[a-z0-9.-]+\.js$", asset.lower()) else 1,
            0 if asset.lower().endswith(".js") else 1,
            asset,
        ),
    )
    return prioritized[:24]


def download_text(session: requests.Session, url: str) -> str:
    response = session.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def collect_candidates(session: requests.Session, seed_url: str) -> dict[str, set[str]]:
    sources: dict[str, set[str]] = defaultdict(set)
    html = download_text(session, seed_url)
    for image_url in extract_images_from_html(seed_url, html):
        sources[image_url].add(seed_url)

    extra_pages = extract_follow_links(seed_url, html)
    for page_url in extra_pages:
        try:
            page_html = download_text(session, page_url)
        except Exception:
            continue
        for image_url in extract_images_from_html(page_url, page_html):
            sources[image_url].add(page_url)

    for asset_url in extract_asset_files(seed_url, html):
        try:
            asset_text = download_text(session, asset_url)
        except Exception:
            continue
        for image_url in extract_images_from_html(asset_url, asset_text):
            sources[image_url].add(asset_url)

    return sources


def score_candidate(image_url: str, source_urls: set[str]) -> int:
    value = image_url.lower()
    score = 0
    source_text = " ".join(sorted(source_urls)).lower()
    if any(keyword in source_text for keyword in PAGE_KEYWORDS):
        score += 5
    for keyword in POSITIVE_KEYWORDS:
        if keyword in value:
            score += 4
        if keyword in source_text:
            score += 2
    for keyword in NEGATIVE_KEYWORDS:
        if keyword in value:
            score -= 6
        if keyword in source_text:
            score -= 3
    if any(token in value for token in ["wp-content/uploads/", "assets/img/", "uploads/"]):
        score += 2
    if "_next/image" in value:
        score += 1
    return score


def resize_for_web(image: Image.Image, max_width: int = 1920, max_height: int = 1200) -> Image.Image:
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return image


def clean_existing_media(image_dir: Path) -> None:
    removable_patterns = [
        "00-cinematic-hero.jpg",
        "00-cinematic-1.jpg",
        "00-cinematic-2.jpg",
        "00-cinematic-3.jpg",
        "00-cinematic-4.jpg",
        "00-cinematic-5.jpg",
        "00-cinematic-6.jpg",
        "00-cinematic-hero.svg",
        "00-cinematic-1.svg",
        "00-cinematic-2.svg",
        "00-cinematic-3.svg",
        "00-cinematic-4.svg",
        "00-cinematic-5.svg",
        "00-cinematic-6.svg",
        "00-official-hero.jpg",
        "01-official-1.jpg",
        "02-official-2.jpg",
        "03-official-3.jpg",
        "04-official-4.jpg",
        "05-official-5.jpg",
        "06-official-6.jpg",
    ]
    for pattern in removable_patterns:
        target = image_dir / pattern
        if target.exists():
            target.unlink()
    for old_auto in image_dir.glob("auto-*.svg"):
        old_auto.unlink()


def sync_university(slug: str, seed_urls: list[str], session: requests.Session) -> list[dict[str, object]]:
    image_dir = MEDIA_ROOT / slug / "images"
    image_dir.mkdir(parents=True, exist_ok=True)

    all_sources: dict[str, set[str]] = defaultdict(set)
    for seed_url in seed_urls:
        try:
            candidates = collect_candidates(session, seed_url)
        except Exception:
            continue
        for image_url, source_urls in candidates.items():
            all_sources[image_url].update(source_urls)

    ranked = sorted(
        all_sources.items(),
        key=lambda item: score_candidate(item[0], item[1]),
        reverse=True,
    )

    picked: list[dict[str, object]] = []
    seen_hashes: set[str] = set()
    name_templates = [
        "00-official-hero.jpg",
        "01-official-1.jpg",
        "02-official-2.jpg",
        "03-official-3.jpg",
        "04-official-4.jpg",
        "05-official-5.jpg",
        "06-official-6.jpg",
    ]

    for image_url, source_urls in ranked:
        if len(picked) >= len(name_templates):
            break

        try:
            response = session.get(
                image_url,
                headers={**HEADERS, "Referer": sorted(source_urls)[0]},
                timeout=40,
            )
            if response.status_code != 200:
                continue
            if "image" not in (response.headers.get("content-type") or ""):
                continue
            image = Image.open(io.BytesIO(response.content))
        except Exception:
            continue

        width, height = image.size
        is_panorama_preview = image_url.lower().endswith("/preview.jpg")
        if width < 700 or (height < 350 and not (is_panorama_preview and width >= 1400 and height >= 240)):
            continue
        if width / max(height, 1) < 1.1:
            continue

        resized = resize_for_web(image)
        image_hash = hashlib.sha256(resized.tobytes()).hexdigest()
        if image_hash in seen_hashes:
            continue
        seen_hashes.add(image_hash)

        picked.append(
            {
                "source_page": sorted(source_urls)[0],
                "image_url": image_url,
                "width": width,
                "height": height,
                "image": resized,
            }
        )

    if not picked:
        return []

    clean_existing_media(image_dir)
    manifest_entries: list[dict[str, object]] = []
    for index, entry in enumerate(picked):
        filename = name_templates[index]
        output_path = image_dir / filename
        entry["image"].save(output_path, format="JPEG", quality=90, optimize=True, progressive=True)
        manifest_entries.append(
            {
                "file": str(output_path.relative_to(PUBLIC_ROOT)).replace("\\", "/"),
                "source_page": entry["source_page"],
                "image_url": entry["image_url"],
                "width": entry["width"],
                "height": entry["height"],
            }
        )

    return manifest_entries


def main() -> None:
    session = requests.Session()
    if SOURCES_MANIFEST.exists():
      manifest: dict[str, list[dict[str, object]]] = json.loads(SOURCES_MANIFEST.read_text(encoding="utf-8"))
    else:
      manifest = {}

    requested_slugs = sys.argv[1:] or list(OFFICIAL_SITES.keys())
    for slug in requested_slugs:
        seed_urls = OFFICIAL_SITES.get(slug)
        if not seed_urls:
            print(f"Unknown university slug: {slug}")
            continue
        entries = sync_university(slug, seed_urls, session)
        if entries:
            manifest[slug] = entries
            print(f"Downloaded {len(entries)} official images for {slug}")
        else:
            print(f"No official images captured for {slug}")
        SOURCES_MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    SOURCES_MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote source manifest to {SOURCES_MANIFEST}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        raise SystemExit(130)
