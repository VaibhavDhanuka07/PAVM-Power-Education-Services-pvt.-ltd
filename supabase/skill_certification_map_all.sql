-- ==========================================================
-- Ensure all Skill Certification courses are mapped to Glocal University
-- with consistent fees, students, and ratings.
-- ==========================================================

with glocal as (
  select id from universities where slug = 'glocal-university'
),
skill_courses as (
  select c.id, c.duration
  from courses c
  join education_modes m on m.id = c.mode_id
  where m.name = 'Skill Certification'
)
insert into university_courses (university_id, course_id, fees, duration)
select
  g.id,
  c.id,
  case
    when c.duration ilike '%6%' then 6000::numeric
    when c.duration ilike '%11%' then 10000::numeric
    else 8000::numeric
  end as fees,
  c.duration
from glocal g
cross join skill_courses c
on conflict (university_id, course_id) do update
set
  fees = excluded.fees,
  duration = excluded.duration;

insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  100 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text || 'skill-full-all'), 1, 8))::bit(32)::int) % 1401)
from university_courses uc
join universities u on u.id = uc.university_id and u.slug = 'glocal-university'
join courses c on c.id = uc.course_id
join education_modes m on m.id = c.mode_id and m.name = 'Skill Certification'
on conflict (course_id, university_id) do update
set student_count = excluded.student_count;

insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-skill-rate-all'), 1, 8))::bit(32)::int) % 10) / 10.0))::numeric, 1),
  25 + (abs(('x' || substr(md5(c.slug || '-skill-reviews-all'), 1, 8))::bit(32)::int) % 326)
from courses c
join education_modes m on m.id = c.mode_id and m.name = 'Skill Certification'
on conflict (course_id) do update
set rating = excluded.rating,
    review_count = excluded.review_count;
