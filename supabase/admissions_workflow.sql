-- Admissions workflow tables + RLS
-- Run this in Supabase SQL editor after existing schema.

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
  status_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists idx_admissions_created_by on admissions(created_by);
create index if not exists idx_admissions_student_user_id on admissions(student_user_id);
create index if not exists idx_admissions_associate_user_id on admissions(associate_user_id);
create index if not exists idx_admissions_status on admissions(status);
create index if not exists idx_admission_status_logs_admission_id on admission_status_logs(admission_id);
create index if not exists idx_admission_notices_admission_id on admission_notices(admission_id);

alter table admissions enable row level security;
alter table admission_status_logs enable row level security;
alter table admission_notices enable row level security;

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
