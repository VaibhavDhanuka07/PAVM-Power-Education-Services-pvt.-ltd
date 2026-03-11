-- ==========================================================
-- SKILL CERTIFICATION DOMAIN ADDITIONS (INSERT ONLY)
-- No deletes. No resets. No modifications to online/distance/vocational.
-- ==========================================================

-- 1) Ensure mode exists
insert into education_modes (name)
values ('Skill Certification')
on conflict (name) do nothing;

-- 2) Ensure Glocal exists
insert into universities (name, slug, location, mode_supported, logo, description)
values
  ('Glocal University', 'glocal-university', 'Saharanpur, India', array['Vocational','Skill Certification'], '/logos/universities/glocal-university.jpeg', 'Industry-focused vocational and skill certification programs.')
on conflict (slug) do nothing;

-- 3) Insert 40 domains (course_sectors)
insert into course_sectors (name, slug)
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
on conflict (slug) do nothing;

-- 4) Insert courses under each domain
-- Rule: for each base course create:
--   Certificate in X -> 6 Months, 6000
--   Diploma in X     -> 11 Months, 10000
with base_courses as (
  select * from (values
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
    -- Dairy
    ('Dairy Education', 'Dairy Technology'),
    ('Dairy Education', 'Dairy Laboratory Technician'),
    ('Dairy Education', 'Milk Chilling Centre Technician'),
    -- Electrical
    ('Electrical and Electronics', 'Electrical Technology'),
    ('Electrical and Electronics', 'Mobile Phone Technician'),
    ('Electrical and Electronics', 'Radio and Television Service'),
    ('Electrical and Electronics', 'Electrician'),
    ('Electrical and Electronics', 'Air Conditioning and Refrigeration'),
    -- Fisheries
    ('Fisheries', 'Fisheries Technology'),
    ('Fisheries', 'Fisheries Laboratory Technician'),
    ('Fisheries', 'Hatchery Operator'),
    -- Home
    ('Home Maintenance', 'Home Maintenance Technician'),
    ('Home Maintenance', 'Domestic House Keeping'),
    ('Home Maintenance', 'Home Management and Geriatric Care'),
    -- Cottage
    ('Cottage Industry', 'Book Binding'),
    ('Cottage Industry', 'Jute Craft'),
    ('Cottage Industry', 'Bamboo Crafts Artisans'),
    -- Interior
    ('Interior and Exterior Design', 'Interior Designing'),
    ('Interior and Exterior Design', 'Interior and Exterior Designing'),
    ('Interior and Exterior Design', 'Landscaping Technician'),
    -- Office
    ('Office Management', 'Office Practice Management'),
    ('Office Management', 'Secretarial Practice'),
    ('Office Management', 'Office Computer Operator'),
    -- Poultry
    ('Poultry', 'Poultry Technology'),
    ('Poultry', 'Poultry Feed Technician'),
    ('Poultry', 'Hatchery Technician'),
    -- Acupuncture
    ('Acupuncture', 'Acupuncture Therapy'),
    ('Acupuncture', 'Acupressure'),
    ('Acupuncture', 'Sujok Acupuncture'),
    -- Ayurveda
    ('Ayurveda', 'Ayurveda Patient Care'),
    ('Ayurveda', 'Panchakarma Therapy'),
    ('Ayurveda', 'Ayurvedic Cosmetology'),
    -- Beauty
    ('Beauty and Wellness', 'Cosmetology and Beauty Parlour Management'),
    ('Beauty and Wellness', 'Hair Styling'),
    ('Beauty and Wellness', 'Nail Technology'),
    -- Computing (includes PDF names)
    ('Computing and Information Technology', 'Computer Applications'),
    ('Computing and Information Technology', 'Software Applications'),
    ('Computing and Information Technology', 'Computer Science'),
    ('Computing and Information Technology', 'Web Designing'),
    ('Computing and Information Technology', 'Multimedia'),
    ('Computing and Information Technology', 'Data Entry Operator'),
    ('Computing and Information Technology', 'Java Programming'),
    ('Computing and Information Technology', 'Python Programming'),
    ('Computing and Information Technology', 'C Programming'),
    ('Computing and Information Technology', 'Visual Basic'),
    ('Computing and Information Technology', '.NET Programming'),
    ('Computing and Information Technology', 'SAP'),
    ('Computing and Information Technology', 'Tally ERP'),
    ('Computing and Information Technology', 'Digital Marketing'),
    ('Computing and Information Technology', 'UI UX Design'),
    ('Computing and Information Technology', 'Game Design'),
    ('Computing and Information Technology', 'Data Science'),
    ('Computing and Information Technology', '3D Animation'),
    ('Computing and Information Technology', 'Computer Hardware Maintenance and Networking'),
    ('Computing and Information Technology', 'Laptop Hardware and WiFi Technology'),
    -- Fire and Safety
    ('Fire and Safety', 'Fire Safety Technician'),
    ('Fire and Safety', 'Industrial Safety Assistant'),
    ('Fire and Safety', 'Construction Safety Technician'),
    ('Fire and Safety', 'Environmental Safety Officer'),
    ('Fire and Safety', 'Health and Safety Engineering'),
    -- Forest
    ('Forest and Environmental', 'Pollution Control Management'),
    ('Forest and Environmental', 'Sustainable Environmental Management'),
    ('Forest and Environmental', 'Agro Forest Processing Technician'),
    -- Gems
    ('Gems and Jewellery', 'Gemmology'),
    ('Gems and Jewellery', 'Jewellery Appraiser'),
    ('Gems and Jewellery', 'Diamond Grading'),
    -- GIS
    ('Geo Information Systems', 'Geographic Information System'),
    ('Geo Information Systems', 'GPS Navigation System'),
    ('Geo Information Systems', 'Remote Sensing and GIS Technology'),
    -- Hotel
    ('Hotel Management and Tourism', 'Hotel Management Assistant'),
    ('Hotel Management and Tourism', 'Food Production Technician'),
    ('Hotel Management and Tourism', 'Front Office Executive'),
    ('Hotel Management and Tourism', 'Bakery and Confectionery Technician'),
    ('Hotel Management and Tourism', 'Culinary Skills'),
    -- Language
    ('Language Studies', 'English Communication'),
    ('Language Studies', 'German Language'),
    ('Language Studies', 'French Language'),
    -- Creative
    ('Creative Industry', 'Vocal Music'),
    ('Creative Industry', 'Digital Photography'),
    ('Creative Industry', 'Visual Communication'),
    -- Siddha
    ('Siddha Medicine', 'Siddha Patient Care Assistant'),
    ('Siddha Medicine', 'Herbal Siddha Medicine'),
    ('Siddha Medicine', 'Traditional Health Practices'),
    -- Sports
    ('Sports', 'Sports Management'),
    ('Sports', 'Adventure Sports Trainer'),
    ('Sports', 'Physical Education'),
    -- Technical
    ('Technical Training', 'CNC Machine Operation'),
    ('Technical Training', 'Welding Technology'),
    ('Technical Training', 'Industrial Automation'),
    -- Textile
    ('Textile Technology', 'Textile Technology'),
    ('Textile Technology', 'Textile Lab Technician'),
    ('Textile Technology', 'Yarn Making'),
    -- Unani
    ('Unani Medicine', 'Unani Science'),
    ('Unani Medicine', 'Unani Pharmacy'),
    ('Unani Medicine', 'Hijama Therapy'),
    -- Yoga
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
    ('Aviation', 'Air Cargo Management'),
    ('Aviation', 'Air Hostess Training'),
    -- Banking
    ('Banking and Finance', 'Banking Operations'),
    ('Banking and Finance', 'Investment Banking Basics'),
    ('Banking and Finance', 'Financial Accounting'),
    -- Fashion
    ('Fashion Design', 'Fashion Designing'),
    ('Fashion Design', 'Apparel Pattern Making'),
    ('Fashion Design', 'Tailoring and Garment Construction'),
    -- Media
    ('Media and Film', 'Digital Cinematography'),
    ('Media and Film', 'Film Editing'),
    ('Media and Film', 'Radio Jockey'),
    -- Logistics
    ('Logistics and Transportation', 'Logistics and Supply Chain'),
    ('Logistics and Transportation', 'Warehouse Management'),
    ('Logistics and Transportation', 'Fleet Management'),
    -- Marine
    ('Marine Technology', 'Port Operations Management'),
    ('Marine Technology', 'Ship Safety Management'),
    ('Marine Technology', 'Marine Diesel Engineering'),
    -- Solar
    ('Solar Technology', 'Solar Technology'),
    ('Solar Technology', 'Solar PV Design and Installation'),
    ('Solar Technology', 'Solar Plant Maintenance'),
    -- Mental
    ('Mental Health', 'Counseling Psychology'),
    ('Mental Health', 'Guidance and Counselling'),
    ('Mental Health', 'Cognitive Behaviour Therapy'),
    -- Marketing
    ('Marketing', 'Digital Marketing'),
    ('Marketing', 'Sales and Marketing'),
    ('Marketing', 'Marketing Analytics'),
    ('Marketing', 'Brand Management')
  ) as t(sector_name, base_course_name)
),
levels as (
  select * from (values
    ('Certificate in ', '6 Months', 6000::numeric, 'cert'),
    ('Diploma in ', '11 Months', 10000::numeric, 'dip')
  ) as l(prefix, duration, fees, suffix)
),
mode_ref as (
  select id from education_modes where name = 'Skill Certification'
),
expanded as (
  select
    l.prefix || bc.base_course_name as course_name,
    lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            bc.base_course_name || '-' || l.suffix || '-skill',
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
    ) as course_slug,
    bc.sector_name,
    l.duration,
    l.fees
  from base_courses bc
  cross join levels l
)
insert into courses (name, slug, sector_id, mode_id, duration, description)
select
  e.course_name,
  e.course_slug,
  cs.id,
  mr.id,
  e.duration,
  'Skill certification program in ' || e.sector_name || ': ' || e.course_name
