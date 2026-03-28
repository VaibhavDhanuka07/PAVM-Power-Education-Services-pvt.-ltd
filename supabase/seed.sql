-- ==========================================================
-- ONLINE MODE DATASET (Exact programs provided by user)
-- Tables used: universities, courses, education_modes, university_courses
-- Also seeds students + ratings so course pages can show full details.
-- ==========================================================

-- Modes
insert into education_modes (name)
values
  ('Online'),
  ('Distance'),
  ('Vocational'),
  ('Skill Certification'),
  ('Regular')
on conflict (name) do nothing;

-- Sectors required by online programs
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

-- Universities (online mode universities requested)
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
  mode_supported = excluded.mode_supported,
  logo = excluded.logo,
  description = excluded.description;

-- Courses (create once)
with s as (
  select slug, id from course_sectors
),
m as (
  select id from education_modes where name = 'Online'
),
course_data as (
  select * from (values
    ('BBA', 'bba', 'management', '3 years', 'Undergraduate business program with fundamentals in management, marketing, and operations.'),
    ('B.Com. (Honours)', 'bcom-hons', 'banking-finance', '3 years', 'Advanced commerce curriculum in accounting, taxation, and finance.'),
    ('BA Journalism and Mass Communication', 'ba-journalism-and-mass-communication', 'media', '3 years', 'UG media program focused on reporting, editing, and digital communication.'),
    ('BCA', 'bca', 'computing-information-technology', '3 years', 'Undergraduate computing program in programming, databases, and software development.'),
    ('MBA', 'mba', 'management', '2 years', 'Postgraduate management degree with career specializations.'),
    ('M.A. English', 'ma-english', 'language-studies', '2 years', 'Postgraduate English studies program for language, literature, and communication.'),
    ('MCA', 'mca', 'computing-information-technology', '2 years', 'Advanced postgraduate computing and application development program.'),
    ('B.Com.', 'bcom', 'banking-finance', '3 years', 'Commerce degree covering accounting, business law, and financial systems.'),
    ('M.Sc. Mathematics', 'msc-mathematics', 'mathematics', '2 years', 'Postgraduate mathematics program with applied and theoretical focus.'),
    ('M.A. Journalism and Mass Communication', 'ma-journalism-and-mass-communication', 'media', '2 years', 'PG media and journalism program with communication strategy and content production.'),
    ('M.Com.', 'mcom', 'banking-finance', '2 years', 'Postgraduate commerce program in accounting, taxation, and financial analysis.'),
    ('M.A. International Relations', 'ma-international-relations', 'management', '2 years', 'Postgraduate program on global politics, diplomacy, and policy.'),
    ('BA', 'ba', 'language-studies', '3 years', 'General arts degree with broad humanities foundation.'),
    ('M.A. Economics', 'ma-economics', 'banking-finance', '2 years', 'Postgraduate economics program in policy, macroeconomics, and analytics.'),
    ('BA Journalism', 'ba-journalism', 'media', '3 years', 'Undergraduate journalism program for content, media practice, and communication.'),
    ('BA 2.0', 'ba-2-0', 'language-studies', '3 years', 'Modern arts curriculum with updated interdisciplinary approach.'),
    ('BLib', 'blib', 'library-science', '1 year', 'Library and information science foundation program.')
  ) as t(name, slug, sector_slug, duration, description)
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  cd.name,
  cd.slug,
  s.id as sector_id,
  m.id as mode_id,
  cd.duration,
  cd.description
from course_data cd
join s on s.slug = cd.sector_slug
cross join m
on conflict (slug) do update
set
  name = excluded.name,
  sector_id = excluded.sector_id,
  mode_id = excluded.mode_id,
  duration = excluded.duration,
  description = excluded.description;

-- Keep only the required online course slugs for this online dataset
delete from courses c
using education_modes m
where c.mode_id = m.id
  and m.name = 'Online'
  and c.slug not in (
    'bba',
    'bcom-hons',
    'ba-journalism-and-mass-communication',
    'bca',
    'mba',
    'ma-english',
    'mca',
    'bcom',
    'msc-mathematics',
    'ma-journalism-and-mass-communication',
    'mcom',
    'ma-international-relations',
    'ba',
    'ma-economics',
    'ba-journalism',
    'ba-2-0',
    'blib'
  );

-- University-course mapping (exact fee + duration)
with uc_data as (
  select * from (values
    -- Shoolini University
    ('shoolini-university', 'bba', 120000::numeric, '3 years'),
    ('shoolini-university', 'bcom-hons', 120000::numeric, '3 years'),
    ('shoolini-university', 'ba-journalism-and-mass-communication', 120000::numeric, '3 years'),
    ('shoolini-university', 'bca', 120000::numeric, '3 years'),
    ('shoolini-university', 'mba', 150000::numeric, '2 years'),
    ('shoolini-university', 'ma-english', 80000::numeric, '2 years'),
    ('shoolini-university', 'mca', 150000::numeric, '2 years'),

    -- Maharishi Markandeshwar University
    ('maharishi-markandeshwar-university', 'bca', 90000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bba', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'bcom', 105000::numeric, '3 years'),
    ('maharishi-markandeshwar-university', 'msc-mathematics', 70000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mba', 110000::numeric, '2 years'),
    ('maharishi-markandeshwar-university', 'mca', 84000::numeric, '2 years'),

    -- Noida International University
    ('noida-international-university', 'ba', 70000::numeric, '3 years'),
    ('noida-international-university', 'ba-journalism-and-mass-communication', 90000::numeric, '3 years'),
    ('noida-international-university', 'bba', 108000::numeric, '3 years'),
    ('noida-international-university', 'mba', 118000::numeric, '2 years'),
    ('noida-international-university', 'ma-english', 68000::numeric, '2 years'),
    ('noida-international-university', 'ma-journalism-and-mass-communication', 108000::numeric, '2 years'),
    ('noida-international-university', 'msc-mathematics', 108000::numeric, '2 years'),
    ('noida-international-university', 'bca', 108000::numeric, '3 years'),
    ('noida-international-university', 'bcom', 75000::numeric, '3 years'),
    ('noida-international-university', 'mca', 118000::numeric, '2 years'),
    ('noida-international-university', 'mcom', 80000::numeric, '2 years'),
    ('noida-international-university', 'ma-international-relations', 68000::numeric, '2 years'),

    -- Suresh Gyan Vihar University (per-year converted to total)
    ('suresh-gyan-vihar-university', 'bcom', 54000::numeric, '3 years'),    -- 18000/year
    ('suresh-gyan-vihar-university', 'mcom', 36000::numeric, '2 years'),    -- 18000/year
    ('suresh-gyan-vihar-university', 'ba', 48000::numeric, '3 years'),      -- 16000/year
    ('suresh-gyan-vihar-university', 'ma-economics', 32000::numeric, '2 years'), -- 16000/year
    ('suresh-gyan-vihar-university', 'bba', 75000::numeric, '3 years'),     -- 25000/year
    ('suresh-gyan-vihar-university', 'ba-journalism', 69000::numeric, '3 years'), -- 23000/year
    ('suresh-gyan-vihar-university', 'mba', 70000::numeric, '2 years'),     -- 35000/year
    ('suresh-gyan-vihar-university', 'mca', 70000::numeric, '2 years'),     -- 35000/year
    ('suresh-gyan-vihar-university', 'msc-mathematics', 50000::numeric, '2 years'), -- 25000/year
    ('suresh-gyan-vihar-university', 'ba-2-0', 69000::numeric, '3 years'),  -- 23000/year
    ('suresh-gyan-vihar-university', 'bca', 75000::numeric, '3 years'),     -- 25000/year
    ('suresh-gyan-vihar-university', 'blib', 25000::numeric, '1 year'),

    -- Bharati Vidyapeeth University
    ('bharati-vidyapeeth-university', 'mba', 160000::numeric, '2 years'),
    ('bharati-vidyapeeth-university', 'bba', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'bca', 140000::numeric, '3 years'),
    ('bharati-vidyapeeth-university', 'mca', 160000::numeric, '2 years'),

    -- Marwadi University
    ('marwadi-university', 'mba', 120000::numeric, '2 years'),
    ('marwadi-university', 'bba', 105000::numeric, '3 years'),
    ('marwadi-university', 'bca', 105000::numeric, '3 years'),
    ('marwadi-university', 'mca', 120000::numeric, '2 years'),

    -- Uttaranchal University
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
  d.fees,
  d.duration
from uc_data d
join universities u on u.slug = d.university_slug
join courses c on c.slug = d.course_slug
on conflict (university_id, course_id) do update
set
  fees = excluded.fees,
  duration = excluded.duration;

-- Students (for each university-course row)
insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  100 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text), 1, 8))::bit(32)::int) % 4901)
from university_courses uc
join courses c on c.id = uc.course_id
join education_modes m on m.id = c.mode_id and m.name = 'Online'
on conflict (course_id, university_id) do update
set student_count = excluded.student_count;

-- Ratings (per course)
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug), 1, 8))::bit(32)::int) % 11) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
join education_modes m on m.id = c.mode_id and m.name = 'Online'
on conflict (course_id) do update
set
  rating = excluded.rating,
  review_count = excluded.review_count;
