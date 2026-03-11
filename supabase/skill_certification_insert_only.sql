-- ==========================================================
-- SKILL CERTIFICATION INSERT-ONLY PATCH
-- Safe rules:
-- - No deletes
-- - No schema changes
-- - No online/distance/vocational modifications
-- - Only add Skill Certification domains + courses + mappings
-- ==========================================================

-- STEP 1: ensure mode exists
insert into education_modes (name)
values ('Skill Certification')
on conflict (name) do nothing;

-- STEP 2: ensure university exists
insert into universities (name, slug, location, mode_supported, logo, description)
values
  (
    'Glocal University',
    'glocal-university',
    'Saharanpur, India',
    array['Vocational', 'Skill Certification'],
    '/logos/universities/glocal-university.jpeg',
    'Skill certification and vocational programs across multiple domains.'
  )
on conflict (slug) do nothing;

-- STEP 3: ensure 40 domains
with domains(name, slug) as (
  values
    ('Agriculture', 'agriculture'),
    ('Automobile', 'automobile'),
    ('Child Education', 'child-education'),
    ('Civil Construction', 'civil-construction'),
    ('Soft Skills', 'soft-skills'),
    ('Dairy Education', 'dairy-education'),
    ('Electrical and Electronics', 'electrical-and-electronics'),
    ('Fisheries', 'fisheries'),
    ('Home Maintenance', 'home-maintenance'),
    ('Cottage Industry', 'cottage-industry'),
    ('Interior and Exterior Design', 'interior-and-exterior-design'),
    ('Office Management', 'office-management'),
    ('Poultry', 'poultry'),
    ('Acupuncture', 'acupuncture'),
    ('Ayurveda', 'ayurveda'),
    ('Beauty and Wellness', 'beauty-and-wellness'),
    ('Computing and Information Technology', 'computing-and-information-technology'),
    ('Fire and Safety', 'fire-and-safety'),
    ('Forest and Environmental', 'forest-and-environmental'),
    ('Gems and Jewellery', 'gems-and-jewellery'),
    ('Geo Information Systems', 'geo-information-systems'),
    ('Hotel Management and Tourism', 'hotel-management-and-tourism'),
    ('Language Studies', 'language-studies'),
    ('Creative Industry', 'creative-industry'),
    ('Siddha Medicine', 'siddha-medicine'),
    ('Sports', 'sports'),
    ('Technical Training', 'technical-training'),
    ('Textile Technology', 'textile-technology'),
    ('Unani Medicine', 'unani-medicine'),
    ('Yoga and Naturopathy', 'yoga-and-naturopathy'),
    ('Management', 'management'),
    ('Aviation', 'aviation'),
    ('Banking and Finance', 'banking-and-finance'),
    ('Fashion Design', 'fashion-design'),
    ('Media and Film', 'media-and-film'),
    ('Logistics and Transportation', 'logistics-and-transportation'),
    ('Marine Technology', 'marine-technology'),
    ('Solar Technology', 'solar-technology'),
    ('Mental Health', 'mental-health'),
    ('Marketing', 'marketing')
)
insert into course_sectors (name, slug)
select d.name, d.slug
from domains d
on conflict (slug) do nothing;

