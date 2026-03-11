-- ==========================================================
-- VOCATIONAL + SKILL CLEANUP
-- Keeps only approved slugs added in vocational_skill_additions.sql
-- ==========================================================

with approved(slug) as (
  values
    -- vocational
    ('horticulture-voc'),
    ('cold-storage-technology-voc'),
    ('plant-nursery-making-voc'),
    ('automobile-technology-voc'),
    ('diesel-engine-technology-voc'),
    ('petrol-engine-technology-voc'),
    ('nursery-teacher-training-voc'),
    ('montessori-child-education-voc'),
    ('early-childhood-care-and-education-voc'),
    ('architectural-technology-voc'),
    ('civil-construction-supervisor-voc'),
    ('construction-management-voc'),
    ('electrical-technology-voc'),
    ('electrician-voc'),
    ('air-conditioning-and-refrigeration-voc'),
    ('office-practice-management-voc'),
    ('secretarial-practice-voc'),
    ('personal-secretaryship-voc'),
    ('interior-designing-voc'),
    ('interior-and-exterior-designing-voc'),
    ('interior-design-and-visualization-voc'),
    ('dairy-technology-voc'),
    ('dairy-products-processing-voc'),
    ('dairy-laboratory-technician-voc'),
    ('fisheries-technology-voc'),
    ('hatchery-operator-voc'),
    ('ornamental-fish-cultivation-and-management-voc'),
    ('poultry-technology-voc'),
    ('poultry-feed-technician-voc'),
    ('poultry-management-voc'),
    ('book-binding-voc'),
    ('jute-work-craft-voc'),
    ('bamboo-crafts-artisans-voc'),
    ('spoken-english-voc'),
    ('personality-development-voc'),
    ('employability-skills-voc'),
    -- skill
    ('seed-production-technician-skill'),
    ('four-wheeler-mechanic-skill'),
    ('creche-and-pre-school-management-skill'),
    ('land-survey-assistant-skill'),
    ('communication-skills-development-skill'),
    ('dairy-technician-skill'),
    ('mobile-phone-technician-skill'),
    ('computer-applications-skill'),
    ('python-programming-skill'),
    ('data-science-skill'),
    ('fire-safety-methods-skill'),
    ('industrial-safety-skill'),
    ('pollution-control-management-skill'),
    ('gemmology-skill'),
    ('hotel-management-skill'),
    ('culinary-skills-skill'),
    ('vocal-music-skill'),
    ('cnc-machine-operation-skill'),
    ('textile-lab-technician-skill'),
    ('unani-science-skill'),
    ('yoga-and-naturopathy-skill'),
    ('hospital-management-skill'),
    ('airport-management-skill'),
    ('cabin-crew-management-skill'),
    ('banking-operations-skill'),
    ('fashion-designing-skill'),
    ('digital-photography-skill'),
    ('logistics-and-supply-chain-management-skill'),
    ('port-operations-management-skill'),
    ('solar-pv-design-and-installation-skill'),
    ('counseling-psychology-skill'),
    ('digital-marketing-skill')
),
target_modes as (
  select id from education_modes where name in ('Vocational', 'Skill Certification')
),
extra_courses as (
  select c.id, c.slug
  from courses c
  join target_modes tm on tm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from students s
using extra_courses ec
where s.course_id = ec.id;

with approved(slug) as (
  values
    ('horticulture-voc'),('cold-storage-technology-voc'),('plant-nursery-making-voc'),
    ('automobile-technology-voc'),('diesel-engine-technology-voc'),('petrol-engine-technology-voc'),
    ('nursery-teacher-training-voc'),('montessori-child-education-voc'),('early-childhood-care-and-education-voc'),
    ('architectural-technology-voc'),('civil-construction-supervisor-voc'),('construction-management-voc'),
    ('electrical-technology-voc'),('electrician-voc'),('air-conditioning-and-refrigeration-voc'),
    ('office-practice-management-voc'),('secretarial-practice-voc'),('personal-secretaryship-voc'),
    ('interior-designing-voc'),('interior-and-exterior-designing-voc'),('interior-design-and-visualization-voc'),
    ('dairy-technology-voc'),('dairy-products-processing-voc'),('dairy-laboratory-technician-voc'),
    ('fisheries-technology-voc'),('hatchery-operator-voc'),('ornamental-fish-cultivation-and-management-voc'),
    ('poultry-technology-voc'),('poultry-feed-technician-voc'),('poultry-management-voc'),
    ('book-binding-voc'),('jute-work-craft-voc'),('bamboo-crafts-artisans-voc'),
    ('spoken-english-voc'),('personality-development-voc'),('employability-skills-voc'),
    ('seed-production-technician-skill'),('four-wheeler-mechanic-skill'),('creche-and-pre-school-management-skill'),
    ('land-survey-assistant-skill'),('communication-skills-development-skill'),('dairy-technician-skill'),
    ('mobile-phone-technician-skill'),('computer-applications-skill'),('python-programming-skill'),
    ('data-science-skill'),('fire-safety-methods-skill'),('industrial-safety-skill'),
    ('pollution-control-management-skill'),('gemmology-skill'),('hotel-management-skill'),
    ('culinary-skills-skill'),('vocal-music-skill'),('cnc-machine-operation-skill'),
    ('textile-lab-technician-skill'),('unani-science-skill'),('yoga-and-naturopathy-skill'),
    ('hospital-management-skill'),('airport-management-skill'),('cabin-crew-management-skill'),
    ('banking-operations-skill'),('fashion-designing-skill'),('digital-photography-skill'),
    ('logistics-and-supply-chain-management-skill'),('port-operations-management-skill'),
    ('solar-pv-design-and-installation-skill'),('counseling-psychology-skill'),('digital-marketing-skill')
),
target_modes as (
  select id from education_modes where name in ('Vocational', 'Skill Certification')
),
extra_courses as (
  select c.id
  from courses c
  join target_modes tm on tm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from university_courses uc
using extra_courses ec
where uc.course_id = ec.id;

with approved(slug) as (
  values
    ('horticulture-voc'),('cold-storage-technology-voc'),('plant-nursery-making-voc'),
    ('automobile-technology-voc'),('diesel-engine-technology-voc'),('petrol-engine-technology-voc'),
    ('nursery-teacher-training-voc'),('montessori-child-education-voc'),('early-childhood-care-and-education-voc'),
    ('architectural-technology-voc'),('civil-construction-supervisor-voc'),('construction-management-voc'),
    ('electrical-technology-voc'),('electrician-voc'),('air-conditioning-and-refrigeration-voc'),
    ('office-practice-management-voc'),('secretarial-practice-voc'),('personal-secretaryship-voc'),
    ('interior-designing-voc'),('interior-and-exterior-designing-voc'),('interior-design-and-visualization-voc'),
    ('dairy-technology-voc'),('dairy-products-processing-voc'),('dairy-laboratory-technician-voc'),
    ('fisheries-technology-voc'),('hatchery-operator-voc'),('ornamental-fish-cultivation-and-management-voc'),
    ('poultry-technology-voc'),('poultry-feed-technician-voc'),('poultry-management-voc'),
    ('book-binding-voc'),('jute-work-craft-voc'),('bamboo-crafts-artisans-voc'),
    ('spoken-english-voc'),('personality-development-voc'),('employability-skills-voc'),
    ('seed-production-technician-skill'),('four-wheeler-mechanic-skill'),('creche-and-pre-school-management-skill'),
    ('land-survey-assistant-skill'),('communication-skills-development-skill'),('dairy-technician-skill'),
    ('mobile-phone-technician-skill'),('computer-applications-skill'),('python-programming-skill'),
    ('data-science-skill'),('fire-safety-methods-skill'),('industrial-safety-skill'),
    ('pollution-control-management-skill'),('gemmology-skill'),('hotel-management-skill'),
    ('culinary-skills-skill'),('vocal-music-skill'),('cnc-machine-operation-skill'),
    ('textile-lab-technician-skill'),('unani-science-skill'),('yoga-and-naturopathy-skill'),
    ('hospital-management-skill'),('airport-management-skill'),('cabin-crew-management-skill'),
    ('banking-operations-skill'),('fashion-designing-skill'),('digital-photography-skill'),
    ('logistics-and-supply-chain-management-skill'),('port-operations-management-skill'),
    ('solar-pv-design-and-installation-skill'),('counseling-psychology-skill'),('digital-marketing-skill')
),
target_modes as (
  select id from education_modes where name in ('Vocational', 'Skill Certification')
),
extra_courses as (
  select c.id
  from courses c
  join target_modes tm on tm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from ratings r
using extra_courses ec
where r.course_id = ec.id;

with approved(slug) as (
  values
    ('horticulture-voc'),('cold-storage-technology-voc'),('plant-nursery-making-voc'),
    ('automobile-technology-voc'),('diesel-engine-technology-voc'),('petrol-engine-technology-voc'),
    ('nursery-teacher-training-voc'),('montessori-child-education-voc'),('early-childhood-care-and-education-voc'),
    ('architectural-technology-voc'),('civil-construction-supervisor-voc'),('construction-management-voc'),
    ('electrical-technology-voc'),('electrician-voc'),('air-conditioning-and-refrigeration-voc'),
    ('office-practice-management-voc'),('secretarial-practice-voc'),('personal-secretaryship-voc'),
    ('interior-designing-voc'),('interior-and-exterior-designing-voc'),('interior-design-and-visualization-voc'),
    ('dairy-technology-voc'),('dairy-products-processing-voc'),('dairy-laboratory-technician-voc'),
    ('fisheries-technology-voc'),('hatchery-operator-voc'),('ornamental-fish-cultivation-and-management-voc'),
    ('poultry-technology-voc'),('poultry-feed-technician-voc'),('poultry-management-voc'),
    ('book-binding-voc'),('jute-work-craft-voc'),('bamboo-crafts-artisans-voc'),
    ('spoken-english-voc'),('personality-development-voc'),('employability-skills-voc'),
    ('seed-production-technician-skill'),('four-wheeler-mechanic-skill'),('creche-and-pre-school-management-skill'),
    ('land-survey-assistant-skill'),('communication-skills-development-skill'),('dairy-technician-skill'),
    ('mobile-phone-technician-skill'),('computer-applications-skill'),('python-programming-skill'),
    ('data-science-skill'),('fire-safety-methods-skill'),('industrial-safety-skill'),
    ('pollution-control-management-skill'),('gemmology-skill'),('hotel-management-skill'),
    ('culinary-skills-skill'),('vocal-music-skill'),('cnc-machine-operation-skill'),
    ('textile-lab-technician-skill'),('unani-science-skill'),('yoga-and-naturopathy-skill'),
    ('hospital-management-skill'),('airport-management-skill'),('cabin-crew-management-skill'),
    ('banking-operations-skill'),('fashion-designing-skill'),('digital-photography-skill'),
    ('logistics-and-supply-chain-management-skill'),('port-operations-management-skill'),
    ('solar-pv-design-and-installation-skill'),('counseling-psychology-skill'),('digital-marketing-skill')
),
target_modes as (
  select id from education_modes where name in ('Vocational', 'Skill Certification')
),
extra_courses as (
  select c.id
  from courses c
  join target_modes tm on tm.id = c.mode_id
  left join approved a on a.slug = c.slug
  where a.slug is null
)
delete from courses c
using extra_courses ec
where c.id = ec.id;
