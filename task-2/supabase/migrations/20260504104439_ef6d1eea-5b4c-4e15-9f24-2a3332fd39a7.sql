
-- ============ ENUMS ============
create type public.member_role as enum ('host', 'checker');
create type public.event_visibility as enum ('public', 'unlisted');
create type public.event_status as enum ('draft', 'published');
create type public.rsvp_status as enum ('going', 'waitlist', 'cancelled', 'checked_in');
create type public.report_target as enum ('event', 'photo');
create type public.report_status as enum ('open', 'hidden', 'dismissed');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles readable by everyone" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ HOSTS ============
create table public.hosts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  bio text not null default '',
  logo_url text,
  contact_email text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.hosts enable row level security;

create table public.host_members (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null,
  created_at timestamptz not null default now(),
  unique (host_id, user_id)
);
alter table public.host_members enable row level security;

-- Security definer helper to avoid recursive RLS
create or replace function public.is_host_member(_host_id uuid, _user_id uuid, _role public.member_role default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.host_members
    where host_id = _host_id and user_id = _user_id
      and (_role is null or role = _role or role = 'host')
  );
$$;

create or replace function public.is_host_owner_or_member(_host_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.hosts where id = _host_id and owner_id = _user_id
  ) or exists (
    select 1 from public.host_members where host_id = _host_id and user_id = _user_id and role = 'host'
  );
$$;

create policy "Hosts readable by everyone" on public.hosts for select using (true);
create policy "Users create own hosts" on public.hosts for insert with check (auth.uid() = owner_id);
create policy "Owners update host" on public.hosts for update using (auth.uid() = owner_id or public.is_host_owner_or_member(id, auth.uid()));
create policy "Owners delete host" on public.hosts for delete using (auth.uid() = owner_id);

-- Auto-add owner as host member
create or replace function public.handle_new_host()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.host_members (host_id, user_id, role) values (new.id, new.owner_id, 'host');
  return new;
end;
$$;
create trigger on_host_created after insert on public.hosts
  for each row execute function public.handle_new_host();

create policy "Members readable by host members and self" on public.host_members for select
  using (user_id = auth.uid() or public.is_host_owner_or_member(host_id, auth.uid()));
create policy "Host managers add members" on public.host_members for insert
  with check (public.is_host_owner_or_member(host_id, auth.uid()) or user_id = auth.uid());
create policy "Host managers remove members" on public.host_members for delete
  using (public.is_host_owner_or_member(host_id, auth.uid()) or user_id = auth.uid());

-- ============ EVENTS ============
create table public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'UTC',
  venue text not null default '',
  online_url text,
  capacity int not null default 50 check (capacity > 0),
  cover_url text,
  visibility public.event_visibility not null default 'public',
  status public.event_status not null default 'draft',
  is_paid boolean not null default false,
  hidden boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create index events_host_idx on public.events(host_id);
create index events_starts_idx on public.events(starts_at);

create policy "Public events readable" on public.events for select
  using (
    (status = 'published' and not hidden)
    or public.is_host_owner_or_member(host_id, auth.uid())
  );
create policy "Host members create events" on public.events for insert
  with check (public.is_host_owner_or_member(host_id, auth.uid()) and created_by = auth.uid());
create policy "Host members update events" on public.events for update
  using (public.is_host_owner_or_member(host_id, auth.uid()));
create policy "Host members delete events" on public.events for delete
  using (public.is_host_owner_or_member(host_id, auth.uid()));

-- ============ RSVPS ============
create or replace function public.gen_ticket_code()
returns text language sql as $$
  select upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8));
$$;

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.rsvp_status not null default 'going',
  code text not null unique default public.gen_ticket_code(),
  waitlist_position int,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table public.rsvps enable row level security;
create index rsvps_event_status_idx on public.rsvps(event_id, status);

create policy "Users see own rsvps" on public.rsvps for select using (user_id = auth.uid());
create policy "Host members see event rsvps" on public.rsvps for select
  using (exists (select 1 from public.events e where e.id = event_id and public.is_host_owner_or_member(e.host_id, auth.uid())));
create policy "Users create own rsvp" on public.rsvps for insert with check (user_id = auth.uid());
create policy "Users update own rsvp" on public.rsvps for update using (user_id = auth.uid());
create policy "Host members update rsvps for checkin" on public.rsvps for update
  using (exists (select 1 from public.events e where e.id = event_id and public.is_host_owner_or_member(e.host_id, auth.uid())));

-- Capacity enforcement + waitlist promotion trigger
create or replace function public.handle_rsvp_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  cap int;
  going_count int;
  next_waitlist record;