-- STEP 4 + 5:
-- Add base skill topics per domain, then create:
-- - Certificate in X (6 Months, 6000)
-- - Diploma in X (11 Months, 10000)
with base_courses(sector_name, topic) as (
  values
    -- Agriculture
    ('Agriculture', 'Horticulture Technician'),
    ('Agriculture', 'Plant Protection Assistant'),
    ('Agriculture', 'Seed Production Technician'),
    ('Agriculture', 'Mushroom Cultivation'),
    ('Agriculture', 'Organic Farming Techniques'),

    -- Automobile
    ('Automobile', 'Automobile Service Technician'),
    ('Automobile', 'Two Wheeler Mechanic'),
    ('Automobile', 'Car AC Technician'),
    ('Automobile', 'Diesel Engine Service Technician'),

    -- Child Education
    ('Child Education', 'Nursery Teacher Training'),
    ('Child Education', 'Montessori Teaching'),
    ('Child Education', 'Early Childhood Education'),
    ('Child Education', 'Preschool Teaching Assistant'),

    -- Civil Construction
    ('Civil Construction', 'Civil Construction Supervisor'),
    ('Civil Construction', 'Land Survey Assistant'),
    ('Civil Construction', 'Building Design Technician'),
    ('Civil Construction', 'Construction Management Assistant'),

    -- Soft Skills
    ('Soft Skills', 'Spoken English'),
    ('Soft Skills', 'Communication Skills Development'),
    ('Soft Skills', 'Personality Development'),
    ('Soft Skills', 'Employability Skills'),

    -- Dairy Education
    ('Dairy Education', 'Dairy Technology'),
    ('Dairy Education', 'Dairy Laboratory Technician'),
    ('Dairy Education', 'Milk Chilling Centre Technician'),

    -- Electrical and Electronics
    ('Electrical and Electronics', 'Electrical Technology'),
    ('Electrical and Electronics', 'Mobile Phone Technician'),
    ('Electrical and Electronics', 'Electrician'),
    ('Electrical and Electronics', 'Air Conditioning and Refrigeration'),

    -- Fisheries
    ('Fisheries', 'Fisheries Technology'),
    ('Fisheries', 'Hatchery Operator'),
    ('Fisheries', 'Fish Feed Technician'),

    -- Home Maintenance
    ('Home Maintenance', 'Home Maintenance Technician'),
    ('Home Maintenance', 'Domestic House Keeping'),
    ('Home Maintenance', 'Home Management and Geriatric Care'),

    -- Cottage Industry
    ('Cottage Industry', 'Book Binding'),
    ('Cottage Industry', 'Terracotta Work'),
    ('Cottage Industry', 'Bamboo Crafts Artisans'),

    -- Interior and Exterior Design
    ('Interior and Exterior Design', 'Interior Designing'),
    ('Interior and Exterior Design', 'Exterior Designing'),
    ('Interior and Exterior Design', 'Interior Design and Visualization'),

    -- Office Management
    ('Office Management', 'Office Practice Management'),
    ('Office Management', 'Secretarial Practice'),
    ('Office Management', 'Office Computer Operator'),

    -- Poultry
    ('Poultry', 'Poultry Technology'),
    ('Poultry', 'Poultry Feed Technician'),
    ('Poultry', 'Poultry Farm Supervisor'),

    -- Acupuncture
    ('Acupuncture', 'Acupuncture Therapy'),
    ('Acupuncture', 'Acupressure'),
    ('Acupuncture', 'Sujok Acupuncture'),

    -- Ayurveda
    ('Ayurveda', 'Ayurveda Patient Care'),
    ('Ayurveda', 'Panchakarma Therapy'),
    ('Ayurveda', 'Ayurvedic Cosmetology'),

    -- Beauty and Wellness
    ('Beauty and Wellness', 'Cosmetology and Beauty Parlour Management'),
    ('Beauty and Wellness', 'Hair Styling'),
    ('Beauty and Wellness', 'Nail Technology'),

    -- Computing and Information Technology
    ('Computing and Information Technology', 'Computer Applications'),
    ('Computing and Information Technology', 'Data Entry Operator'),
    ('Computing and Information Technology', 'Web Designing'),
    ('Computing and Information Technology', 'Java Programming'),
    ('Computing and Information Technology', 'Python Programming'),
    ('Computing and Information Technology', 'Digital Marketing'),
    ('Computing and Information Technology', 'UI UX Design'),
    ('Computing and Information Technology', 'Graphic Design'),
    ('Computing and Information Technology', 'Animation'),

    -- Fire and Safety
    ('Fire and Safety', 'Fire Safety Technician'),
    ('Fire and Safety', 'Industrial Safety Assistant'),
    ('Fire and Safety', 'Construction Safety Technician'),
    ('Fire and Safety', 'Environmental Safety Officer'),

    -- Forest and Environmental
    ('Forest and Environmental', 'Pollution Control Management'),
    ('Forest and Environmental', 'Sustainable Environmental Management'),
    ('Forest and Environmental', 'Agro Forest Processing Technician'),

    -- Gems and Jewellery
    ('Gems and Jewellery', 'Gemmology'),
    ('Gems and Jewellery', 'Jewellery Appraiser'),
    ('Gems and Jewellery', 'Diamond Grading'),

    -- Geo Information Systems
    ('Geo Information Systems', 'Geographic Information System'),
    ('Geo Information Systems', 'GPS Navigation System'),
    ('Geo Information Systems', 'Remote Sensing and GIS Technology'),

    -- Hotel Management and Tourism
    ('Hotel Management and Tourism', 'Hotel Management Assistant'),
    ('Hotel Management and Tourism', 'Food Production Technician'),
    ('Hotel Management and Tourism', 'Front Office Executive'),
    ('Hotel Management and Tourism', 'Bakery and Confectionery Technician'),

    -- Language Studies
    ('Language Studies', 'English Communication'),
    ('Language Studies', 'German Language'),
    ('Language Studies', 'French Language'),

    -- Creative Industry
    ('Creative Industry', 'Vocal Music'),
    ('Creative Industry', 'Visual Communication'),
    ('Creative Industry', 'Digital Photography'),

    -- Siddha Medicine
    ('Siddha Medicine', 'Siddha Patient Care Assistant'),
    ('Siddha Medicine', 'Herbal Siddha Medicine'),
    ('Siddha Medicine', 'Traditional Health Practices'),

    -- Sports
    ('Sports', 'Sports Management'),
    ('Sports', 'Adventure Sports Trainer'),
    ('Sports', 'Physical Education'),

    -- Technical Training
    ('Technical Training', 'CNC Machine Operation'),
    ('Technical Training', 'Welding Technology'),
    ('Technical Training', 'Industrial Automation'),

    -- Textile Technology
    ('Textile Technology', 'Textile Technology'),
    ('Textile Technology', 'Textile Lab Technician'),
    ('Textile Technology', 'Yarn Making'),

    -- Unani Medicine
    ('Unani Medicine', 'Unani Science'),
    ('Unani Medicine', 'Unani Pharmacy'),
    ('Unani Medicine', 'Hijama Therapy'),

    -- Yoga and Naturopathy
    ('Yoga and Naturopathy', 'Yoga and Naturopathy'),
    ('Yoga and Naturopathy', 'Yoga Teacher Education'),
    ('Yoga and Naturopathy', 'Therapeutic Yoga'),

    -- Management
    ('Management', 'Human Resource Assistant'),
    ('Management', 'Retail Management'),
    ('Management', 'Customer Relationship Management'),
    ('Management', 'Project Management Assistant'),

    -- Aviation
    ('Aviation', 'Airport Ground Staff'),
    ('Aviation', 'Airline Ticketing Executive'),
    ('Aviation', 'Cabin Crew Assistant'),

    -- Banking and Finance
    ('Banking and Finance', 'Banking Operations'),
    ('Banking and Finance', 'Financial Accounting'),
    ('Banking and Finance', 'Investment Banking Basics'),

    -- Fashion Design
    ('Fashion Design', 'Fashion Designing'),
    ('Fashion Design', 'Apparel Pattern Making'),
    ('Fashion Design', 'Tailoring and Garment Construction'),

    -- Media and Film
    ('Media and Film', 'Digital Cinematography'),
    ('Media and Film', 'Film Editing'),
    ('Media and Film', 'Radio Jockey'),

    -- Logistics and Transportation
    ('Logistics and Transportation', 'Logistics and Supply Chain'),
    ('Logistics and Transportation', 'Warehouse Management'),
    ('Logistics and Transportation', 'Fleet Management'),

    -- Marine Technology
    ('Marine Technology', 'Port Operations Management'),
    ('Marine Technology', 'Ship Safety Management'),
    ('Marine Technology', 'Marine Diesel Engineering'),

    -- Solar Technology
    ('Solar Technology', 'Solar Technology'),
    ('Solar Technology', 'Solar PV Design and Installation'),
    ('Solar Technology', 'Solar Plant Maintenance'),

    -- Mental Health
    ('Mental Health', 'Counseling Psychology'),
    ('Mental Health', 'Guidance and Counselling'),
    ('Mental Health', 'Cognitive Behaviour Therapy'),

    -- Marketing
    ('Marketing', 'Digital Marketing'),
    ('Marketing', 'Sales and Marketing'),
    ('Marketing', 'Marketing Analytics'),
    ('Marketing', 'Brand Management')
),
course_levels(prefix, duration, fees, suffix) as (
  values
    ('Certificate in ', '6 Months', 6000::numeric, 'cert'),
    ('Diploma in ', '11 Months', 10000::numeric, 'dip')
),
skill_mode as (
  select id from education_modes where name = 'Skill Certification'
),
expanded as (
  select
    bc.sector_name,
    bc.topic,
    cl.prefix || bc.topic as course_name,
    cl.duration as course_duration,
    cl.fees as course_fees,
    lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            bc.sector_name || '-' || bc.topic || '-' || cl.suffix || '-skill',
            '&',
            ' and ',
            'gi'
          ),
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '(^-+)|(-+$)',
        '',
        'g'
      )
    ) as course_slug
  from base_courses bc
  cross join course_levels cl
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  e.course_name,
  e.course_slug,
  cs.id,
  sm.id,
  e.course_duration,
  'Skill certification in ' || e.sector_name || ': ' || e.topic
