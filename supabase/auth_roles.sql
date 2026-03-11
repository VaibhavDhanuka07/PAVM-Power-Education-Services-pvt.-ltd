-- Auth Roles Setup
-- Run this in Supabase SQL editor to enable login/signup role flow:
-- Roles: admin, associate, student

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'associate', 'student', 'user')),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_role on user_profiles(role);

alter table user_profiles enable row level security;

create policy if not exists "Users insert own profile"
  on user_profiles
  for insert
  to authenticated
  with check (auth.uid() = id and role in ('student', 'user'));

create policy if not exists "Users read own profile"
  on user_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy if not exists "Admins manage all profiles"
  on user_profiles
  for all
  to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'))
  with check (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'));

-- Make first admin manually (replace with your email):
-- update user_profiles
-- set role = 'admin'
-- where email = 'your-admin-email@example.com';
