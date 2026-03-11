-- ==========================================================
-- FULL BVOC PDF ADDITIONS (INSERT ONLY)
-- Source: BVoc_Confirmed_Courses_(With_Syllabus) (4).pdf
-- For each base course:
--   Diploma (1 year)           -> 30000
--   Advanced Diploma (2 years) -> 60000
--   Bachelor Vocational (3y)   -> 90000
-- ==========================================================

-- Ensure Vocational mode + Glocal
insert into education_modes (name)
values ('Vocational')
on conflict (name) do nothing;

insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Glocal University', 'glocal-university', 'Saharanpur, India', array['Vocational','Skill Certification'], '/logos/universities/glocal-university.jpeg', 'Industry-focused vocational and skill certification programs.')
on conflict (slug) do nothing;

-- Ensure major sectors used by vocational mapping
insert into course_sectors (name, slug)
values
  ('Management', 'management'),
  ('Banking and Finance', 'banking-and-finance'),
  ('Computing and Information Technology', 'computing-and-information-technology'),
  ('Media', 'media'),
  ('Hotel Management', 'hotel-management'),
  ('Aviation', 'aviation'),
  ('Fashion', 'fashion'),
  ('Agriculture', 'agriculture'),
  ('Automobile', 'automobile'),
  ('Fire and Safety', 'fire-and-safety'),
  ('Electrical and Electronics', 'electrical-and-electronics'),
  ('Yoga and Naturopathy', 'yoga-and-naturopathy'),
  ('Interior Designing', 'interior-designing'),
  ('Mental Health', 'mental-health'),
  ('Technical Training', 'technical-training')
on conflict (name) do nothing;

with base(program_name) as (
  values
    ('Management and Entrepreneurship (Retail)'),
    ('Banking, Financial Services and Insurance Skills'),
    ('E Commerce and Digital Marketing Skill'),
    ('Entrepreneurship Skill'),
    ('Fire Technology and Industrial Safety Management'),
    ('Graphic Designing'),
    ('Internet of Things Programming and Big Data'),
    ('Manufacturing Skill'),
    ('Accounting and Business'),
    ('Visual Communication'),
    ('Hotel Management and Catering Science'),
    ('Airport and Airline Management'),
    ('Robotics and Artificial Intelligence'),
    ('Childhood Care and Education'),
    ('Computer Science'),
    ('Fashion Designing'),
    ('Gaming'),
    ('IT ITes Software Development'),
    ('Jewellery Design and Management'),
    ('Logistics Management'),
    ('Machine Learning and Artificial Intelligence'),
    ('Media and Entertainment'),
    ('Refrigeration and Air Conditioning'),
    ('Power Renewable Energy Technology'),
    ('Yoga and Naturopathy'),
    ('Information Technology'),
    ('Information Technology and Android Technology'),
    ('IT Networking'),
    ('Tourism and Hospitality'),
    ('Beauty and Wellness'),
    ('Software Development'),
    ('Animation'),
    ('Hospitality and Hotel Management'),
    ('Applied Computer Technology'),
    ('Electrical Skills'),
    ('Health Care'),
    ('3D Animation and VFX'),
    ('Automotive Skills'),
    ('Food Processing and Quality Management'),
    ('Multimedia'),
    ('Web Technologies'),
    ('Hospital Administration'),
    ('Tea Husbandry and Technology'),
    ('Agriculture and Rural Development'),
    ('Software Development and System Administration'),
    ('Business and Data Analytics'),
    ('Cyber Crime'),
    ('Textile Design'),
    ('Food Processing'),
    ('Automobiles'),
    ('Fire Safety'),
    ('Journalism and Mass Communication'),
    ('Interior Designing'),
    ('Paramedical and Health Administration'),
    ('Physiotherapy'),
    ('Pharmaceutical Chemistry'),
    ('CMSED'),
    ('Dental Hygiene'),
    ('Operation Theater'),
    ('Medical Laboratory Technology'),
    ('Critical Care Technology'),
    ('Patient Care Technology'),
    ('Optometry'),
    ('Medical Image Technology'),
    ('Cardiac Care Technology'),
    ('Dialysis Technology')
),
levels(level_name, level_prefix, duration, fees, level_suffix) as (
  values
    ('Diploma', 'Diploma in ', '1 year', 30000::numeric, 'voc-diploma'),
    ('Advanced Diploma', 'Advanced Diploma in ', '2 years', 60000::numeric, 'voc-advanced-diploma'),
    ('Bachelor Vocational', 'Bachelor Vocational in ', '3 years', 90000::numeric, 'voc-bachelor')
),
mode_ref as (
  select id from education_modes where name = 'Vocational'
),
expanded as (
  select
    l.level_prefix || b.program_name as course_name,
    lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(b.program_name, '&', ' and ', 'gi'),
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '(^-+)|(-+$)',
        '',
        'g'
      )
    ) || '-' || l.level_suffix as course_slug,
    l.duration,
    l.fees,
    case
      when lower(b.program_name) ~ '(hotel|hospitality|culinary|tourism|catering)' then 'Hotel Management'
      when lower(b.program_name) ~ '(airport|airline|aviation)' then 'Aviation'
      when lower(b.program_name) ~ '(fashion|textile|beauty|wellness)' then 'Fashion'
      when lower(b.program_name) ~ '(media|journalism|animation|graphic|visual|multimedia|vfx)' then 'Media'
      when lower(b.program_name) ~ '(banking|finance|insurance|accounting)' then 'Banking and Finance'
      when lower(b.program_name) ~ '(agriculture|tea|rural|food processing)' then 'Agriculture'
      when lower(b.program_name) ~ '(automobile|automotive)' then 'Automobile'
      when lower(b.program_name) ~ '(fire|safety)' then 'Fire and Safety'
      when lower(b.program_name) ~ '(electrical|refrigeration|air conditioning|renewable energy|power)' then 'Electrical and Electronics'
      when lower(b.program_name) ~ '(yoga|naturopathy)' then 'Yoga and Naturopathy'
      when lower(b.program_name) ~ '(medical|health|physio|pharma|dental|dialysis|optometry|cardiac|operation theater|hospital administration|paramedical)' then 'Mental Health'
      when lower(b.program_name) ~ '(computer|software|it|iot|android|machine learning|robotics|cyber|web|data|gaming|cmsed)' then 'Computing and Information Technology'
      when lower(b.program_name) ~ '(interior)' then 'Interior Designing'
      when lower(b.program_name) ~ '(management|entrepreneurship|logistics|business)' then 'Management'
      else 'Technical Training'
    end as sector_name,
    b.program_name
  from base b
  cross join levels l
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  e.course_name,
  e.course_slug,
  cs.id,
  mr.id,
  e.duration,
  'Vocational program in ' || e.program_name || '.'