from expanded e
join course_sectors cs on cs.name = e.sector_name
cross join skill_mode sm
on conflict (slug) do nothing;

-- STEP 6/7 map to Glocal for card display (fees + duration)
with glocal as (
  select id from universities where slug = 'glocal-university'
),
skill_courses as (
  select
    c.id,
    c.duration,
    case
      when c.slug like '%-cert-skill' then 6000::numeric
      when c.slug like '%-dip-skill' then 10000::numeric
      else 6000::numeric
    end as fees
  from courses c
  join education_modes m on m.id = c.mode_id
  where m.name = 'Skill Certification'
    and (c.slug like '%-cert-skill' or c.slug like '%-dip-skill')
)
insert into university_courses (university_id, course_id, fees, duration)
select g.id, sc.id, sc.fees, sc.duration
from glocal g
join skill_courses sc on true
on conflict (university_id, course_id) do nothing;

-- STEP 8 insert enrollment (schema allows minimum 100)
with target as (
  select uc.course_id, uc.university_id
  from university_courses uc
  join universities u on u.id = uc.university_id
  join courses c on c.id = uc.course_id
  where u.slug = 'glocal-university'
    and (c.slug like '%-cert-skill' or c.slug like '%-dip-skill')
)
insert into students (course_id, university_id, student_count)
select
  t.course_id,
  t.university_id,
  100 + (abs(('x' || substr(md5(t.course_id::text || t.university_id::text || 'skill-enroll'), 1, 8))::bit(32)::int) % 1401)
from target t
on conflict (course_id, university_id) do nothing;

-- STEP 8 insert ratings 3.8..4.7
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-rate'), 1, 8))::bit(32)::int) % 10) / 10.0))::numeric, 1),
  25 + (abs(('x' || substr(md5(c.slug || '-reviews'), 1, 8))::bit(32)::int) % 326)
from courses c
where c.slug like '%-cert-skill' or c.slug like '%-dip-skill'
on conflict (course_id) do nothing;

-- Optional verification
-- select count(*) as skill_courses
-- from courses c join education_modes m on m.id = c.mode_id
-- where m.name = 'Skill Certification';
