# EduDiscover - University Discovery Platform

Production-ready education marketplace built with Next.js 14, TypeScript, TailwindCSS, shadcn-style UI components, Framer Motion, React Query, and Supabase.

## Features

- University and course discovery with dynamic SEO pages
- Filters by sector, mode, duration, and search query
- Ratings and reviews with summary metrics
- Consultation lead generation form
- Blog CMS routes with metadata
- Course comparison page
- Admin dashboard overview
- Sitemap and robots for SEO
- Supabase schema + seed SQL for relational model

## Tech

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Query
- Supabase (PostgreSQL/Auth/Storage compatible)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env.local
```

3. Add Supabase values in `.env.local`.

4. Run SQL:

- `supabase/schema.sql`
- `supabase/seed.sql`

5. Start app:

```bash
npm run dev
```

## Scale Notes

- Indexes on slugs, foreign keys, and filter fields are included.
- Relational `university_courses` avoids data duplication.
- SSR + static metadata routes improve discoverability and speed.
- Query functions are organized for future pagination and caching.

