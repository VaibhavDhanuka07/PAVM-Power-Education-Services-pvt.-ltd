-- ==========================================================
-- ONE-CLICK ONLINE MODE CLEANUP + RESEED
-- Scope: Only ONLINE mode mappings for the 7 online universities.
-- Safe for repeated runs (idempotent where possible).
-- ==========================================================

begin;

-- 1) Ensure Online mode exists
insert into education_modes (name)
values ('Online')
on conflict (name) do nothing;

-- 2) Ensure required sectors exist
insert into course_sectors (name, slug)
values
  ('Management', 'management'),
  ('Banking & Finance', 'banking-finance'),
  ('Media', 'media'),
  ('Computing & Information Technology', 'computing-information-technology'),
  ('Language Studies', 'language-studies'),
  ('Mathematics', 'mathematics'),
  ('Library Science', 'library-science')
on conflict (slug) do nothing;

-- 3) Upsert the 7 online universities (adds/keeps Online in mode_supported)
insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Shoolini University', 'shoolini-university', 'Himachal Pradesh, India', array['Online'], '/logos/universities/shoolini-university.jpeg', 'Online university with career-focused UG and PG programs.'),
  ('Maharishi Markandeshwar University', 'maharishi-markandeshwar-university', 'Ambala, India', array['Online'], '/logos/universities/maharishi-markandeshwar-university.jpeg', 'Online degree programs with professional outcomes and affordability.'),
  ('Noida International University', 'noida-international-university', 'Greater Noida, India', array['Online','Regular'], '/logos/universities/noida-international-university.jpeg', 'Multidisciplinary university with online and regular offerings.'),
  ('Suresh Gyan Vihar University', 'suresh-gyan-vihar-university', 'Jaipur, India', array['Online'], '/logos/universities/suresh-gyan-vihar-university.jpeg', 'Online programs with strong NAAC-backed academic support.'),
  ('Bharati Vidyapeeth University', 'bharati-vidyapeeth-university', 'Pune, India', array['Online','Distance'], '/logos/universities/bharati-vidyapeeth-university.jpeg', 'Established institution with online and distance pathways.'),
  ('Marwadi University', 'marwadi-university', 'Rajkot, India', array['Online','Regular'], '/logos/universities/marwadi-university.jpeg', 'Industry-oriented university with online and regular degree tracks.'),
  ('Uttaranchal University', 'uttaranchal-university', 'Dehradun, India', array['Online'], '/logos/universities/uttaranchal-university.jpeg', 'Online university focused on practical, job-ready degree programs.')
on conflict (slug) do update
set
  name = excluded.name,
  location = excluded.location,
  logo = excluded.logo,
  description = excluded.description,
  mode_supported = (
    select array_agg(distinct m)
    from unnest(coalesce(universities.mode_supported, '{}'::text[]) || excluded.mode_supported) as m
  );

