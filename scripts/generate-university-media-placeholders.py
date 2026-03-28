from __future__ import annotations

import colorsys
import hashlib
import random
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageOps
except ImportError as exc:
    print("Pillow is required to generate university media.", file=sys.stderr)
    print("Install it with: pip install pillow", file=sys.stderr)
    raise SystemExit(1) from exc


PUBLIC_ROOT = Path.cwd() / "public"
MEDIA_ROOT = PUBLIC_ROOT / "universities-media"
LOGO_ROOT = PUBLIC_ROOT / "logos" / "universities"

SCENES = [
    {"key": "hero", "filename": "00-cinematic-hero.jpg", "size": (1920, 1080)},
    {"key": "campus-life", "filename": "00-cinematic-1.jpg", "size": (1600, 1000)},
    {"key": "academic-block", "filename": "00-cinematic-2.jpg", "size": (1600, 1000)},
    {"key": "library-learning", "filename": "00-cinematic-3.jpg", "size": (1600, 1000)},
    {"key": "labs-innovation", "filename": "00-cinematic-4.jpg", "size": (1600, 1000)},
    {"key": "student-collaboration", "filename": "00-cinematic-5.jpg", "size": (1600, 1000)},
    {"key": "events-culture", "filename": "00-cinematic-6.jpg", "size": (1600, 1000)},
]

OLD_GENERATED_FILES = {
    "00-cinematic-hero.svg",
    "00-cinematic-1.svg",
    "00-cinematic-2.svg",
    "00-cinematic-3.svg",
    "00-cinematic-4.svg",
    "00-cinematic-5.svg",
    "00-cinematic-6.svg",
}


def hash_int(value: str) -> int:
    return int(hashlib.sha256(value.encode("utf-8")).hexdigest()[:16], 16)


def slug_to_title(slug: str) -> str:
    custom = {"niat": "NIAT"}
    if slug in custom:
        return custom[slug]
    return " ".join(part.capitalize() for part in slug.split("-"))


def hsl_color(hue: float, saturation: float, lightness: float) -> tuple[int, int, int]:
    red, green, blue = colorsys.hls_to_rgb(hue % 1.0, max(0.0, min(lightness, 1.0)), max(0.0, min(saturation, 1.0)))
    return (int(red * 255), int(green * 255), int(blue * 255))


def tint(color: tuple[int, int, int], amount: float, toward_white: bool = True) -> tuple[int, int, int]:
    target = 255 if toward_white else 0
    return tuple(int(channel + (target - channel) * amount) for channel in color)


