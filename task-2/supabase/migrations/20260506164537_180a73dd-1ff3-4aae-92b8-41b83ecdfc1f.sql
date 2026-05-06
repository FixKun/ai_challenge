
-- Helper: is the user a member (host OR checker) of the event's host?
create or replace function public.is_event_staff(_event_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.events e
    join public.host_members m on m.host_id = e.host_id
    where e.id = _event_id and m.user_id = _user_id
  );
$$;
revoke execute on function public.is_event_staff(uuid, uuid) from anon;

-- Public aggregate counts (safe to expose, no PII)
create or replace function public.event_counts(_event_id uuid)
returns table(going int, waitlist int, checked_in int)
language sql stable security definer set search_path = public as $$
  select
    count(*) filter (where status in ('going','checked_in'))::int,
    count(*) filter (where status = 'waitlist')::int,
    count(*) filter (where status = 'checked_in')::int
  from public.rsvps where event_id = _event_id;
$$;
grant execute on function public.event_counts(uuid) to anon, authenticated;

-- Allow Checkers (in addition to Hosts) to see and update RSVPs for check-in
drop policy if exists "Host members see event rsvps" on public.rsvps;
create policy "Event staff see event rsvps" on public.rsvps for select
  using (public.is_event_staff(event_id, auth.uid()));

drop policy if exists "Host members update rsvps for checkin" on public.rsvps;
create policy "Event staff update rsvps for checkin" on public.rsvps for update
  using (public.is_event_staff(event_id, auth.uid()));

-- Realtime so counters update live everywhere
alter publication supabase_realtime add table public.rsvps;
