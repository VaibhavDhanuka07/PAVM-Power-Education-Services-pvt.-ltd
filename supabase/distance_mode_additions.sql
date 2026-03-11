-- ==========================================================
-- DISTANCE MODE ADDITIVE DATASET
-- Rules followed:
-- - INSERT ONLY (no deletes, no resets)
-- - Online data untouched
-- - Existing records preserved via ON CONFLICT DO NOTHING
-- ==========================================================

-- 1) Ensure Distance mode exists
insert into education_modes (name)
values ('Distance')
on conflict (name) do nothing;

-- 2) Add distance universities only if missing
insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Mangalayatan University', 'mangalayatan-university', 'Aligarh, India', array['Distance'], '/logos/universities/mangalayatan-university.jpeg', 'Distance learning programs across UG and PG pathways.'),
  ('Bharati Vidyapeeth University', 'bharati-vidyapeeth-university', 'Pune, India', array['Distance'], '/logos/universities/bharati-vidyapeeth-university.jpeg', 'Distance mode university programs with affordable fee structure.')
on conflict (slug) do nothing;

-- 3) Ensure required sectors exist for distance programs
insert into course_sectors (name, slug)
values
  ('Management', 'management'),
  ('Banking & Finance', 'banking-finance'),
  ('Computing & Information Technology', 'computing-information-technology'),
  ('Language Studies', 'language-studies'),
  ('Media', 'media'),
  ('Mathematics', 'mathematics'),
  ('Library Science', 'library-science'),
  ('Science', 'science')
on conflict (slug) do nothing;

