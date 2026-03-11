-- ==========================================================
-- REGULAR MODE ADDITIONS (INSERT ONLY)
-- ==========================================================

insert into education_modes (name)
values ('Regular')
on conflict (name) do nothing;

-- Regular-only universities
insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Rayat Bahra University', 'rayat-bahra-university', 'Mohali, India', array['Regular'], '/logos/universities/rayat-bahra-university.jpeg', 'Industry-focused regular degree programs.'),
  ('Dr Preeti Global University', 'dr-preeti-global-university', 'India', array['Regular'], '/logos/universities/dr-preeti-global-university.jpeg', 'Emerging university with modern regular curriculum.'),
  ('COER University', 'coer-university', 'Roorkee, India', array['Regular'], '/logos/universities/coer-university.jpeg', 'Professional and engineering regular programs.'),
  ('Guru Nanak University Hyderabad', 'guru-nanak-university-hyderabad', 'Hyderabad, India', array['Regular'], '/logos/universities/guru-nanak-university-hyderabad.jpeg', 'Regular degree pathways with practical exposure.'),
  ('NIAT', 'niat', 'India', array['Regular'], '/logos/universities/niat.jpeg', 'Technology and business focused regular programs.'),
  ('Suryadatta Group of Institutions', 'suryadatta-group-of-institutions', 'Pune, India', array['Regular'], '/logos/universities/suryadatta-group-of-institutions.jpeg', 'Industry connected regular degree offerings.'),
  ('North East Christian University', 'north-east-christian-university', 'North East India', array['Regular'], '/logos/universities/north-east-christian-university.jpeg', 'Regional access to quality higher education.')
on conflict (slug) do update
set
  name = excluded.name,
  location = excluded.location,
  mode_supported = excluded.mode_supported,
  logo = excluded.logo,
  description = excluded.description;

-- Ensure sectors for regular programs
insert into course_sectors (name, slug)
values
  ('Technical Training', 'technical-training'),
  ('Management', 'management'),
  ('Hotel Management', 'hotel-management'),
  ('Banking & Finance', 'banking-and-finance'),
  ('Mental Health', 'mental-health'),
  ('Sports', 'sports'),
  ('Computing & Information Technology', 'computing-and-information-technology'),
  ('Language Studies', 'language-studies'),
  ('Child Education', 'child-education'),
  ('Office Management', 'office-management'),
  ('Agriculture', 'agriculture'),
  ('Home Maintenance', 'home-maintenance'),
  ('Media', 'media')
on conflict (slug) do nothing;