from expanded e
join course_sectors cs on cs.name = e.sector_name
cross join mode_ref mr
on conflict (slug) do nothing;

-- 5) Map these skill courses to Glocal
with glocal as (
  select id from universities where slug = 'glocal-university'
),
skill_courses as (
  select c.id, c.slug, c.duration,
    case
      when c.slug like '%-cert-skill' then 6000::numeric
      when c.slug like '%-dip-skill' then 10000::numeric
      else 8000::numeric
    end as fees
  from courses c
  join education_modes m on m.id = c.mode_id
  where m.name = 'Skill Certification'
    and (c.slug like '%-cert-skill' or c.slug like '%-dip-skill')
)
insert into university_courses (university_id, course_id, fees, duration)
select g.id, sc.id, sc.fees, sc.duration
from skill_courses sc
cross join glocal g
on conflict (university_id, course_id) do nothing;

-- 8) Enrollment: 50..1500
insert into students (course_id, university_id, student_count)
select
  uc.course_id,
  uc.university_id,
  50 + (abs(('x' || substr(md5(uc.course_id::text || uc.university_id::text || 'skill-domain'), 1, 8))::bit(32)::int) % 1451)
from university_courses uc
join universities u on u.id = uc.university_id and u.slug = 'glocal-university'
join courses c on c.id = uc.course_id
where c.slug like '%-cert-skill' or c.slug like '%-dip-skill'
on conflict (course_id, university_id) do update
set student_count = excluded.student_count;

-- Ratings: 3.8..4.7
insert into ratings (course_id, rating, review_count)
select
  c.id,
  round((3.8 + ((abs(('x' || substr(md5(c.slug || '-skill-rate'), 1, 8))::bit(32)::int) % 10) / 10.0))::numeric, 1),
  10 + (abs(('x' || substr(md5(c.slug || '-skill-reviews'), 1, 8))::bit(32)::int) % 491)
from courses c
where c.slug like '%-cert-skill' or c.slug like '%-dip-skill'
on conflict (course_id) do update
set
  rating = excluded.rating,
  review_count = excluded.review_count;
