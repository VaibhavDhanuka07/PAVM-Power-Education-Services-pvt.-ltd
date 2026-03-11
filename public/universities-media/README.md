University Media Library
========================

Put real per-university campus media files in this structure:

- `public/universities-media/<university-slug>/images/`
- `public/universities-media/<university-slug>/videos/`

Example:

- `public/universities-media/mangalayatan-university/images/campus-1.jpg`
- `public/universities-media/mangalayatan-university/images/library.webp`
- `public/universities-media/mangalayatan-university/videos/campus-tour.mp4`

Supported image formats
-----------------------

- `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.svg`

Supported video formats
-----------------------

- `.mp4`, `.webm`, `.mov`, `.m4v`

How rendering works
-------------------

1. The site first loads media from the exact university slug folder.
2. If nothing is found, it tries `public/universities-media/global/...`.
3. If still empty, it falls back to the university logo so the layout never breaks.
4. Files containing `hero` in their name are prioritized first.

Auto-generate premium placeholders
----------------------------------

You can generate distinct university-wise cinematic placeholder images for every university with:

- `npm run media:generate`

This creates:

- `00-cinematic-hero.svg`
- `00-cinematic-1.svg` to `00-cinematic-6.svg`

Recommended quality
-------------------

- Images: 1600px+ wide, optimized JPEG/WebP
- Videos: MP4 H.264, 720p or 1080p, 8-40 seconds
- Keep file sizes web-friendly for fast loading