begin
  select capacity into cap from public.events where id = coalesce(new.event_id, old.event_id);

  -- On INSERT: assign waitlist if full
  if (tg_op = 'INSERT') then
    select count(*) into going_count from public.rsvps
      where event_id = new.event_id and status in ('going','checked_in');
    if going_count >= cap and new.status = 'going' then
      new.status := 'waitlist';
      select coalesce(max(waitlist_position),0)+1 into new.waitlist_position
        from public.rsvps where event_id = new.event_id and status = 'waitlist';
    end if;
    return new;
  end if;

  -- On UPDATE to cancelled: promote next waitlist
  if (tg_op = 'UPDATE' and new.status = 'cancelled' and old.status in ('going','checked_in')) then
    select * into next_waitlist from public.rsvps
      where event_id = new.event_id and status = 'waitlist'
      order by waitlist_position asc nulls last, created_at asc
      limit 1;
    if next_waitlist.id is not null then
      update public.rsvps set status = 'going', waitlist_position = null
        where id = next_waitlist.id;
    end if;
    return new;
  end if;

  return new;
end;
$$;

create trigger rsvp_before_insert before insert on public.rsvps
  for each row execute function public.handle_rsvp_change();
create trigger rsvp_after_update after update on public.rsvps
  for each row execute function public.handle_rsvp_change();

-- When capacity bumps, promote waitlist
create or replace function public.handle_capacity_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  going_count int;
  slots int;
  promoted record;
begin
  if new.capacity <= old.capacity then return new; end if;
  select count(*) into going_count from public.rsvps
    where event_id = new.id and status in ('going','checked_in');
  slots := new.capacity - going_count;
  for promoted in (
    select id from public.rsvps
    where event_id = new.id and status = 'waitlist'
    order by waitlist_position asc nulls last, created_at asc
    limit slots
  ) loop
    update public.rsvps set status='going', waitlist_position=null where id = promoted.id;
  end loop;
  return new;
end;
$$;
create trigger event_capacity_change after update of capacity on public.events
  for each row execute function public.handle_capacity_change();

-- ============ INVITES ============
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  role public.member_role not null,
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.invites enable row level security;

create policy "Anyone can read by token (lookup)" on public.invites for select using (true);
create policy "Host managers create invites" on public.invites for insert
  with check (public.is_host_owner_or_member(host_id, auth.uid()) and created_by = auth.uid());
create policy "Host managers delete invites" on public.invites for delete
  using (public.is_host_owner_or_member(host_id, auth.uid()));

-- ============ GALLERY ============
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  approved boolean not null default false,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.gallery_photos enable row level security;

create policy "Approved photos public" on public.gallery_photos for select
  using ((approved and not hidden) or user_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and public.is_host_owner_or_member(e.host_id, auth.uid())));
create policy "Users upload photos" on public.gallery_photos for insert with check (user_id = auth.uid());
create policy "Host members moderate photos" on public.gallery_photos for update
  using (exists (select 1 from public.events e where e.id = event_id and public.is_host_owner_or_member(e.host_id, auth.uid())));
create policy "Users delete own photos" on public.gallery_photos for delete using (user_id = auth.uid());

-- ============ FEEDBACK ============
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table public.feedback enable row level security;

create policy "Feedback readable by host and author" on public.feedback for select
  using (user_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and public.is_host_owner_or_member(e.host_id, auth.uid())));
create policy "Attendees submit feedback" on public.feedback for insert
  with check (user_id = auth.uid());

-- ============ REPORTS ============
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type public.report_target not null,
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default '',
  status public.report_status not null default 'open',
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;

create policy "Users see own reports" on public.reports for select using (reporter_id = auth.uid());
create policy "Anyone signed in reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "Reporters update own" on public.reports for update using (reporter_id = auth.uid());

-- ============ STORAGE BUCKETS ============
insert into storage.buckets (id, name, public) values
  ('covers', 'covers', true),
  ('logos', 'logos', true),
  ('gallery', 'gallery', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies (covers/logos/gallery/avatars all public read; auth users write to own folder)
create policy "Public read covers" on storage.objects for select using (bucket_id = 'covers');
create policy "Auth upload covers" on storage.objects for insert with check (bucket_id = 'covers' and auth.uid() is not null);
create policy "Owner update covers" on storage.objects for update using (bucket_id = 'covers' and owner = auth.uid());
create policy "Owner delete covers" on storage.objects for delete using (bucket_id = 'covers' and owner = auth.uid());

create policy "Public read logos" on storage.objects for select using (bucket_id = 'logos');
create policy "Auth upload logos" on storage.objects for insert with check (bucket_id = 'logos' and auth.uid() is not null);
create policy "Owner update logos" on storage.objects for update using (bucket_id = 'logos' and owner = auth.uid());
create policy "Owner delete logos" on storage.objects for delete using (bucket_id = 'logos' and owner = auth.uid());

create policy "Public read gallery" on storage.objects for select using (bucket_id = 'gallery');
create policy "Auth upload gallery" on storage.objects for insert with check (bucket_id = 'gallery' and auth.uid() is not null);
create policy "Owner update gallery" on storage.objects for update using (bucket_id = 'gallery' and owner = auth.uid());
create policy "Owner delete gallery" on storage.objects for delete using (bucket_id = 'gallery' and owner = auth.uid());

create policy "Public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Auth upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "Owner update avatars" on storage.objects for update using (bucket_id = 'avatars' and owner = auth.uid());
