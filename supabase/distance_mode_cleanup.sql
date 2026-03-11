-- ==========================================================
-- DISTANCE MODE CLEANUP
-- Keeps only approved Distance courses for:
-- - Mangalayatan University
-- - Bharati Vidyapeeth University
-- ==========================================================

-- Approved distance course slugs
with approved(slug) as (
  values
    ('ba-distance'),
    ('bcom-distance'),
    ('bba-distance'),
    ('bca-distance'),
    ('bsc-distance'),
    ('blib-distance'),
    ('mlib-distance'),
    ('ba-journalism-distance'),
    ('ma-english-distance'),
    ('ma-sociology-distance'),
    ('ma-political-science-distance'),
    ('ma-history-distance'),
    ('ma-economics-distance'),
    ('mcom-distance'),
    ('msc-mathematics-distance'),
    ('mba-distance'),
    ('mca-distance'),
    ('msw-distance')
),
distance_mode as (
  select id from education_modes where name = 'Distance'
),
distance_courses as (
  select c.id, c.slug
  from courses c
  join distance_mode dm on dm.id = c.mode_id
),
target_universities as (
  select id
  from universities
  where slug in ('mangalayatan-university', 'bharati-vidyapeeth-university')
),
extra_links as (
  select uc.course_id, uc.university_id
  from university_courses uc
  join distance_courses dc on dc.id = uc.course_id
  join target_universities tu on tu.id = uc.university_id
  left join approved a on a.slug = dc.slug
  where a.slug is null
)
-- remove enrollments for extra links
delete from students s
using extra_links el
where s.course_id = el.course_id
  and s.university_id = el.university_id;

with approved(slug) as (
  values
    ('ba-distance'),
    ('bcom-distance'),
    ('bba-distance'),
    ('bca-distance'),
    ('bsc-distance'),
    ('blib-distance'),
    ('mlib-distance'),
    ('ba-journalism-distance'),
    ('ma-english-distance'),
    ('ma-sociology-distance'),
    ('ma-political-science-distance'),
    ('ma-history-distance'),
    ('ma-economics-distance'),
    ('mcom-distance'),
    ('msc-mathematics-distance'),
    ('mba-distance'),
    ('mca-distance'),
    ('msw-distance')
),
distance_mode as (
  select id from education_modes where name = 'Distance'
),
distance_courses as (
  select c.id, c.slug
  from courses c
  join distance_mode dm on dm.id = c.mode_id
),
target_universities as (
  select id
  from universities
  where slug in ('mangalayatan-university', 'bharati-vidyapeeth-university')
)
delete from university_courses uc
using distance_courses dc, target_universities tu
left join approved a on a.slug = dc.slug
where uc.course_id = dc.id
  and uc.university_id = tu.id
  and a.slug is null;

-- Remove ratings for extra distance courses only if no approved mapping remains
with approved(slug) as (
  values
    ('ba-distance'),
    ('bcom-distance'),
    ('bba-distance'),
    ('bca-distance'),
    ('bsc-distance'),
    ('blib-distance'),
    ('mlib-distance'),
    ('ba-journalism-distance'),
    ('ma-english-distance'),
    ('ma-sociology-distance'),
    ('ma-political-science-distance'),
    ('ma-history-distance'),
    ('ma-economics-distance'),
    ('mcom-distance'),
    ('msc-mathematics-distance'),
    ('mba-distance'),
    ('mca-distance'),
    ('msw-distance')
),
distance_mode as (
  select id from education_modes where name = 'Distance'
),
extra_distance_courses as (
  select c.id
  from courses c
  join distance_mode dm on dm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from ratings r
using extra_distance_courses edc
where r.course_id = edc.id;

-- Optionally remove extra distance courses globally (all universities)
with approved(slug) as (
  values
    ('ba-distance'),
    ('bcom-distance'),
    ('bba-distance'),
    ('bca-distance'),
    ('bsc-distance'),
    ('blib-distance'),
    ('mlib-distance'),
    ('ba-journalism-distance'),
    ('ma-english-distance'),
    ('ma-sociology-distance'),
    ('ma-political-science-distance'),
    ('ma-history-distance'),
    ('ma-economics-distance'),
    ('mcom-distance'),
    ('msc-mathematics-distance'),
    ('mba-distance'),
    ('mca-distance'),
    ('msw-distance')
),
distance_mode as (
  select id from education_modes where name = 'Distance'
),
extra_distance_courses as (
  select c.id
  from courses c
  join distance_mode dm on dm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from courses c
using extra_distance_courses edc
where c.id = edc.id;