-- Regular courses catalog
with regular_mode as (
  select id from education_modes where name = 'Regular'
),
course_data as (
  select * from (values
    ('Polytechnic Diploma', 'polytechnic-diploma-regular', 'technical-training', '3/2 years', 'Regular polytechnic diploma pathway in core engineering streams.'),
    ('B.Tech', 'b-tech-regular', 'technical-training', '4 years', 'Regular engineering degree with branch specialization and practical labs.'),
    ('M.Tech', 'm-tech-regular', 'technical-training', '2 years', 'Postgraduate engineering program for advanced technical specialization.'),
    ('BBA', 'bba-regular', 'management', '3 years', 'Regular undergraduate business administration program.'),
    ('MBA', 'mba-regular', 'management', '2 years', 'Regular postgraduate management program with specialization options.'),
    ('BHMCT', 'bhmct-regular', 'hotel-management', '4 years', 'Regular hotel management and catering technology degree.'),
    ('DHMCT', 'dhmct-regular', 'hotel-management', '2 years', 'Regular diploma in hotel management and catering technology.'),
    ('B.Com (Honours)', 'b-com-honours-regular', 'banking-and-finance', '4/3 years', 'Regular commerce honors program with accounting and finance foundation.'),
    ('B.Com (Computer Application)', 'b-com-computer-application-regular', 'banking-and-finance', '4/3 years', 'Regular commerce program with computer application focus.'),
    ('M.Com', 'm-com-regular', 'banking-and-finance', '2 years', 'Regular postgraduate commerce degree.'),
    ('Certificate (Health Inspector, OT, X-Ray)', 'certificate-health-inspector-ot-x-ray-regular', 'mental-health', '1 year', 'Regular certificate pathway in healthcare support roles.'),
    ('DMLT', 'dmlt-regular', 'mental-health', '2 years', 'Regular diploma in medical laboratory technology.'),
    ('BMLT', 'bmlt-regular', 'mental-health', '3 years', 'Regular bachelor program in medical laboratory technology.'),
    ('BPT', 'bpt-regular', 'sports', '4 years', 'Regular bachelor of physiotherapy program.'),
    ('B.Sc', 'b-sc-regular', 'technical-training', '4/3 years', 'Regular bachelor of science pathway across multiple science branches.'),
    ('M.Sc', 'm-sc-regular', 'technical-training', '2 years', 'Regular master of science program across major disciplines.'),
    ('DCA', 'dca-regular', 'computing-and-information-technology', '1 year', 'Regular diploma in computer applications.'),
    ('BCA', 'bca-regular', 'computing-and-information-technology', '4 years', 'Regular bachelor of computer applications program.'),
    ('PGDCA', 'pgdca-regular', 'computing-and-information-technology', '1 year', 'Regular postgraduate diploma in computer applications.'),
    ('MCA', 'mca-regular', 'computing-and-information-technology', '2 years', 'Regular master of computer applications program.'),
    ('B.A', 'b-a-regular', 'language-studies', '4/3 years', 'Regular bachelor of arts program.'),
    ('M.A', 'm-a-regular', 'language-studies', '2 years', 'Regular master of arts program.'),
    ('BSW', 'bsw-regular', 'management', '4 years', 'Regular bachelor of social work program.'),
    ('MSW', 'msw-regular', 'management', '2 years', 'Regular master of social work program.'),
    ('M.A (Education)', 'm-a-education-regular', 'child-education', '2 years', 'Regular master program in education.'),
    ('B.PEd', 'b-ped-regular', 'sports', '2 years', 'Regular bachelor in physical education.'),
    ('B.Lib. & I.Sc.', 'b-lib-i-sc-regular', 'office-management', '1 year', 'Regular library and information science program.'),
    ('M.Lib. & I.Sc.', 'm-lib-i-sc-regular', 'office-management', '1 year', 'Regular postgraduate library and information science program.'),
    ('B.Sc (Agriculture)', 'b-sc-agriculture-regular', 'agriculture', '4 years', 'Regular bachelor of science in agriculture.'),
    ('M.Sc (Agriculture)', 'm-sc-agriculture-regular', 'agriculture', '2 years', 'Regular postgraduate agriculture program.'),
    ('B.Sc (Home Science)', 'b-sc-home-science-regular', 'home-maintenance', '3 years', 'Regular home science undergraduate program.'),
    ('M.Sc (Home Science)', 'm-sc-home-science-regular', 'home-maintenance', '2 years', 'Regular postgraduate home science program.'),
    ('BJMC', 'bjmc-regular', 'media', '3 years', 'Regular bachelor in journalism and mass communication.'),
    ('MJMC', 'mjmc-regular', 'media', '2 years', 'Regular master in journalism and mass communication.'),
    ('LLB', 'llb-regular', 'management', '3 years', 'Regular bachelor of laws program.'),
    ('BA-LLB', 'ba-llb-regular', 'management', '5 years', 'Integrated regular BA-LLB law program.'),
    ('LLM', 'llm-regular', 'management', '2 years', 'Regular master of laws program.'),
    ('PhD (Technical)', 'phd-technical-regular', 'technical-training', '3 years', 'Doctoral research program in technical disciplines.'),
    ('PhD (Non-Technical)', 'phd-non-technical-regular', 'management', '3 years', 'Doctoral research program in non-technical disciplines.')
  ) as t(name, slug, sector_slug, duration, description)
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  cd.name,
  cd.slug,
  cs.id,
  rm.id,
  cd.duration,
  cd.description
from course_data cd
join course_sectors cs on cs.slug = cd.sector_slug
cross join regular_mode rm
on conflict (slug) do update
set
  name = excluded.name,
  sector_id = excluded.sector_id,
  mode_id = excluded.mode_id,
  duration = excluded.duration,
  description = excluded.description;

-- Map all regular courses to regular universities
with regular_courses as (
  select id, duration from courses
  where mode_id = (select id from education_modes where name = 'Regular')
),
regular_universities as (
  select id from universities where 'Regular' = any(mode_supported)
)
insert into university_courses (university_id, course_id, fees, duration)
select
  u.id,
  c.id,
  0::numeric,
  c.duration
from regular_universities u
cross join regular_courses c
on conflict (university_id, course_id) do update
set
  fees = excluded.fees,
  duration = excluded.duration;

-- Students for regular mappings (100..5000)
insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  100 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text || 'regular'), 1, 8))::bit(32)::int) % 4901)
from university_courses uc
join courses c on c.id = uc.course_id
join education_modes m on m.id = c.mode_id and m.name = 'Regular'
on conflict (course_id, university_id) do update
set student_count = excluded.student_count;

-- Ratings for regular courses
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-regular-rating'), 1, 8))::bit(32)::int) % 11) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-regular-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
join education_modes m on m.id = c.mode_id and m.name = 'Regular'
on conflict (course_id) do update
set
  rating = excluded.rating,
  review_count = excluded.review_count;