-- 4) Add distance courses (separate slugs; names stay as requested)
with dist_mode as (
  select id from education_modes where name = 'Distance'
),
course_data as (
  select * from (values
    ('BA', 'ba-distance', 'language-studies', '3 years', 'Distance BA program with foundational humanities and social sciences curriculum.'),
    ('BCom', 'bcom-distance', 'banking-finance', '3 years', 'Distance BCom program focused on accounting, commerce, and business fundamentals.'),
    ('BBA', 'bba-distance', 'management', '3 years', 'Distance BBA program for business, management, and entrepreneurship pathways.'),
    ('BCA', 'bca-distance', 'computing-information-technology', '3 years', 'Distance BCA program covering programming, databases, and IT systems.'),
    ('BSc', 'bsc-distance', 'science', '3 years', 'Distance BSc program with applied science and analytical foundations.'),
    ('BLib', 'blib-distance', 'library-science', '1 year', 'Distance BLib program in library and information science basics.'),
    ('MLib', 'mlib-distance', 'library-science', '1 year', 'Distance MLib program in advanced library and information systems.'),
    ('BA Journalism', 'ba-journalism-distance', 'media', '3 years', 'Distance BA Journalism program for reporting, writing, and media communication.'),
    ('MA English', 'ma-english-distance', 'language-studies', '2 years', 'Distance MA English program with literature and language specialization.'),
    ('MA Sociology', 'ma-sociology-distance', 'language-studies', '2 years', 'Distance MA Sociology program focused on social systems and research methods.'),
    ('MA Political Science', 'ma-political-science-distance', 'management', '2 years', 'Distance MA Political Science program in governance and political thought.'),
    ('MA History', 'ma-history-distance', 'language-studies', '2 years', 'Distance MA History program with historical methods and interpretation.'),
    ('MA Economics', 'ma-economics-distance', 'banking-finance', '2 years', 'Distance MA Economics program in policy, macroeconomics, and analytics.'),
    ('MCom', 'mcom-distance', 'banking-finance', '2 years', 'Distance MCom program in accounting, finance, and commerce strategy.'),
    ('MSc Mathematics', 'msc-mathematics-distance', 'mathematics', '2 years', 'Distance MSc Mathematics program with pure and applied mathematics.'),
    ('MBA', 'mba-distance', 'management', '2 years', 'Distance MBA program for management leadership and business strategy.'),
    ('MCA', 'mca-distance', 'computing-information-technology', '2 years', 'Distance MCA program in software engineering and application development.'),
    ('MSW', 'msw-distance', 'management', '2 years', 'Distance MSW program focused on social work practice and community development.')
  ) as t(name, slug, sector_slug, duration, description)
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  cd.name,
  cd.slug,
  cs.id,
  dm.id,
  cd.duration,
  cd.description
from course_data cd
join course_sectors cs on cs.slug = cd.sector_slug
cross join dist_mode dm
on conflict (slug) do nothing;

-- 5) Map distance courses to universities (insert only)
with uc_data as (
  select * from (values
    -- Mangalayatan University (as provided)
    ('mangalayatan-university', 'ba-distance', 8800::numeric, '3 years'),
    ('mangalayatan-university', 'bcom-distance', 11000::numeric, '3 years'),
    ('mangalayatan-university', 'ma-sociology-distance', 14000::numeric, '2 years'),
    ('mangalayatan-university', 'ma-political-science-distance', 14000::numeric, '2 years'),
    ('mangalayatan-university', 'ma-english-distance', 14000::numeric, '2 years'),
    ('mangalayatan-university', 'ma-history-distance', 14000::numeric, '2 years'),
    ('mangalayatan-university', 'mcom-distance', 14000::numeric, '2 years'),
    ('mangalayatan-university', 'msc-mathematics-distance', 28000::numeric, '2 years'),
    ('mangalayatan-university', 'mba-distance', 30000::numeric, '2 years'),
    ('mangalayatan-university', 'ba-journalism-distance', 56000::numeric, '3 years'),
    ('mangalayatan-university', 'bsc-distance', 80000::numeric, '3 years'),
    ('mangalayatan-university', 'blib-distance', 22000::numeric, '1 year'),
    ('mangalayatan-university', 'mlib-distance', 24000::numeric, '1 year'),

    -- Bharati Vidyapeeth University (as provided)
    ('bharati-vidyapeeth-university', 'ba-distance', 20000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bcom-distance', 20000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bba-distance', 71000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bca-distance', 71000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'ma-english-distance', 18000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'ma-economics-distance', 18000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'mcom-distance', 18000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'msc-mathematics-distance', 28000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'mba-distance', 86000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'mca-distance', 86000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'msw-distance', 72000::numeric, '2 years')
  ) as t(university_slug, course_slug, fees, duration)
)
insert into university_courses (university_id, course_id, fees, duration)
select
  u.id,
  c.id,
  d.fees,
  d.duration
from uc_data d
join universities u on u.slug = d.university_slug
join courses c on c.slug = d.course_slug
on conflict (university_id, course_id) do nothing;

-- 6) Enrollment for distance mappings only (100..3000)
with distance_links as (
  select uc.course_id, uc.university_id
  from university_courses uc
  join courses c on c.id = uc.course_id
  join education_modes m on m.id = c.mode_id
  where m.name = 'Distance'
    and c.slug in (
      'ba-distance','bcom-distance','bba-distance','bca-distance','bsc-distance',
      'blib-distance','mlib-distance','ba-journalism-distance','ma-english-distance',
      'ma-sociology-distance','ma-political-science-distance','ma-history-distance',
      'ma-economics-distance','mcom-distance','msc-mathematics-distance',
      'mba-distance','mca-distance','msw-distance'
    )
)
insert into students (course_id, university_id, student_count)
select
  dl.course_id,
  dl.university_id,
  100 + (abs(('x' || substr(md5(dl.course_id::text || dl.university_id::text || 'distance'), 1, 8))::bit(32)::int) % 2901)
from distance_links dl
on conflict (course_id, university_id) do nothing;

-- 7) Ratings for distance courses only (3.8..4.6)
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-distance-rating'), 1, 8))::bit(32)::int) % 9) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-distance-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
join education_modes m on m.id = c.mode_id
where m.name = 'Distance'
  and c.slug in (
    'ba-distance','bcom-distance','bba-distance','bca-distance','bsc-distance',
    'blib-distance','mlib-distance','ba-journalism-distance','ma-english-distance',
    'ma-sociology-distance','ma-political-science-distance','ma-history-distance',
    'ma-economics-distance','mcom-distance','msc-mathematics-distance',
    'mba-distance','mca-distance','msw-distance'
  )
on conflict (course_id) do nothing;
