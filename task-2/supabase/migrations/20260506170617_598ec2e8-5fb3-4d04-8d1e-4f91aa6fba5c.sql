-- Re-create missing triggers (db reports none exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_host_created ON public.hosts;
CREATE TRIGGER on_host_created
AFTER INSERT ON public.hosts
FOR EACH ROW EXECUTE FUNCTION public.handle_new_host();

DROP TRIGGER IF EXISTS on_rsvp_change ON public.rsvps;
CREATE TRIGGER on_rsvp_change
BEFORE INSERT OR UPDATE ON public.rsvps
FOR EACH ROW EXECUTE FUNCTION public.handle_rsvp_change();

DROP TRIGGER IF EXISTS on_event_capacity ON public.events;
CREATE TRIGGER on_event_capacity
AFTER UPDATE OF capacity ON public.events
FOR EACH ROW EXECUTE FUNCTION public.handle_capacity_change();

-- Backfill: add existing host owners as host members (for previously broken trigger)
INSERT INTO public.host_members (host_id, user_id, role)
SELECT h.id, h.owner_id, 'host'::member_role
FROM public.hosts h
WHERE NOT EXISTS (
  SELECT 1 FROM public.host_members m
  WHERE m.host_id = h.id AND m.user_id = h.owner_id
);

-- Backfill: create profiles for existing users missing one
INSERT INTO public.profiles (id, display_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);