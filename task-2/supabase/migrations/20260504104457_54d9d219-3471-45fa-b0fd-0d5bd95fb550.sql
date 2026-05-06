
-- Lock down SECURITY DEFINER functions: revoke from anon
revoke execute on function public.is_host_member(uuid, uuid, public.member_role) from anon;
revoke execute on function public.is_host_owner_or_member(uuid, uuid) from anon;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.handle_new_host() from anon, authenticated;
revoke execute on function public.handle_rsvp_change() from anon, authenticated;
revoke execute on function public.handle_capacity_change() from anon, authenticated;

-- Set search_path on gen_ticket_code
create or replace function public.gen_ticket_code()
returns text language sql security invoker set search_path = public as $$
  select upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8));
$$;