def blend(left: tuple[int, int, int], right: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return tuple(int(left[i] + (right[i] - left[i]) * amount) for i in range(3))


def build_palette(slug: str, scene_key: str) -> dict[str, tuple[int, int, int]]:
    seed = hash_int(f"{slug}:{scene_key}")
    theme = seed % 4

    if theme == 0:
        sky_top = hsl_color(0.61, 0.38, 0.18)
        sky_bottom = hsl_color(0.10, 0.70, 0.86)
        stone = hsl_color(0.10, 0.16, 0.76)
        glass = hsl_color(0.56, 0.35, 0.60)
        lawn = hsl_color(0.30, 0.42, 0.42)
        accent = hsl_color(0.03, 0.76, 0.62)
    elif theme == 1:
        sky_top = hsl_color(0.59, 0.30, 0.22)
        sky_bottom = hsl_color(0.56, 0.52, 0.83)
        stone = hsl_color(0.12, 0.12, 0.80)
        glass = hsl_color(0.57, 0.28, 0.62)
        lawn = hsl_color(0.32, 0.38, 0.44)
        accent = hsl_color(0.12, 0.76, 0.63)
    elif theme == 2:
        sky_top = hsl_color(0.64, 0.38, 0.20)
        sky_bottom = hsl_color(0.07, 0.62, 0.77)
        stone = hsl_color(0.11, 0.14, 0.74)
        glass = hsl_color(0.57, 0.33, 0.58)
        lawn = hsl_color(0.31, 0.36, 0.41)
        accent = hsl_color(0.95, 0.70, 0.58)
    else:
        sky_top = hsl_color(0.60, 0.28, 0.26)
        sky_bottom = hsl_color(0.14, 0.42, 0.87)
        stone = hsl_color(0.08, 0.10, 0.81)
        glass = hsl_color(0.56, 0.24, 0.66)
        lawn = hsl_color(0.33, 0.30, 0.45)
        accent = hsl_color(0.07, 0.72, 0.60)

    return {
        "sky_top": sky_top,
        "sky_bottom": sky_bottom,
        "stone": stone,
        "stone_dark": tint(stone, 0.28, toward_white=False),
        "glass": glass,
        "glass_bright": tint(glass, 0.25),
        "lawn": lawn,
        "lawn_dark": tint(lawn, 0.28, toward_white=False),
        "accent": accent,
        "warm_light": tint(accent, 0.35),
        "shadow": (22, 28, 40),
        "path": blend(stone, sky_bottom, 0.35),
        "wood": hsl_color(0.08, 0.38, 0.42),
        "interior_wall": hsl_color(0.10, 0.18, 0.88),
        "interior_floor": hsl_color(0.09, 0.20, 0.44),
        "foliage": hsl_color(0.31, 0.40, 0.34),
    }


def base_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    top_layer = Image.new("RGB", size, top)
    bottom_layer = Image.new("RGB", size, bottom)
    mask = Image.linear_gradient("L").rotate(90, expand=True).resize(size)
    return Image.composite(bottom_layer, top_layer, mask).convert("RGBA")


def add_sun_glow(canvas: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius), fill=color + (alpha,))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius // 2)))


def add_soft_clouds(canvas: Image.Image, rng: random.Random, width: int, height: int) -> None:
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    count = 6 + rng.randint(0, 3)
    for _ in range(count):
        center_x = rng.randint(int(width * 0.05), int(width * 0.95))
        center_y = rng.randint(int(height * 0.04), int(height * 0.32))
        radius_x = rng.randint(int(width * 0.08), int(width * 0.18))
        radius_y = rng.randint(int(height * 0.03), int(height * 0.07))
        draw.ellipse(
            (center_x - radius_x, center_y - radius_y, center_x + radius_x, center_y + radius_y),
            fill=(255, 255, 255, rng.randint(18, 46)),
        )
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(int(width * 0.025))))


