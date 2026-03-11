-- ==========================================================
-- Fix user_profiles admin policy recursion by using a security definer helper.
-- ==========================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'admin'
  )
$$;

drop policy if exists "Admins manage all profiles" on user_profiles;

create policy "Admins manage all profiles"
  on user_profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
