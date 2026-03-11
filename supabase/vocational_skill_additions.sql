-- ==========================================================
-- VOCATIONAL + SKILL CERTIFICATION ADDITIONS (INSERT ONLY)
-- Rules:
-- - No deletes
-- - No resets
-- - No updates to online/distance mappings
-- - Idempotent inserts via ON CONFLICT DO NOTHING
-- ==========================================================

-- 1) Ensure required modes exist
insert into education_modes (name)
values
  ('Vocational'),
  ('Skill Certification')
on conflict (name) do nothing;

-- 2) Ensure Glocal University exists
insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Glocal University', 'glocal-university', 'Saharanpur, India', array['Vocational','Skill Certification'], '/logos/universities/glocal-university.jpeg', 'Industry-focused vocational and skill certification programs.')
on conflict (slug) do nothing;

-- 3) Ensure sectors required for vocational + skill data exist
insert into course_sectors (name, slug)
values
  ('Agriculture', 'agriculture'),
  ('Automobile', 'automobile'),
  ('Child Education', 'child-education'),
  ('Civil Construction', 'civil-construction'),
  ('Electrical & Electronics', 'electrical-electronics'),
  ('Office Management', 'office-management'),
  ('Interior and Exterior Design', 'interior-and-exterior-design'),
  ('Dairy Education', 'dairy-education'),
  ('Fisheries', 'fisheries'),
  ('Poultry', 'poultry'),
  ('Cottage Industry', 'cottage-industry'),
  ('Soft Skills', 'soft-skills'),
  ('Computing and Information Technology', 'computing-and-information-technology'),
  ('Fire and Safety', 'fire-and-safety'),
  ('Forest and Environmental', 'forest-and-environmental'),
  ('Gems and Jewellery', 'gems-and-jewellery'),
  ('Hotel Management and Tourism', 'hotel-management-and-tourism'),
  ('Creative Industry', 'creative-industry'),
  ('Technical Training', 'technical-training'),
  ('Textile Technology', 'textile-technology'),
  ('Unani', 'unani'),
  ('Yoga and Naturopathy', 'yoga-and-naturopathy'),
  ('Management', 'management'),
  ('Aviation', 'aviation'),
  ('Banking and Finance', 'banking-and-finance'),
  ('Fashion', 'fashion'),
  ('Media', 'media'),
  ('Logistics and Transportation', 'logistics-and-transportation'),
  ('Marine Technology', 'marine-technology'),
  ('Solar Technology', 'solar-technology'),
  ('Mental Health', 'mental-health'),
  ('Marketing', 'marketing')
on conflict (name) do nothing;