from expanded e
join course_sectors cs on cs.name = e.sector_name
cross join mode_ref mr
on conflict (slug) do nothing;

-- Map all inserted BVOC programs to Glocal
with glocal as (
  select id from universities where slug = 'glocal-university'
),
voc_courses as (
  select c.id, c.slug, c.duration
  from courses c
  join education_modes m on m.id = c.mode_id
  where m.name = 'Vocational'
    and (c.slug like '%-voc-diploma' or c.slug like '%-voc-advanced-diploma' or c.slug like '%-voc-bachelor')
),
fees as (
  select
    vc.id as course_id,
    case
      when vc.slug like '%-voc-diploma' then 30000::numeric
      when vc.slug like '%-voc-advanced-diploma' then 60000::numeric
      else 90000::numeric
    end as fees,
    vc.duration
  from voc_courses vc
)
insert into university_courses (university_id, course_id, fees, duration)
select
  g.id,
  f.course_id,
  f.fees,
  f.duration
from fees f
cross join glocal g
on conflict (university_id, course_id) do nothing;

-- Students 100..4000
insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  100 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text || 'bvoc'), 1, 8))::bit(32)::int) % 3901)
from university_courses uc
join universities u on u.id = uc.university_id and u.slug = 'glocal-university'
join courses c on c.id = uc.course_id
where c.slug like '%-voc-diploma' or c.slug like '%-voc-advanced-diploma' or c.slug like '%-voc-bachelor'
on conflict (course_id, university_id) do nothing;

-- Ratings 3.8..4.8
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-rating'), 1, 8))::bit(32)::int) % 11) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
where c.slug like '%-voc-diploma' or c.slug like '%-voc-advanced-diploma' or c.slug like '%-voc-bachelor'
on conflict (course_id) do nothing;