def draw_window_grid(draw: ImageDraw.ImageDraw, bounds: tuple[int, int, int, int], rows: int, cols: int, bright: tuple[int, int, int]) -> None:
    left, top, right, bottom = bounds
    width = right - left
    height = bottom - top
    gap_x = width / (cols + 1)
    gap_y = height / (rows + 1)
    cell_w = max(8, int(gap_x * 0.34))
    cell_h = max(8, int(gap_y * 0.22))
    for row in range(rows):
        for col in range(cols):
            x0 = int(left + gap_x * (col + 1) - cell_w / 2)
            y0 = int(top + gap_y * (row + 1) - cell_h / 2)
            draw.rounded_rectangle((x0, y0, x0 + cell_w, y0 + cell_h), radius=max(2, cell_h // 3), fill=bright + (135,))


def paste_logo_sign(canvas: Image.Image, logo: Image.Image | None, box: tuple[int, int, int, int]) -> None:
    if logo is None:
        return

    left, top, right, bottom = box
    sign_w = right - left
    sign_h = bottom - top
    if sign_w <= 0 or sign_h <= 0:
        return

    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    shadow_box = (left + 6, top + 8, right + 6, bottom + 8)
    draw.rounded_rectangle(shadow_box, radius=max(12, sign_h // 5), fill=(0, 0, 0, 42))
    draw.rounded_rectangle(box, radius=max(12, sign_h // 5), fill=(250, 252, 255, 240), outline=(226, 232, 240, 210), width=2)
    canvas.alpha_composite(layer)

    inset = int(min(sign_w, sign_h) * 0.14)
    logo_box = (sign_w - inset * 2, sign_h - inset * 2)
    resized = ImageOps.contain(logo, logo_box, method=Image.Resampling.LANCZOS)
    paste_x = left + (sign_w - resized.width) // 2
    paste_y = top + (sign_h - resized.height) // 2
    canvas.alpha_composite(resized, (paste_x, paste_y))


def add_grain(canvas: Image.Image) -> Image.Image:
    noise = Image.effect_noise(canvas.size, 8).convert("L")
    noise = ImageOps.autocontrast(noise)
    noise_layer = ImageOps.colorize(noise, (118, 122, 128), (168, 170, 176)).convert("RGBA")
    return Image.blend(canvas, noise_layer, 0.065)


def add_vignette(canvas: Image.Image) -> Image.Image:
    width, height = canvas.size
    vignette = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(vignette)
    margin_x = int(width * 0.07)
    margin_y = int(height * 0.08)
    draw.ellipse((margin_x, margin_y, width - margin_x, height - margin_y), fill=220)
    vignette = vignette.filter(ImageFilter.GaussianBlur(int(min(width, height) * 0.14)))
    dark = Image.new("RGBA", (width, height), (8, 12, 18, 88))
    return Image.composite(canvas, Image.alpha_composite(canvas, dark), vignette)


def load_logo(slug: str) -> Image.Image | None:
    candidates = [
        LOGO_ROOT / f"{slug}.png",
        LOGO_ROOT / f"{slug}.webp",
        LOGO_ROOT / f"{slug}.jpeg",
        LOGO_ROOT / f"{slug}.jpg",
    ]
    for candidate in candidates:
        if candidate.exists():
            return Image.open(candidate).convert("RGBA")
    return None


def draw_tree(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, palette: dict[str, tuple[int, int, int]]) -> None:
    trunk_w = int(10 * scale)
    trunk_h = int(58 * scale)
    canopy_r = int(38 * scale)
    draw.rounded_rectangle((x - trunk_w // 2, y - trunk_h, x + trunk_w // 2, y), radius=trunk_w // 2, fill=palette["wood"] + (220,))
    draw.ellipse((x - canopy_r, y - trunk_h - canopy_r, x + canopy_r, y - trunk_h + canopy_r * 0.35), fill=palette["foliage"] + (220,))
    draw.ellipse((x - canopy_r * 1.2, y - trunk_h - canopy_r * 0.5, x + canopy_r * 0.1, y - trunk_h + canopy_r * 0.55), fill=tint(palette["foliage"], 0.06) + (190,))


def draw_student_group(draw: ImageDraw.ImageDraw, x: int, y: int, count: int, scale: float, palette: dict[str, tuple[int, int, int]], rng: random.Random) -> None:
    for index in range(count):
        offset = int(index * 20 * scale)
        body_h = int(rng.randint(24, 34) * scale)
        body_w = int(rng.randint(12, 18) * scale)
        head_r = int(6 * scale)
        px = x + offset + rng.randint(-5, 5)
        py = y + rng.randint(-6, 6)
        clothing = palette["accent"] if index % 2 == 0 else palette["glass_bright"]
        draw.ellipse((px - head_r, py - body_h - head_r * 2, px + head_r, py - body_h), fill=(235, 214, 198, 255))
        draw.rounded_rectangle((px - body_w // 2, py - body_h, px + body_w // 2, py), radius=max(3, body_w // 3), fill=clothing + (235,))
        draw.rounded_rectangle((px - body_w // 3, py, px - 1, py + body_h // 2), radius=2, fill=palette["shadow"] + (210,))
        draw.rounded_rectangle((px + 1, py, px + body_w // 3, py + body_h // 2), radius=2, fill=palette["shadow"] + (210,))


def draw_exterior_scene(slug: str, size: tuple[int, int], scene_key: str, logo: Image.Image | None) -> Image.Image:
    width, height = size
    rng = random.Random(hash_int(f"{slug}:{scene_key}:scene"))
    palette = build_palette(slug, scene_key)
    canvas = base_gradient(size, palette["sky_top"], palette["sky_bottom"])

    add_sun_glow(canvas, (int(width * (0.24 + rng.random() * 0.25)), int(height * 0.22)), int(width * 0.16), palette["warm_light"], 120)
    add_soft_clouds(canvas, rng, width, height)

    distant = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(distant)
    horizon_y = int(height * 0.52)
    for index in range(10):
        block_w = int(width * (0.06 + rng.random() * 0.06))
        block_h = int(height * (0.08 + rng.random() * 0.14))
        x = int(index * width / 9 + rng.randint(-40, 40))
        draw.rounded_rectangle(
            (x, horizon_y - block_h, x + block_w, horizon_y + 10),
            radius=14,
            fill=blend(palette["stone_dark"], palette["sky_top"], 0.45) + (120,),
        )
    canvas.alpha_composite(distant.filter(ImageFilter.GaussianBlur(10)))

    ground = Image.new("RGBA", size, (0, 0, 0, 0))
    ground_draw = ImageDraw.Draw(ground)
    ground_draw.polygon(
        [(0, int(height * 0.68)), (width, int(height * 0.60)), (width, height), (0, height)],
        fill=palette["lawn"] + (255,),
    )
    path_color = tint(palette["path"], 0.10)
    ground_draw.polygon(
        [
            (int(width * 0.37), height),
            (int(width * 0.63), height),
            (int(width * 0.55), int(height * 0.62)),
            (int(width * 0.45), int(height * 0.62)),
        ],
        fill=path_color + (220,),
    )
    canvas.alpha_composite(ground.filter(ImageFilter.GaussianBlur(1)))

    buildings = Image.new("RGBA", size, (0, 0, 0, 0))
    building_draw = ImageDraw.Draw(buildings)
    main_left = int(width * (0.18 if scene_key == "hero" else 0.15))
    main_right = int(width * (0.82 if scene_key == "hero" else 0.86))
    main_top = int(height * 0.26)
    main_bottom = int(height * 0.63)
    wing_gap = int(width * 0.03)
    left_wing = (main_left, main_top + int(height * 0.08), int(width * 0.36), main_bottom)
    center_block = (int(width * 0.31), main_top, int(width * 0.69), main_bottom)
    right_wing = (int(width * 0.64), main_top + int(height * 0.06), main_right, main_bottom)

    for bounds in (left_wing, center_block, right_wing):
        building_draw.rounded_rectangle(bounds, radius=22, fill=palette["stone"] + (242,), outline=tint(palette["stone"], 0.14) + (255,), width=3)
        draw_window_grid(building_draw, (bounds[0] + 22, bounds[1] + 26, bounds[2] - 22, bounds[3] - 32), 5, 6, palette["glass_bright"])

    building_draw.rectangle((center_block[0], center_block[1], center_block[2], center_block[1] + 28), fill=tint(palette["stone"], 0.08) + (255,))
    building_draw.rectangle((left_wing[0], left_wing[1], left_wing[2], left_wing[1] + 20), fill=tint(palette["stone"], 0.08) + (255,))
    building_draw.rectangle((right_wing[0], right_wing[1], right_wing[2], right_wing[1] + 20), fill=tint(palette["stone"], 0.08) + (255,))
    building_draw.rounded_rectangle((int(width * 0.45), int(height * 0.47), int(width * 0.55), int(height * 0.63)), radius=18, fill=palette["glass"] + (210,))

    canvas.alpha_composite(buildings)

    landscape = Image.new("RGBA", size, (0, 0, 0, 0))
    landscape_draw = ImageDraw.Draw(landscape)
    for fraction in (0.10, 0.22, 0.80, 0.90):
        draw_tree(landscape_draw, int(width * fraction), int(height * 0.72), 1.0 + rng.random() * 0.2, palette)

    landscape_draw.rounded_rectangle((int(width * 0.18), int(height * 0.67), int(width * 0.27), int(height * 0.695)), radius=12, fill=tint(palette["wood"], 0.08) + (210,))
    landscape_draw.rounded_rectangle((int(width * 0.72), int(height * 0.67), int(width * 0.81), int(height * 0.695)), radius=12, fill=tint(palette["wood"], 0.08) + (210,))
    draw_student_group(landscape_draw, int(width * 0.42), int(height * 0.77), 4, 1.1, palette, rng)
    draw_student_group(landscape_draw, int(width * 0.58), int(height * 0.79), 3, 0.95, palette, rng)
    canvas.alpha_composite(landscape.filter(ImageFilter.GaussianBlur(0.6)))

    paste_logo_sign(canvas, logo, (int(width * 0.46), int(height * 0.36), int(width * 0.54), int(height * 0.47)))
    return add_vignette(add_grain(canvas))


def draw_library_scene(slug: str, size: tuple[int, int], logo: Image.Image | None) -> Image.Image:
    width, height = size
    palette = build_palette(slug, "library-learning")
    rng = random.Random(hash_int(f"{slug}:library"))
    canvas = base_gradient(size, tint(palette["sky_top"], 0.12), palette["interior_wall"])

    add_sun_glow(canvas, (int(width * 0.15), int(height * 0.24)), int(width * 0.18), palette["warm_light"], 135)

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rectangle((0, int(height * 0.72), width, height), fill=palette["interior_floor"] + (255,))
    draw.rectangle((int(width * 0.06), int(height * 0.16), int(width * 0.28), int(height * 0.72)), fill=tint(palette["interior_wall"], 0.04) + (255,))
    draw.rectangle((int(width * 0.04), int(height * 0.10), int(width * 0.34), int(height * 0.72)), outline=tint(palette["glass_bright"], 0.30) + (220,), width=10)

    for shelf_x in (0.40, 0.60, 0.78):
        left = int(width * shelf_x)
        right = left + int(width * 0.14)
        draw.rounded_rectangle((left, int(height * 0.18), right, int(height * 0.72)), radius=18, fill=tint(palette["wood"], 0.06) + (245,))
        for row in range(4):
            y = int(height * (0.24 + row * 0.12))
            draw.rectangle((left + 18, y, right - 18, y + 10), fill=tint(palette["wood"], 0.15) + (255,))
            for column in range(7):
                book_left = left + 24 + column * int((right - left - 54) / 7)
                book_w = int(width * 0.010) + rng.randint(0, 4)
                book_h = int(height * 0.08) + rng.randint(-8, 12)
                color = palette["accent"] if (row + column) % 3 == 0 else palette["glass_bright"] if (row + column) % 3 == 1 else tint(palette["wood"], 0.25)
                draw.rounded_rectangle((book_left, y - book_h + 8, book_left + book_w, y + 2), radius=4, fill=color + (235,))

    table_top = (int(width * 0.34), int(height * 0.62), int(width * 0.64), int(height * 0.68))
    draw.rounded_rectangle(table_top, radius=22, fill=tint(palette["wood"], 0.10) + (245,))
    draw.rounded_rectangle((int(width * 0.39), int(height * 0.68), int(width * 0.42), int(height * 0.86)), radius=10, fill=tint(palette["wood"], 0.14) + (255,))
    draw.rounded_rectangle((int(width * 0.56), int(height * 0.68), int(width * 0.59), int(height * 0.86)), radius=10, fill=tint(palette["wood"], 0.14) + (255,))

    for chair_x in (0.30, 0.67):
        left = int(width * chair_x)
        draw.rounded_rectangle((left, int(height * 0.66), left + int(width * 0.08), int(height * 0.75)), radius=18, fill=palette["glass"] + (220,))
        draw.rounded_rectangle((left + int(width * 0.015), int(height * 0.58), left + int(width * 0.065), int(height * 0.67)), radius=14, fill=palette["glass_bright"] + (220,))

    draw_student_group(draw, int(width * 0.42), int(height * 0.73), 2, 1.0, palette, rng)
    paste_logo_sign(layer, logo, (int(width * 0.09), int(height * 0.14), int(width * 0.18), int(height * 0.24)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.4)))
    return add_vignette(add_grain(canvas))


def draw_lab_scene(slug: str, size: tuple[int, int], logo: Image.Image | None) -> Image.Image:
    width, height = size
    palette = build_palette(slug, "labs-innovation")
    rng = random.Random(hash_int(f"{slug}:lab"))
    canvas = base_gradient(size, tint(palette["sky_top"], 0.10), tint(palette["glass"], 0.32))
    add_sun_glow(canvas, (int(width * 0.76), int(height * 0.20)), int(width * 0.14), palette["warm_light"], 100)

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rectangle((0, int(height * 0.70), width, height), fill=blend(palette["interior_floor"], palette["glass"], 0.18) + (255,))
    draw.rounded_rectangle((int(width * 0.06), int(height * 0.16), int(width * 0.94), int(height * 0.52)), radius=24, fill=(248, 252, 255, 94), outline=tint(palette["glass_bright"], 0.18) + (190,), width=3)

    for monitor_x in (0.14, 0.34, 0.76):
        left = int(width * monitor_x)
        draw.rounded_rectangle((left, int(height * 0.26), left + int(width * 0.12), int(height * 0.42)), radius=14, fill=palette["shadow"] + (215,))
        draw.rounded_rectangle((left + 10, int(height * 0.28), left + int(width * 0.12) - 10, int(height * 0.42) - 10), radius=10, fill=palette["glass_bright"] + (215,))
        draw.rectangle((left + int(width * 0.05), int(height * 0.42), left + int(width * 0.07), int(height * 0.48)), fill=tint(palette["shadow"], 0.24) + (255,))

    counter = (int(width * 0.10), int(height * 0.56), int(width * 0.90), int(height * 0.73))
    draw.rounded_rectangle(counter, radius=28, fill=tint(palette["stone"], 0.06) + (245,))
    draw.rectangle((counter[0], counter[1], counter[2], counter[1] + 16), fill=tint(palette["stone"], 0.16) + (255,))

    for beaker_x in (0.18, 0.26, 0.60, 0.69, 0.78):
        left = int(width * beaker_x)
        glass_color = palette["glass_bright"] if beaker_x < 0.40 else palette["accent"]
        draw.rounded_rectangle((left, int(height * 0.44), left + int(width * 0.035), int(height * 0.58)), radius=10, outline=(230, 247, 255, 255), width=3, fill=glass_color + (120,))
        draw.rectangle((left + 6, int(height * 0.52), left + int(width * 0.035) - 6, int(height * 0.58)), fill=glass_color + (160,))
        draw.ellipse((left - 8, int(height * 0.41), left + int(width * 0.035) + 8, int(height * 0.47)), outline=(230, 247, 255, 190), width=3)

    for point in ((0.52, 0.32), (0.58, 0.28), (0.64, 0.35), (0.70, 0.30)):
        x = int(width * point[0])
        y = int(height * point[1])
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=palette["accent"] + (210,))
    draw.line((int(width * 0.52), int(height * 0.32), int(width * 0.58), int(height * 0.28), int(width * 0.64), int(height * 0.35), int(width * 0.70), int(height * 0.30)), fill=palette["glass_bright"] + (210,), width=4)
    paste_logo_sign(layer, logo, (int(width * 0.80), int(height * 0.12), int(width * 0.90), int(height * 0.24)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.5)))
    return add_vignette(add_grain(canvas))


def draw_collaboration_scene(slug: str, size: tuple[int, int], logo: Image.Image | None) -> Image.Image:
    width, height = size
    palette = build_palette(slug, "student-collaboration")
    rng = random.Random(hash_int(f"{slug}:collab"))
    canvas = base_gradient(size, tint(palette["sky_top"], 0.08), tint(palette["glass"], 0.28))

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rectangle((0, int(height * 0.72), width, height), fill=blend(palette["interior_floor"], palette["glass"], 0.22) + (255,))
    draw.rounded_rectangle((int(width * 0.05), int(height * 0.12), int(width * 0.95), int(height * 0.58)), radius=24, fill=(248, 252, 255, 92), outline=tint(palette["glass_bright"], 0.16) + (180,), width=3)

    sofa_color = blend(palette["stone"], palette["glass_bright"], 0.46)
    for sofa_left in (0.12, 0.60):
        left = int(width * sofa_left)
        draw.rounded_rectangle((left, int(height * 0.58), left + int(width * 0.22), int(height * 0.73)), radius=26, fill=sofa_color + (240,))
        draw.rounded_rectangle((left + 18, int(height * 0.52), left + int(width * 0.22) - 18, int(height * 0.62)), radius=20, fill=tint(sofa_color, 0.10) + (255,))

    table = (int(width * 0.41), int(height * 0.60), int(width * 0.59), int(height * 0.69))
    draw.rounded_rectangle(table, radius=20, fill=tint(palette["wood"], 0.10) + (245,))
    for laptop_x in (table[0] + 30, table[0] + 92):
        draw.rounded_rectangle((laptop_x, table[1] - 18, laptop_x + 42, table[1] + 2), radius=6, fill=palette["shadow"] + (235,))
        draw.rounded_rectangle((laptop_x + 4, table[1] - 14, laptop_x + 38, table[1] - 2), radius=4, fill=palette["glass_bright"] + (215,))
    for plant_x in (0.09, 0.88):
        base_x = int(width * plant_x)
        draw.rounded_rectangle((base_x, int(height * 0.58), base_x + int(width * 0.04), int(height * 0.72)), radius=12, fill=tint(palette["stone"], 0.12) + (230,))
        for leaf in range(5):
            cx = base_x + int(width * 0.02) + rng.randint(-8, 8)
            cy = int(height * 0.58) - leaf * 22
            draw.ellipse((cx - 16, cy - 22, cx + 16, cy + 6), fill=tint(palette["foliage"], leaf * 0.03) + (220,))

    draw_student_group(draw, int(width * 0.33), int(height * 0.67), 2, 1.1, palette, rng)
    draw_student_group(draw, int(width * 0.49), int(height * 0.67), 2, 1.1, palette, rng)
    draw_student_group(draw, int(width * 0.67), int(height * 0.67), 2, 1.1, palette, rng)
    paste_logo_sign(layer, logo, (int(width * 0.80), int(height * 0.14), int(width * 0.90), int(height * 0.25)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.4)))
    return add_vignette(add_grain(canvas))


def draw_events_scene(slug: str, size: tuple[int, int], logo: Image.Image | None) -> Image.Image:
    width, height = size
    palette = build_palette(slug, "events-culture")
    canvas = base_gradient(size, tint(palette["sky_top"], 0.05), tint(palette["accent"], 0.16))
    add_sun_glow(canvas, (int(width * 0.50), int(height * 0.16)), int(width * 0.18), palette["warm_light"], 128)

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.polygon([(0, height), (width, height), (width, int(height * 0.70)), (0, int(height * 0.62))], fill=tint(palette["shadow"], 0.18) + (255,))
    stage = (int(width * 0.20), int(height * 0.38), int(width * 0.80), int(height * 0.68))
    draw.rounded_rectangle(stage, radius=28, fill=tint(palette["stone_dark"], 0.12) + (248,))
    draw.rectangle((stage[0], stage[1], stage[2], stage[1] + 14), fill=tint(palette["stone"], 0.22) + (255,))
    draw.rounded_rectangle((int(width * 0.28), int(height * 0.44), int(width * 0.72), int(height * 0.60)), radius=22, fill=palette["glass"] + (200,))

    for x in (0.28, 0.50, 0.72):
        left = int(width * x)
        draw.rounded_rectangle((left - 8, int(height * 0.24), left + 8, int(height * 0.68)), radius=8, fill=tint(palette["shadow"], 0.10) + (255,))
        draw.line((left, int(height * 0.24), left - int(width * 0.08), int(height * 0.48)), fill=palette["warm_light"] + (140,), width=12)
        draw.line((left, int(height * 0.24), left + int(width * 0.08), int(height * 0.48)), fill=palette["warm_light"] + (140,), width=12)

    crowd_y = int(height * 0.76)
    for index in range(18):
        x = int(width * (0.08 + index * 0.048))
        radius = 11 + (index % 3)
        draw.ellipse((x - radius, crowd_y - radius * 2, x + radius, crowd_y), fill=(36, 40, 52, 255))
        draw.rounded_rectangle((x - radius + 3, crowd_y - radius, x + radius - 3, crowd_y + radius + 10), radius=6, fill=(28, 31, 40, 255))

    paste_logo_sign(layer, logo, (int(width * 0.44), int(height * 0.46), int(width * 0.56), int(height * 0.58)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.5)))
    return add_vignette(add_grain(canvas))


def draw_scene(slug: str, scene_key: str, size: tuple[int, int], logo: Image.Image | None) -> Image.Image:
    if scene_key in {"hero", "campus-life", "academic-block"}:
        return draw_exterior_scene(slug, size, scene_key, logo)
    if scene_key == "library-learning":
        return draw_library_scene(slug, size, logo)
    if scene_key == "labs-innovation":
        return draw_lab_scene(slug, size, logo)
    if scene_key == "student-collaboration":
        return draw_collaboration_scene(slug, size, logo)
    return draw_events_scene(slug, size, logo)


def get_university_slugs() -> list[str]:
    media_slugs = [path.name for path in MEDIA_ROOT.iterdir() if path.is_dir() and path.name != "global"]
    logo_slugs = [path.stem for path in LOGO_ROOT.iterdir() if path.is_file()]
    return sorted(set(media_slugs + logo_slugs))


def cleanup_generated_assets(image_dir: Path) -> None:
    for target in OLD_GENERATED_FILES:
        old_path = image_dir / target
        if old_path.exists():
            old_path.unlink()

    for auto_file in image_dir.glob("auto-*.svg"):
        auto_file.unlink()


def save_jpeg(image: Image.Image, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rgb_image = image.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.8, percent=110, threshold=3))
    rgb_image.save(output_path, format="JPEG", quality=90, optimize=True, progressive=True)


def generate_for_university(slug: str) -> None:
    title = slug_to_title(slug)
    image_dir = MEDIA_ROOT / slug / "images"
    video_dir = MEDIA_ROOT / slug / "videos"
    image_dir.mkdir(parents=True, exist_ok=True)
    video_dir.mkdir(parents=True, exist_ok=True)
    cleanup_generated_assets(image_dir)

    logo = load_logo(slug)
    for scene in SCENES:
        image = draw_scene(slug, scene["key"], scene["size"], logo)
        save_jpeg(image, image_dir / scene["filename"])

    keep_path = video_dir / ".gitkeep"
    if not keep_path.exists():
        keep_path.write_text("", encoding="utf-8")

    print(f"Created media for {title}")


def main() -> None:
    if not MEDIA_ROOT.exists():
        raise SystemExit("public/universities-media not found")

    slugs = get_university_slugs()
    for slug in slugs:
        generate_for_university(slug)

    print(f"Generated original raster university media for {len(slugs)} universities.")


if __name__ == "__main__":
    main()