-- 4) Upsert the exact Online courses (single course records)
with online_mode as (
  select id from education_modes where name = 'Online'
),
sectors as (
  select id, slug from course_sectors
),
course_data as (
  select * from (values
    ('BBA', 'bba', 'management', '3 years', 'Undergraduate business program with fundamentals in management, marketing, and operations.'),
    ('BCom Hons', 'bcom-hons', 'banking-finance', '3 years', 'Advanced commerce curriculum in accounting, taxation, and finance.'),
    ('BA Journalism and Mass Communication', 'ba-journalism-and-mass-communication', 'media', '3 years', 'UG media program focused on reporting, editing, and digital communication.'),
    ('BCA', 'bca', 'computing-information-technology', '3 years', 'Undergraduate computing program in programming, databases, and software development.'),
    ('MBA', 'mba', 'management', '2 years', 'Postgraduate management degree with career specializations.'),
    ('MA English', 'ma-english', 'language-studies', '2 years', 'Postgraduate English studies program for language, literature, and communication.'),
    ('MCA', 'mca', 'computing-information-technology', '2 years', 'Advanced postgraduate computing and application development program.'),
    ('BCom', 'bcom', 'banking-finance', '3 years', 'Commerce degree covering accounting, business law, and financial systems.'),
    ('MSc Mathematics', 'msc-mathematics', 'mathematics', '2 years', 'Postgraduate mathematics program with applied and theoretical focus.'),
    ('MA Journalism and Mass Communication', 'ma-journalism-and-mass-communication', 'media', '2 years', 'PG media and journalism program with communication strategy and content production.'),
    ('MCom', 'mcom', 'banking-finance', '2 years', 'Postgraduate commerce program in accounting, taxation, and financial analysis.'),
    ('MA International Relations', 'ma-international-relations', 'management', '2 years', 'Postgraduate program on global politics, diplomacy, and policy.'),
    ('BA', 'ba', 'language-studies', '3 years', 'General arts degree with broad humanities foundation.'),
    ('MA Economics', 'ma-economics', 'management', '2 years', 'Postgraduate economics program in policy, macroeconomics, and analytics.'),
    ('BA Journalism', 'ba-journalism', 'media', '3 years', 'Undergraduate journalism program for content, media practice, and communication.'),
    ('BA 2.0', 'ba-2-0', 'language-studies', '3 years', 'Modern arts curriculum with updated interdisciplinary approach.'),
    ('BLib', 'blib', 'library-science', '1 year', 'Library and information science foundation program.')
  ) as t(name, slug, sector_slug, duration, description)
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  cd.name,
  cd.slug,
  s.id,
  om.id,
  cd.duration,
  cd.description
from course_data cd
join sectors s on s.slug = cd.sector_slug
cross join online_mode om
on conflict (slug) do update
set
  name = excluded.name,
  sector_id = excluded.sector_id,
  mode_id = excluded.mode_id,
  duration = excluded.duration,
  description = excluded.description;

-- 5) Define exact ONLINE mapping (university + course + fees + duration)
with allowed as (
  select * from (values
    -- Shoolini
    ('shoolini-university', 'bba', 120000::numeric, '3 years'),
    ('shoolini-university', 'bcom-hons', 120000::numeric, '3 years'),
    ('shoolini-university', 'ba-journalism-and-mass-communication', 120000::numeric, '3 years'),
    ('shoolini-university', 'bca', 120000::numeric, '3 years'),
    ('shoolini-university', 'mba', 150000::numeric, '2 years'),
    ('shoolini-university', 'ma-english', 80000::numeric, '2 years'),
    ('shoolini-university', 'mca', 150000::numeric, '2 years'),

    -- MMU
    ('maharishi-markandeshwar-university', 'bca', 90000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bba', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bcom', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'msc-mathematics', 70000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mba', 110000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mca', 84000::numeric, '2 years'),

    -- Noida
    ('noida-international-university', 'bba', 108000::numeric, '3 years'),
    ('noida-international-university', 'mba', 118000::numeric, '2 years'),
    ('noida-international-university', 'ma-journalism-and-mass-communication', 108000::numeric, '2 years'),
    ('noida-international-university', 'msc-mathematics', 108000::numeric, '2 years'),
    ('noida-international-university', 'bca', 108000::numeric, '3 years'),
    ('noida-international-university', 'bcom', 75000::numeric, '3 years'),
    ('noida-international-university', 'mca', 118000::numeric, '2 years'),
    ('noida-international-university', 'mcom', 80000::numeric, '2 years'),
    ('noida-international-university', 'ma-international-relations', 68000::numeric, '2 years'),

    -- SGVU (per-year converted to total)
    ('suresh-gyan-vihar-university', 'bcom', 54000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'mcom', 36000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'ba', 48000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'ma-economics', 32000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'bba', 75000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'ba-journalism', 69000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'mba', 70000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'mca', 70000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'msc-mathematics', 50000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'ba-2-0', 69000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'bca', 75000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'blib', 25000::numeric, '1 year'),

    -- Bharati Vidyapeeth
    ('bharati-vidyapeeth-university', 'mba', 160000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'bba', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bca', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'mca', 160000::numeric, '2 years'),

    -- Marwadi
    ('marwadi-university', 'mba', 120000::numeric, '2 years'),
    ('marwadi-university', 'bba', 105000::numeric, '3 years'),
    ('marwadi-university', 'bca', 105000::numeric, '3 years'),
    ('marwadi-university', 'mca', 120000::numeric, '2 years'),

    -- Uttaranchal
    ('uttaranchal-university', 'bba', 105000::numeric, '3 years'),
    ('uttaranchal-university', 'bca', 105000::numeric, '3 years'),
    ('uttaranchal-university', 'mba', 120000::numeric, '2 years'),
    ('uttaranchal-university', 'mca', 120000::numeric, '2 years')
  ) as t(university_slug, course_slug, fees, duration)
),
target_universities as (
  select id, slug
  from universities
  where slug in (
    'shoolini-university',
    'maharishi-markandeshwar-university',
    'noida-international-university',
    'suresh-gyan-vihar-university',
    'bharati-vidyapeeth-university',
    'marwadi-university',
    'uttaranchal-university'
  )
),
online_courses as (
  select c.id, c.slug
  from courses c
  join education_modes m on m.id = c.mode_id
  where m.name = 'Online'
)
-- 5a) Remove unwanted ONLINE mappings for only these 7 universities
delete from university_courses uc
using target_universities tu, courses c, education_modes m
where uc.university_id = tu.id
  and uc.course_id = c.id
  and c.mode_id = m.id
  and m.name = 'Online'
  and not exists (
    select 1
    from allowed a
    where a.university_slug = tu.slug
      and a.course_slug = c.slug
  );

