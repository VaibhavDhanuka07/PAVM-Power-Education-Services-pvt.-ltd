create extension if not exists "pgcrypto";

create table if not exists universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  location text not null,
  mode_supported text[] not null default '{}',
  logo text,
  description text not null
);

create table if not exists education_modes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists course_sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sector_id uuid not null references course_sectors(id) on delete restrict,
  mode_id uuid not null references education_modes(id) on delete restrict,
  duration text not null,
  description text not null
);

create table if not exists university_courses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  fees numeric(12,2) not null check (fees >= 0),
  duration text not null,
  unique (university_id, course_id)
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  university_id uuid not null references universities(id) on delete cascade,
  student_count integer not null check (student_count between 100 and 5000),
  unique (course_id, university_id)
);

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null unique references courses(id) on delete cascade,
  rating numeric(2,1) not null check (rating between 3.8 and 4.8),
  review_count integer not null check (review_count between 10 and 500)
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  image text
);

create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  course_interest text not null,
  message text not null
);

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'associate', 'student', 'user')),
  created_at timestamptz not null default now()
);

create table if not exists admissions (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_by_role text not null check (created_by_role in ('associate', 'student', 'user')),
  student_user_id uuid references auth.users(id) on delete set null,
  associate_user_id uuid references auth.users(id) on delete set null,
  admission_session text not null,
  admission_type text not null check (admission_type in ('new', 'lateral_entry')),
  course_type text not null check (course_type in ('diploma', 'pg_diploma', 'ug_course', 'pg_course', 'vocational_course', 'skill_course')),
  program_mode text not null check (program_mode in ('regular', 'online', 'distance')),
  admission_level text check (admission_level in ('one_year_diploma', 'two_year_advanced_diploma', 'three_year_bachelors_degree', 'six_month_certification', 'eleven_month_diploma')),
  course_name text not null,
  stream_name text not null,
  admission_semester text not null,
  basic_details jsonb not null,
  personal_details jsonb not null,
  academic_details jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  privacy_accepted boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'accepted', 'rejected')),
  status_reason text,
  admin_notes text,
  associate_discount_amount numeric,
  associate_discount_note text,
  associate_discount_updated_at timestamptz,
  semester_fee_paid numeric,
  semester_fee_due numeric,
  fee_updated_at timestamptz,
  semester_fees jsonb not null default '[]'::jsonb,
  status_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table admissions
  add column if not exists semester_fee_paid numeric;

alter table admissions
  add column if not exists semester_fee_due numeric;

alter table admissions
  add column if not exists fee_updated_at timestamptz;

alter table admissions
  add column if not exists semester_fees jsonb not null default '[]'::jsonb;

alter table admissions
  add column if not exists associate_discount_amount numeric;

alter table admissions
  add column if not exists associate_discount_note text;

alter table admissions
  add column if not exists associate_discount_updated_at timestamptz;

create table if not exists admission_status_logs (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references admissions(id) on delete cascade,
  status text not null check (status in ('submitted', 'under_review', 'accepted', 'rejected')),
  note text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists admission_notices (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references admissions(id) on delete cascade,
  notice_type text not null check (notice_type in ('notice', 'datesheet')),
  title text not null,
  description text not null,
  file_url text,
  created_by uuid not null references auth.users(id) on delete cascade,
  visible_to_student boolean not null default true,
  visible_to_associate boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_universities_slug on universities(slug);
create index if not exists idx_courses_slug on courses(slug);
create index if not exists idx_courses_sector_id on courses(sector_id);
create index if not exists idx_courses_mode_id on courses(mode_id);
create index if not exists idx_university_courses_university_id on university_courses(university_id);
create index if not exists idx_university_courses_course_id on university_courses(course_id);
create index if not exists idx_students_university_id on students(university_id);
create index if not exists idx_students_course_id on students(course_id);
create index if not exists idx_ratings_course_id on ratings(course_id);
create index if not exists idx_blogs_slug on blogs(slug);
create index if not exists idx_user_profiles_role on user_profiles(role);
create index if not exists idx_admissions_created_by on admissions(created_by);
create index if not exists idx_admissions_student_user_id on admissions(student_user_id);
create index if not exists idx_admissions_associate_user_id on admissions(associate_user_id);
create index if not exists idx_admissions_status on admissions(status);
create index if not exists idx_admission_status_logs_admission_id on admission_status_logs(admission_id);
create index if not exists idx_admission_notices_admission_id on admission_notices(admission_id);

alter table universities enable row level security;
alter table education_modes enable row level security;
alter table course_sectors enable row level security;
alter table courses enable row level security;
alter table university_courses enable row level security;
alter table students enable row level security;
alter table ratings enable row level security;
alter table blogs enable row level security;
alter table consultations enable row level security;
alter table user_profiles enable row level security;
alter table admissions enable row level security;
alter table admission_status_logs enable row level security;
alter table admission_notices enable row level security;

create policy if not exists "Public read universities" on universities for select using (true);
create policy if not exists "Public read modes" on education_modes for select using (true);
create policy if not exists "Public read sectors" on course_sectors for select using (true);
create policy if not exists "Public read courses" on courses for select using (true);
create policy if not exists "Public read university_courses" on university_courses for select using (true);
create policy if not exists "Public read students" on students for select using (true);
create policy if not exists "Public read ratings" on ratings for select using (true);
create policy if not exists "Public read blogs" on blogs for select using (true);
create policy if not exists "Public insert consultations" on consultations for insert with check (true);
create policy if not exists "Users insert own profile" on user_profiles for insert to authenticated with check (auth.uid() = id and role in ('student', 'user'));
create policy if not exists "Users read own profile" on user_profiles for select to authenticated using (auth.uid() = id);
create policy if not exists "Admins manage all profiles"
  on user_profiles
  for all
  to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'))
  with check (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'));

create policy if not exists "Users create admissions"
  on admissions
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and created_by_role in ('associate', 'student', 'user')
  );

create policy if not exists "Users read linked admissions"
  on admissions
  for select
  to authenticated
  using (
    created_by = auth.uid()
    or student_user_id = auth.uid()
    or associate_user_id = auth.uid()
    or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy if not exists "Users update own pending admissions"
  on admissions
  for update
  to authenticated
  using (
    created_by = auth.uid()
    and status in ('submitted', 'under_review')
  )
  with check (
    created_by = auth.uid()
    and status in ('submitted', 'under_review')
  );

create policy if not exists "Admins manage all admissions"
  on admissions
  for all
  to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'))
  with check (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'));

create policy if not exists "Users read linked status logs"
  on admission_status_logs
  for select
  to authenticated
  using (
    exists (
      select 1
      from admissions a
      where a.id = admission_status_logs.admission_id
        and (
          a.created_by = auth.uid()
          or a.student_user_id = auth.uid()
          or a.associate_user_id = auth.uid()
          or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin')
        )
    )
  );

create policy if not exists "Admins manage status logs"
  on admission_status_logs
  for all
  to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'))
  with check (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'));

create policy if not exists "Users read linked notices"
  on admission_notices
  for select
  to authenticated
  using (
    exists (
      select 1
      from admissions a
      where a.id = admission_notices.admission_id
        and (
          (a.student_user_id = auth.uid() and admission_notices.visible_to_student = true)
          or (a.associate_user_id = auth.uid() and admission_notices.visible_to_associate = true)
          or a.created_by = auth.uid()
          or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin')
        )
    )
  );

create policy if not exists "Admins manage notices"
  on admission_notices
  for all
  to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'))
  with check (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'));
