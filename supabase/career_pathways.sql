-- Career Pathways / Career Combo Offers
-- Safe add-only SQL: does not modify existing tables or delete data.

create table if not exists career_combos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  coaching_program text not null,
  degree_program text not null,
  description text not null,
  duration text not null,
  price text not null default 'Contact for Plan',
  highlight_tag text not null default 'Career Combo'
);

create index if not exists idx_career_combos_slug on career_combos(slug);

alter table career_combos enable row level security;

create policy if not exists "Public read career_combos"
  on career_combos
  for select
  using (true);

insert into career_combos (
  title,
  slug,
  coaching_program,
  degree_program,
  description,
  duration,
  price,
  highlight_tag
)
values
  (
    'UPSC Career Pathway',
    'upsc-career-pathway',
    'UPSC Training',
    'Graduation + Post Graduation',
    'Prepare for UPSC while completing your graduation and postgraduate degree with academic continuity and exam strategy support.',
    '3-5 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Chartered Accountant Pathway',
    'chartered-accountant-pathway',
    'CA Coaching',
    'BBA / BCom / BA',
    'Complete your bachelor''s degree while preparing for the Chartered Accountant exam with integrated planning for both tracks.',
    '3-4 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Company Secretary Pathway',
    'company-secretary-pathway',
    'CS Coaching',
    'BBA / BCom / BA',
    'Build a legal and corporate compliance career by combining CS preparation with a structured bachelor degree plan.',
    '3-4 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Advanced Finance Pathway',
    'advanced-finance-pathway',
    'CPA + CMA Coaching',
    'MBA / MCom',
    'Gain global finance capability by aligning CPA/CMA coaching with a masters-level management or commerce degree.',
    '2-3 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Engineering Research Pathway',
    'engineering-research-pathway',
    'GATE Coaching',
    'MCA / MSc',
    'Prepare for GATE while completing advanced technical programs and project-focused research coursework.',
    '2-3 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Chartered Accountant Advanced Pathway',
    'chartered-accountant-advanced-pathway',
    'CA Coaching',
    'MBA / MCom / MA',
    'For graduates and professionals targeting advanced business roles while pursuing CA-focused learning.',
    '2-3 Years',
    'Contact for Plan',
    'Career Combo'
  ),
  (
    'Company Secretary Advanced Pathway',
    'company-secretary-advanced-pathway',
    'CS Coaching',
    'MBA / MCom / MA',
    'Accelerate corporate law and governance outcomes with CS preparation integrated into postgraduate degree options.',
    '2-3 Years',
    'Contact for Plan',
    'Career Combo'
  )
on conflict (slug) do update
set
  title = excluded.title,
  coaching_program = excluded.coaching_program,
  degree_program = excluded.degree_program,
  description = excluded.description,
  duration = excluded.duration,
  price = excluded.price,
  highlight_tag = excluded.highlight_tag;