-- 5b) Remove stale student rows for deleted/unwanted ONLINE mappings
with allowed as (
  select * from (values
    ('shoolini-university', 'bba'), ('shoolini-university', 'bcom-hons'), ('shoolini-university', 'ba-journalism-and-mass-communication'),
    ('shoolini-university', 'bca'), ('shoolini-university', 'mba'), ('shoolini-university', 'ma-english'), ('shoolini-university', 'mca'),
    ('maharishi-markandeshwar-university', 'bca'), ('maharishi-markandeshwar-university', 'bba'), ('maharishi-markandeshwar-university', 'bcom'),
    ('maharishi-markandeshwar-university', 'msc-mathematics'), ('maharishi-markandeshwar-university', 'mba'), ('maharishi-markandeshwar-university', 'mca'),
    ('noida-international-university', 'bba'), ('noida-international-university', 'mba'), ('noida-international-university', 'ma-journalism-and-mass-communication'),
    ('noida-international-university', 'msc-mathematics'), ('noida-international-university', 'bca'), ('noida-international-university', 'bcom'),
    ('noida-international-university', 'mca'), ('noida-international-university', 'mcom'), ('noida-international-university', 'ma-international-relations'),
    ('suresh-gyan-vihar-university', 'bcom'), ('suresh-gyan-vihar-university', 'mcom'), ('suresh-gyan-vihar-university', 'ba'),
    ('suresh-gyan-vihar-university', 'ma-economics'), ('suresh-gyan-vihar-university', 'bba'), ('suresh-gyan-vihar-university', 'ba-journalism'),
    ('suresh-gyan-vihar-university', 'mba'), ('suresh-gyan-vihar-university', 'mca'), ('suresh-gyan-vihar-university', 'msc-mathematics'),
    ('suresh-gyan-vihar-university', 'ba-2-0'), ('suresh-gyan-vihar-university', 'bca'), ('suresh-gyan-vihar-university', 'blib'),
    ('bharati-vidyapeeth-university', 'mba'), ('bharati-vidyapeeth-university', 'bba'), ('bharati-vidyapeeth-university', 'bca'), ('bharati-vidyapeeth-university', 'mca'),
    ('marwadi-university', 'mba'), ('marwadi-university', 'bba'), ('marwadi-university', 'bca'), ('marwadi-university', 'mca'),
    ('uttaranchal-university', 'bba'), ('uttaranchal-university', 'bca'), ('uttaranchal-university', 'mba'), ('uttaranchal-university', 'mca')
  ) as t(university_slug, course_slug)
)
delete from students s
using universities u, courses c, education_modes m
where s.university_id = u.id
  and s.course_id = c.id
  and c.mode_id = m.id
  and m.name = 'Online'
  and u.slug in (
    'shoolini-university',
    'maharishi-markandeshwar-university',
    'noida-international-university',
    'suresh-gyan-vihar-university',
    'bharati-vidyapeeth-university',
    'marwadi-university',
    'uttaranchal-university'
  )
  and not exists (
    select 1 from allowed a
    where a.university_slug = u.slug
      and a.course_slug = c.slug
  );

