-- Allow host_members to update their own row (so accepting a different role via invite upsert works)
CREATE POLICY "Members update own role"
ON public.host_members FOR UPDATE
USING (user_id = auth.uid() OR is_host_owner_or_member(host_id, auth.uid()));