-- 4) Insert vocational + skill courses (new slugs to avoid conflicts)
with mode_ref as (
  select id, name from education_modes where name in ('Vocational', 'Skill Certification')
),
course_data as (
  select * from (values
    -- Vocational (fees fixed by level: 30k / 60k / 90k)
    ('Horticulture', 'horticulture-voc', 'Agriculture', 'Vocational', '1 year', 'Vocational horticulture training.', 30000::numeric),
    ('Cold Storage Technology', 'cold-storage-technology-voc', 'Agriculture', 'Vocational', '2 years', 'Advanced cold-chain and storage operations.', 60000::numeric),
    ('Plant Nursery Making', 'plant-nursery-making-voc', 'Agriculture', 'Vocational', '3 years', 'Bachelor vocational pathway in nursery and cultivation systems.', 90000::numeric),
    ('Automobile Technology', 'automobile-technology-voc', 'Automobile', 'Vocational', '1 year', 'Automobile systems and workshop practice.', 30000::numeric),
    ('Diesel Engine Technology', 'diesel-engine-technology-voc', 'Automobile', 'Vocational', '2 years', 'Advanced diesel service and maintenance.', 60000::numeric),
    ('Petrol Engine Technology', 'petrol-engine-technology-voc', 'Automobile', 'Vocational', '3 years', 'Bachelor vocational in engine diagnostics and automotive systems.', 90000::numeric),
    ('Nursery Teacher Training', 'nursery-teacher-training-voc', 'Child Education', 'Vocational', '1 year', 'Early childhood teaching vocational foundation.', 30000::numeric),
    ('Montessori Child Education', 'montessori-child-education-voc', 'Child Education', 'Vocational', '2 years', 'Advanced Montessori teaching practice.', 60000::numeric),
    ('Early Childhood Care and Education', 'early-childhood-care-and-education-voc', 'Child Education', 'Vocational', '3 years', 'Bachelor vocational in child care and pedagogy.', 90000::numeric),
    ('Architectural Technology', 'architectural-technology-voc', 'Civil Construction', 'Vocational', '1 year', 'Construction design basics and drafting.', 30000::numeric),
    ('Civil Construction Supervisor', 'civil-construction-supervisor-voc', 'Civil Construction', 'Vocational', '2 years', 'Advanced supervision and site operations.', 60000::numeric),
    ('Construction Management', 'construction-management-voc', 'Civil Construction', 'Vocational', '3 years', 'Bachelor vocational in construction management.', 90000::numeric),
    ('Electrical Technology', 'electrical-technology-voc', 'Electrical & Electronics', 'Vocational', '1 year', 'Electrical fundamentals and service training.', 30000::numeric),
    ('Electrician', 'electrician-voc', 'Electrical & Electronics', 'Vocational', '2 years', 'Advanced electrician training and troubleshooting.', 60000::numeric),
    ('Air Conditioning and Refrigeration', 'air-conditioning-and-refrigeration-voc', 'Electrical & Electronics', 'Vocational', '3 years', 'Bachelor vocational in HVAC and refrigeration systems.', 90000::numeric),
    ('Office Practice Management', 'office-practice-management-voc', 'Office Management', 'Vocational', '1 year', 'Office operations and clerical workflows.', 30000::numeric),
    ('Secretarial Practice', 'secretarial-practice-voc', 'Office Management', 'Vocational', '2 years', 'Advanced administrative and secretarial systems.', 60000::numeric),
    ('Personal Secretaryship', 'personal-secretaryship-voc', 'Office Management', 'Vocational', '3 years', 'Bachelor vocational in office administration.', 90000::numeric),
    ('Interior Designing', 'interior-designing-voc', 'Interior and Exterior Design', 'Vocational', '1 year', 'Interior design vocational foundation.', 30000::numeric),
    ('Interior and Exterior Designing', 'interior-and-exterior-designing-voc', 'Interior and Exterior Design', 'Vocational', '2 years', 'Advanced spatial and design application.', 60000::numeric),
    ('Interior Design and Visualization', 'interior-design-and-visualization-voc', 'Interior and Exterior Design', 'Vocational', '3 years', 'Bachelor vocational in design visualization.', 90000::numeric),
    ('Dairy Technology', 'dairy-technology-voc', 'Dairy Education', 'Vocational', '1 year', 'Dairy production and handling basics.', 30000::numeric),
    ('Dairy Products Processing', 'dairy-products-processing-voc', 'Dairy Education', 'Vocational', '2 years', 'Advanced dairy processing vocational track.', 60000::numeric),
    ('Dairy Laboratory Technician', 'dairy-laboratory-technician-voc', 'Dairy Education', 'Vocational', '3 years', 'Bachelor vocational in dairy quality systems.', 90000::numeric),
    ('Fisheries Technology', 'fisheries-technology-voc', 'Fisheries', 'Vocational', '1 year', 'Fisheries and aquaculture fundamentals.', 30000::numeric),
    ('Hatchery Operator', 'hatchery-operator-voc', 'Fisheries', 'Vocational', '2 years', 'Advanced hatchery and fish seed operations.', 60000::numeric),
    ('Ornamental Fish Cultivation and Management', 'ornamental-fish-cultivation-and-management-voc', 'Fisheries', 'Vocational', '3 years', 'Bachelor vocational in fisheries management.', 90000::numeric),
    ('Poultry Technology', 'poultry-technology-voc', 'Poultry', 'Vocational', '1 year', 'Poultry operations and health basics.', 30000::numeric),
    ('Poultry Feed Technician', 'poultry-feed-technician-voc', 'Poultry', 'Vocational', '2 years', 'Advanced poultry feed and nutrition systems.', 60000::numeric),
    ('Poultry Management', 'poultry-management-voc', 'Poultry', 'Vocational', '3 years', 'Bachelor vocational in poultry enterprise management.', 90000::numeric),
    ('Book Binding', 'book-binding-voc', 'Cottage Industry', 'Vocational', '1 year', 'Cottage industry craft and production skill.', 30000::numeric),
    ('Jute Work Craft', 'jute-work-craft-voc', 'Cottage Industry', 'Vocational', '2 years', 'Advanced jute crafts and handmade production.', 60000::numeric),
    ('Bamboo Crafts Artisans', 'bamboo-crafts-artisans-voc', 'Cottage Industry', 'Vocational', '3 years', 'Bachelor vocational in cottage enterprise crafts.', 90000::numeric),
    ('Spoken English', 'spoken-english-voc', 'Soft Skills', 'Vocational', '1 year', 'Communication and spoken English vocational training.', 30000::numeric),
    ('Personality Development', 'personality-development-voc', 'Soft Skills', 'Vocational', '2 years', 'Advanced personal and professional skills.', 60000::numeric),
    ('Employability Skills', 'employability-skills-voc', 'Soft Skills', 'Vocational', '3 years', 'Bachelor vocational in training and employability.', 90000::numeric),

    -- Skill Certification (fees 5k..25k, duration 3 months / 6 months / 1 year)
    ('Seed Production Technician', 'seed-production-technician-skill', 'Agriculture', 'Skill Certification', '6 months', 'Skill certification in seed production.', 12000::numeric),
    ('Four Wheeler Mechanic', 'four-wheeler-mechanic-skill', 'Automobile', 'Skill Certification', '6 months', 'Skill training in 4-wheeler maintenance.', 15000::numeric),
    ('Creche and Pre School Management', 'creche-and-pre-school-management-skill', 'Child Education', 'Skill Certification', '1 year', 'Child education and pre-school operations.', 18000::numeric),
    ('Land Survey Assistant', 'land-survey-assistant-skill', 'Civil Construction', 'Skill Certification', '6 months', 'Civil survey support and measurements.', 14000::numeric),
    ('Communication Skills Development', 'communication-skills-development-skill', 'Soft Skills', 'Skill Certification', '3 months', 'Communication and workplace readiness.', 9000::numeric),
    ('Dairy Technician', 'dairy-technician-skill', 'Dairy Education', 'Skill Certification', '6 months', 'Dairy plant and field technician training.', 13000::numeric),
    ('Mobile Phone Technician', 'mobile-phone-technician-skill', 'Electrical & Electronics', 'Skill Certification', '6 months', 'Mobile device repair and diagnostics.', 16000::numeric),
    ('Computer Applications', 'computer-applications-skill', 'Computing and Information Technology', 'Skill Certification', '6 months', 'Core computer applications and productivity tools.', 12000::numeric),
    ('Python Programming', 'python-programming-skill', 'Computing and Information Technology', 'Skill Certification', '1 year', 'Python programming and problem solving.', 22000::numeric),
    ('Data Science', 'data-science-skill', 'Computing and Information Technology', 'Skill Certification', '1 year', 'Applied data science and analytics.', 25000::numeric),
    ('Fire Safety Methods', 'fire-safety-methods-skill', 'Fire and Safety', 'Skill Certification', '6 months', 'Foundations of fire safety operations.', 17000::numeric),
    ('Industrial Safety', 'industrial-safety-skill', 'Fire and Safety', 'Skill Certification', '1 year', 'Industrial safety systems and compliance.', 22000::numeric),
    ('Pollution Control Management', 'pollution-control-management-skill', 'Forest and Environmental', 'Skill Certification', '6 months', 'Environmental safety and control systems.', 14000::numeric),
    ('Gemmology', 'gemmology-skill', 'Gems and Jewellery', 'Skill Certification', '6 months', 'Gem identification and grading basics.', 16000::numeric),
    ('Hotel Management', 'hotel-management-skill', 'Hotel Management and Tourism', 'Skill Certification', '1 year', 'Hotel operations and hospitality practices.', 22000::numeric),
    ('Culinary Skills', 'culinary-skills-skill', 'Hotel Management and Tourism', 'Skill Certification', '6 months', 'Kitchen and food production essentials.', 18000::numeric),
    ('Vocal Music', 'vocal-music-skill', 'Creative Industry', 'Skill Certification', '1 year', 'Creative vocal performance and training.', 12000::numeric),
    ('CNC Machine Operation', 'cnc-machine-operation-skill', 'Technical Training', 'Skill Certification', '6 months', 'CNC setup and operation training.', 20000::numeric),
    ('Textile Lab Technician', 'textile-lab-technician-skill', 'Textile Technology', 'Skill Certification', '6 months', 'Textile quality and lab workflows.', 14000::numeric),
    ('Unani Science', 'unani-science-skill', 'Unani', 'Skill Certification', '1 year', 'Foundational Unani principles and practice.', 15000::numeric),
    ('Yoga and Naturopathy', 'yoga-and-naturopathy-skill', 'Yoga and Naturopathy', 'Skill Certification', '1 year', 'Therapeutic yoga and natural wellness.', 12000::numeric),
    ('Hospital Management', 'hospital-management-skill', 'Management', 'Skill Certification', '6 months', 'Hospital operations and records management.', 21000::numeric),
    ('Airport Management', 'airport-management-skill', 'Aviation', 'Skill Certification', '6 months', 'Airport operations and ground services.', 24000::numeric),
    ('Cabin Crew Management', 'cabin-crew-management-skill', 'Aviation', 'Skill Certification', '6 months', 'Cabin crew service and safety training.', 24000::numeric),
    ('Banking Operations', 'banking-operations-skill', 'Banking and Finance', 'Skill Certification', '6 months', 'Retail banking and customer operations.', 19000::numeric),
    ('Fashion Designing', 'fashion-designing-skill', 'Fashion', 'Skill Certification', '1 year', 'Fashion fundamentals and design practice.', 22000::numeric),
    ('Digital Photography', 'digital-photography-skill', 'Media', 'Skill Certification', '6 months', 'Photography, composition, and editing.', 16000::numeric),
    ('Logistics and Supply Chain Management', 'logistics-and-supply-chain-management-skill', 'Logistics and Transportation', 'Skill Certification', '6 months', 'Supply chain and logistics process skills.', 18000::numeric),
    ('Port Operations Management', 'port-operations-management-skill', 'Marine Technology', 'Skill Certification', '6 months', 'Marine and port operation support.', 20000::numeric),
    ('Solar PV Design and Installation', 'solar-pv-design-and-installation-skill', 'Solar Technology', 'Skill Certification', '6 months', 'Solar design, installation, and maintenance.', 17000::numeric),
    ('Counseling Psychology', 'counseling-psychology-skill', 'Mental Health', 'Skill Certification', '1 year', 'Mental health counseling foundations.', 23000::numeric),
    ('Digital Marketing', 'digital-marketing-skill', 'Marketing', 'Skill Certification', '6 months', 'Digital campaigns, SEO, and analytics.', 15000::numeric)
  ) as t(name, slug, sector_name, mode_name, duration, description, fees)
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  cd.name,
  cd.slug,
  cs.id as sector_id,
  mr.id as mode_id,
  cd.duration,
  cd.description
from course_data cd
join course_sectors cs on cs.name = cd.sector_name
join mode_ref mr on mr.name = cd.mode_name
on conflict (slug) do nothing;

-- 5) Map all newly-added vocational/skill courses to Glocal University
with new_course_fees as (
  select * from (values
    ('horticulture-voc', 30000::numeric, '1 year'),
    ('cold-storage-technology-voc', 60000::numeric, '2 years'),
    ('plant-nursery-making-voc', 90000::numeric, '3 years'),
    ('automobile-technology-voc', 30000::numeric, '1 year'),
    ('diesel-engine-technology-voc', 60000::numeric, '2 years'),
    ('petrol-engine-technology-voc', 90000::numeric, '3 years'),
    ('nursery-teacher-training-voc', 30000::numeric, '1 year'),
    ('montessori-child-education-voc', 60000::numeric, '2 years'),
    ('early-childhood-care-and-education-voc', 90000::numeric, '3 years'),
    ('architectural-technology-voc', 30000::numeric, '1 year'),
    ('civil-construction-supervisor-voc', 60000::numeric, '2 years'),
    ('construction-management-voc', 90000::numeric, '3 years'),
    ('electrical-technology-voc', 30000::numeric, '1 year'),
    ('electrician-voc', 60000::numeric, '2 years'),
    ('air-conditioning-and-refrigeration-voc', 90000::numeric, '3 years'),
    ('office-practice-management-voc', 30000::numeric, '1 year'),
    ('secretarial-practice-voc', 60000::numeric, '2 years'),
    ('personal-secretaryship-voc', 90000::numeric, '3 years'),
    ('interior-designing-voc', 30000::numeric, '1 year'),
    ('interior-and-exterior-designing-voc', 60000::numeric, '2 years'),
    ('interior-design-and-visualization-voc', 90000::numeric, '3 years'),
    ('dairy-technology-voc', 30000::numeric, '1 year'),
    ('dairy-products-processing-voc', 60000::numeric, '2 years'),
    ('dairy-laboratory-technician-voc', 90000::numeric, '3 years'),
    ('fisheries-technology-voc', 30000::numeric, '1 year'),
    ('hatchery-operator-voc', 60000::numeric, '2 years'),
    ('ornamental-fish-cultivation-and-management-voc', 90000::numeric, '3 years'),
    ('poultry-technology-voc', 30000::numeric, '1 year'),
    ('poultry-feed-technician-voc', 60000::numeric, '2 years'),
    ('poultry-management-voc', 90000::numeric, '3 years'),
    ('book-binding-voc', 30000::numeric, '1 year'),
    ('jute-work-craft-voc', 60000::numeric, '2 years'),
    ('bamboo-crafts-artisans-voc', 90000::numeric, '3 years'),
    ('spoken-english-voc', 30000::numeric, '1 year'),
    ('personality-development-voc', 60000::numeric, '2 years'),
    ('employability-skills-voc', 90000::numeric, '3 years'),
    ('seed-production-technician-skill', 12000::numeric, '6 months'),
    ('four-wheeler-mechanic-skill', 15000::numeric, '6 months'),
    ('creche-and-pre-school-management-skill', 18000::numeric, '1 year'),
    ('land-survey-assistant-skill', 14000::numeric, '6 months'),
    ('communication-skills-development-skill', 9000::numeric, '3 months'),
    ('dairy-technician-skill', 13000::numeric, '6 months'),
    ('mobile-phone-technician-skill', 16000::numeric, '6 months'),
    ('computer-applications-skill', 12000::numeric, '6 months'),
    ('python-programming-skill', 22000::numeric, '1 year'),
    ('data-science-skill', 25000::numeric, '1 year'),
    ('fire-safety-methods-skill', 17000::numeric, '6 months'),
    ('industrial-safety-skill', 22000::numeric, '1 year'),
    ('pollution-control-management-skill', 14000::numeric, '6 months'),
    ('gemmology-skill', 16000::numeric, '6 months'),
    ('hotel-management-skill', 22000::numeric, '1 year'),
    ('culinary-skills-skill', 18000::numeric, '6 months'),
    ('vocal-music-skill', 12000::numeric, '1 year'),
    ('cnc-machine-operation-skill', 20000::numeric, '6 months'),
    ('textile-lab-technician-skill', 14000::numeric, '6 months'),
    ('unani-science-skill', 15000::numeric, '1 year'),
    ('yoga-and-naturopathy-skill', 12000::numeric, '1 year'),
    ('hospital-management-skill', 21000::numeric, '6 months'),
    ('airport-management-skill', 24000::numeric, '6 months'),
    ('cabin-crew-management-skill', 24000::numeric, '6 months'),
    ('banking-operations-skill', 19000::numeric, '6 months'),
    ('fashion-designing-skill', 22000::numeric, '1 year'),
    ('digital-photography-skill', 16000::numeric, '6 months'),
    ('logistics-and-supply-chain-management-skill', 18000::numeric, '6 months'),
    ('port-operations-management-skill', 20000::numeric, '6 months'),
    ('solar-pv-design-and-installation-skill', 17000::numeric, '6 months'),
    ('counseling-psychology-skill', 23000::numeric, '1 year'),
    ('digital-marketing-skill', 15000::numeric, '6 months')
  ) as t(course_slug, fees, duration)
),
glocal as (
  select id from universities where slug = 'glocal-university'
)
insert into university_courses (university_id, course_id, fees, duration)
select
  g.id,
  c.id,
  ncf.fees,
  ncf.duration
from new_course_fees ncf
join courses c on c.slug = ncf.course_slug
cross join glocal g
on conflict (university_id, course_id) do nothing;

-- 6) Students for these programs (100..4000)
insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  100 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text || 'vocskill'), 1, 8))::bit(32)::int) % 3901)
from university_courses uc
join universities u on u.id = uc.university_id and u.slug = 'glocal-university'
join courses c on c.id = uc.course_id
where c.slug like '%-voc' or c.slug like '%-skill'
on conflict (course_id, university_id) do nothing;

-- 7) Ratings for these courses (3.8..4.8)
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-rate'), 1, 8))::bit(32)::int) % 11) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
where c.slug like '%-voc' or c.slug like '%-skill'
on conflict (course_id) do nothing;