-- 5c) Upsert exact mapping
with allowed as (
  select * from (values
    ('shoolini-university', 'bba', 120000::numeric, '3 years'),
    ('shoolini-university', 'bcom-hons', 120000::numeric, '3 years'),
    ('shoolini-university', 'ba-journalism-and-mass-communication', 120000::numeric, '3 years'),
    ('shoolini-university', 'bca', 120000::numeric, '3 years'),
    ('shoolini-university', 'mba', 150000::numeric, '2 years'),
    ('shoolini-university', 'ma-english', 80000::numeric, '2 years'),
    ('shoolini-university', 'mca', 150000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'bca', 90000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bba', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bcom', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'msc-mathematics', 70000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mba', 110000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mca', 84000::numeric, '2 years'),
    ('noida-international-university', 'bba', 108000::numeric, '3 years'),
    ('noida-international-university', 'mba', 118000::numeric, '2 years'),
    ('noida-international-university', 'ma-journalism-and-mass-communication', 108000::numeric, '2 years'),
    ('noida-international-university', 'msc-mathematics', 108000::numeric, '2 years'),
    ('noida-international-university', 'bca', 108000::numeric, '3 years'),
    ('noida-international-university', 'bcom', 75000::numeric, '3 years'),
    ('noida-international-university', 'mca', 118000::numeric, '2 years'),
    ('noida-international-university', 'mcom', 80000::numeric, '2 years'),
    ('noida-international-university', 'ma-international-relations', 68000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'bcom', 54000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'mcom', 36000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'ba', 48000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'ma-economics', 32000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'bba', 75000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'ba-journalism', 69000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'mba', 70000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'mca', 70000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'msc-mathematics', 50000::numeric, '2 years'),
    ('suresh-gyan-vihar-university', 'ba-2-0', 69000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'bca', 75000::numeric, '3 years'),
    ('suresh-gyan-vihar-university', 'blib', 25000::numeric, '1 year'),
    ('bharati-vidyapeeth-university', 'mba', 160000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'bba', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bca', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'mca', 160000::numeric, '2 years'),
    ('marwadi-university', 'mba', 120000::numeric, '2 years'),
    ('marwadi-university', 'bba', 105000::numeric, '3 years'),
    ('marwadi-university', 'bca', 105000::numeric, '3 years'),
    ('marwadi-university', 'mca', 120000::numeric, '2 years'),
    ('uttaranchal-university', 'bba', 105000::numeric, '3 years'),
    ('uttaranchal-university', 'bca', 105000::numeric, '3 years'),
    ('uttaranchal-university', 'mba', 120000::numeric, '2 years'),
    ('uttaranchal-university', 'mca', 120000::numeric, '2 years')
  ) as t(university_slug, course_slug, fees, duration)
)
insert into university_courses (university_id, course_id, fees, duration)
select
  u.id,
  c.id,
  a.fees,
  a.duration
from allowed a
join universities u on u.slug = a.university_slug
join courses c on c.slug = a.course_slug
on conflict (university_id, course_id) do update
set fees = excluded.fees, duration = excluded.duration;

-- 6) Upsert students for allowed mapping
with allowed_pairs as (
  select u.id as university_id, c.id as course_id
  from universities u
  join courses c on true
  join education_modes m on m.id = c.mode_id and m.name = 'Online'
  where (u.slug, c.slug) in (
    ('shoolini-university','bba'),
    ('shoolini-university','bcom-hons'),
    ('shoolini-university','ba-journalism-and-mass-communication'),
    ('shoolini-university','bca'),
    ('shoolini-university','mba'),
    ('shoolini-university','ma-english'),
    ('shoolini-university','mca'),
    ('maharishi-markandeshwar-university','bca'),
    ('maharishi-markandeshwar-university','bba'),
    ('maharishi-markandeshwar-university','bcom'),
    ('maharishi-markandeshwar-university','msc-mathematics'),
    ('maharishi-markandeshwar-university','mba'),
    ('maharishi-markandeshwar-university','mca'),
    ('noida-international-university','bba'),
    ('noida-international-university','mba'),
    ('noida-international-university','ma-journalism-and-mass-communication'),
    ('noida-international-university','msc-mathematics'),
    ('noida-international-university','bca'),
    ('noida-international-university','bcom'),
    ('noida-international-university','mca'),
    ('noida-international-university','mcom'),
    ('noida-international-university','ma-international-relations'),
    ('suresh-gyan-vihar-university','bcom'),
    ('suresh-gyan-vihar-university','mcom'),
    ('suresh-gyan-vihar-university','ba'),
    ('suresh-gyan-vihar-university','ma-economics'),
    ('suresh-gyan-vihar-university','bba'),
    ('suresh-gyan-vihar-university','ba-journalism'),
    ('suresh-gyan-vihar-university','mba'),
    ('suresh-gyan-vihar-university','mca'),
    ('suresh-gyan-vihar-university','msc-mathematics'),
    ('suresh-gyan-vihar-university','ba-2-0'),
    ('suresh-gyan-vihar-university','bca'),
    ('suresh-gyan-vihar-university','blib'),
    ('bharati-vidyapeeth-university','mba'),
    ('bharati-vidyapeeth-university','bba'),
    ('bharati-vidyapeeth-university','bca'),
    ('bharati-vidyapeeth-university','mca'),
    ('marwadi-university','mba'),
    ('marwadi-university','bba'),
    ('marwadi-university','bca'),
    ('marwadi-university','mca'),
    ('uttaranchal-university','bba'),
    ('uttaranchal-university','bca'),
    ('uttaranchal-university','mba'),
    ('uttaranchal-university','mca')
  )
)
insert into students (course_id, university_id, student_count)
select
  ap.course_id,
  ap.university_id,
  100 + (abs(('x' || substr(md5(ap.course_id::text || ap.university_id::text), 1, 8))::bit(32)::int) % 4901)
from allowed_pairs ap
on conflict (course_id, university_id) do update
set student_count = excluded.student_count;

-- 7) Upsert ratings for all online courses participating in mapping
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug), 1, 8))::bit(32)::int) % 11) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
join education_modes m on m.id = c.mode_id and m.name = 'Online'
where c.slug in (
  'bba','bcom-hons','ba-journalism-and-mass-communication','bca','mba','ma-english','mca',
  'bcom','msc-mathematics','ma-journalism-and-mass-communication','mcom','ma-international-relations',
  'ba','ma-economics','ba-journalism','ba-2-0','blib'
)
on conflict (course_id) do update
set rating = excluded.rating, review_count = excluded.review_count;

commit;

