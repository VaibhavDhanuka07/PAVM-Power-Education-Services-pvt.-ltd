-- Role migration: user -> student
-- Safe to run multiple times.

begin;

-- 1) Backfill existing role values
update user_profiles
set role = 'student'
where role = 'user';

update admissions
set created_by_role = 'student'
where created_by_role = 'user';

-- 2) Update role constraints/defaults
alter table user_profiles
  alter column role set default 'student';

alter table user_profiles
  drop constraint if exists user_profiles_role_check;

alter table user_profiles
  add constraint user_profiles_role_check
  check (role in ('admin', 'associate', 'student', 'user'));

alter table admissions
  drop constraint if exists admissions_created_by_role_check;

alter table admissions
  add constraint admissions_created_by_role_check
  check (created_by_role in ('associate', 'student', 'user'));

-- 3) Refresh policies to accept canonical student role (and legacy user)
drop policy if exists "Users insert own profile" on user_profiles;
create policy "Users insert own profile"
  on user_profiles
  for insert
  to authenticated
  with check (auth.uid() = id and role in ('student', 'user'));

drop policy if exists "Users create admissions" on admissions;
create policy "Users create admissions"
  on admissions
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and created_by_role in ('associate', 'student', 'user')
  );

commit;
