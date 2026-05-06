import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Download,
  Copy as CopyIcon,
  ScanLine,
  Pencil,
  Eye,
  EyeOff,
  Files,
} from "lucide-react";
import { toast } from "sonner";
import { fmtDateTime, isPast } from "@/lib/format";
import { toCSV, downloadCSV } from "@/lib/csv";

export default function HostDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [hosts, setHosts] = useState<any[]>([]);
  const [activeHost, setActiveHost] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<
    Record<string, { going: number; waitlist: number; checkedIn: number }>
  >({});
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: members } = await supabase
        .from("host_members")
        .select("host:hosts(id, name, slug, owner_id), role")
        .eq("user_id", user.id);
      const list = ((members as any[]) || [])
        .map((m) => ({ ...m.host, role: m.role }))
        .filter((h) => h.role === "host");
      setHosts(list);
      const fromUrl = params.get("host");
      const initial =
        fromUrl && list.find((l) => l.id === fromUrl) ? fromUrl : list[0]?.id;
      setActiveHost(initial || null);
    })();
  }, [user]);

  useEffect(() => {
    if (!activeHost) return;
    (async () => {
      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("host_id", activeHost)
        .order("starts_at", { ascending: false });
      const list = (ev as any[]) || [];
      setEvents(list);
      // counts per event
      if (list.length) {
        const ids = list.map((e) => e.id);
        const { data: rs } = await supabase
          .from("rsvps")
          .select("event_id, status")
          .in("event_id", ids);
        const map: any = {};
        for (const id of ids) map[id] = { going: 0, waitlist: 0, checkedIn: 0 };
        for (const r of (rs as any[]) || []) {
          if (r.status === "going") map[r.event_id].going++;
          if (r.status === "checked_in") {
            map[r.event_id].going++;
            map[r.event_id].checkedIn++;
          }
          if (r.status === "waitlist") map[r.event_id].waitlist++;
        }
        setStats(map);
      }
      // open reports
      const { data: rep } = await supabase
        .from("reports")
        .select("*")
        .eq("status", "open");
      setReports((rep as any[]) || []);
      setParams({ host: activeHost }, { replace: true });
    })();
  }, [activeHost]);

  const exportCSV = async (eventId: string, title: string) => {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("user_id, status, checked_in_at, code, created_at")
      .eq("event_id", eventId);
    const list = (rsvps as any[]) || [];
    if (list.length) {
      const userIds = list.map((r: any) => r.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      const profMap = Object.fromEntries(
        ((profs as any[]) || []).map((p: any) => [p.id, p.display_name]),
      );
      const rows = list.map((r: any) => ({
        name: profMap[r.user_id] || r.user_id.slice(0, 8),
        code: r.code,
        status: r.status,
        checked_in_at: r.checked_in_at || "",
        registered_at: r.created_at,
      }));
      const csv = toCSV(rows, [
        "name",
        "code",
        "status",
        "checked_in_at",
        "registered_at",
      ]);
      downloadCSV(`${title}-attendees.csv`, csv);
    } else {
      toast.error("No attendees to export");
    }
  };

  const togglePublish = async (e: any) => {
    const next = e.status === "published" ? "draft" : "published";
    await supabase.from("events").update({ status: next }).eq("id", e.id);
    toast.success(next === "published" ? "Published" : "Unpublished");
    setEvents((prev) =>
      prev.map((x) => (x.id === e.id ? { ...x, status: next } : x)),
    );
  };

  const duplicate = async (e: any) => {
    const { id, created_at, ...rest } = e;
    const { data, error } = await supabase
      .from("events")
      .insert({
        ...rest,
        title: `${e.title} (copy)`,
        status: "draft",
        created_by: user!.id,
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Duplicated as draft");
    nav(`/dashboard/event/${data.id}`);
  };

  const hideReport = async (rep: any) => {
    const table = rep.target_type === "event" ? "events" : "gallery_photos";
    await supabase
      .from(table as any)
      .update({ hidden: true })
      .eq("id", rep.target_id);
    await supabase
      .from("reports")
      .update({ status: "hidden" })
      .eq("id", rep.id);
    setReports((prev) => prev.filter((r) => r.id !== rep.id));
    toast.success("Hidden");
  };

  const dismissReport = async (rep: any) => {
    await supabase
      .from("reports")
      .update({ status: "dismissed" })
      .eq("id", rep.id);
    setReports((prev) => prev.filter((r) => r.id !== rep.id));
    toast.success("Report dismissed");
  };

  if (!hosts.length) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold mb-3">No host page yet</h1>
          <p className="text-muted-foreground mb-6">
            Create a host page to start publishing events.
          </p>
          <Button onClick={() => nav("/become-host")}>Become a host</Button>
        </div>
      </div>
    );
  }

  const upcoming = events.filter((e) => !isPast(e.ends_at));
  const past = events.filter((e) => isPast(e.ends_at));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Host dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage events, members and check-ins.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hosts.length > 1 && (
              <Select value={activeHost || ""} onValueChange={setActiveHost}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hosts.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={() => nav(`/dashboard/event/new?host=${activeHost}`)}
            >
              <Plus className="h-4 w-4 mr-1" /> New event
            </Button>
          </div>
        </div>

        {reports.length > 0 && (
          <Card className="p-4 mb-6 border-warning/40">
            <div className="font-medium mb-2 text-warning">
              {reports.length} open report(s)
            </div>
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {r.target_type} · {r.reason || "(no reason)"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => hideReport(r)}
                    >
                      Hide
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissReport(r)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            <EventsTable
              events={upcoming}
              stats={stats}
              onPublish={togglePublish}
              onDuplicate={duplicate}
              onExport={exportCSV}
            />
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <EventsTable
              events={past}
              stats={stats}
              onPublish={togglePublish}
              onDuplicate={duplicate}
              onExport={exportCSV}
            />
          </TabsContent>
          <TabsContent value="photos" className="mt-4">
            {activeHost && <PhotosPanel hostId={activeHost} />}
          </TabsContent>
          <TabsContent value="members" className="mt-4">
            {activeHost && (
              <MembersPanel
                hostId={activeHost}
                ownerId={hosts.find((h) => h.id === activeHost)?.owner_id || ""}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EventsTable({ events, stats, onPublish, onDuplicate, onExport }: any) {
  if (!events.length)
    return (
      <div className="text-muted-foreground border border-dashed border-border rounded-xl p-10 text-center">
        Nothing here yet.
      </div>
    );
  return (
    <div className="space-y-3">
      {events.map((e: any) => {
        const s = stats[e.id] || { going: 0, waitlist: 0, checkedIn: 0 };
        return (
          <Card
            key={e.id}
            className="p-4 flex flex-wrap items-center gap-4 card-surface"
          >
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={`/e/${e.id}`}
                  className="font-medium hover:text-primary"
                >
                  {e.title}
                </Link>
                <Badge
                  variant={e.status === "published" ? "default" : "secondary"}
                >
                  {e.status}
                </Badge>
                {e.visibility === "unlisted" && (
                  <Badge variant="outline">unlisted</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {fmtDateTime(e.starts_at)}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Going</div>
                <div>
                  {s.going}/{e.capacity}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Waitlist</div>
                <div>{s.waitlist}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Checked-in</div>
                <div>{s.checkedIn}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="ghost" asChild>
                <Link to={`/dashboard/event/${e.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to={`/checkin/${e.id}`}>
                  <ScanLine className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onPublish(e)}>
                {e.status === "published" ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDuplicate(e)}>
                <Files className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onExport(e.id, e.title)}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function MembersPanel({
  hostId,
  ownerId,
}: {
  hostId: string;
  ownerId: string;
}) {
  const { user } = useAuth();
  const isOwner = user?.id === ownerId;
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

  const load = async () => {
    // Fetch members without an embedded profile join — host_members.user_id has an FK
    // to auth.users (not profiles), so PostgREST can't resolve the join and returns null.
    // Instead we do a separate profiles lookup and merge the results.
    const { data: m } = await supabase
      .from("host_members")
      .select("*")
      .eq("host_id", hostId);
    const memberRows = (m as any[]) || [];
    if (memberRows.length > 0) {
      const userIds = memberRows.map((r: any) => r.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      const profMap = Object.fromEntries(
        ((profs as any[]) || []).map((p: any) => [p.id, p.display_name]),
      );
      setMembers(
        memberRows.map((r: any) => ({
          ...r,
          displayName: profMap[r.user_id] || null,
        })),
      );
    } else {
      setMembers([]);
    }
    const { data: inv } = await supabase
      .from("invites")
      .select("*")
      .eq("host_id", hostId);
    setInvites((inv as any[]) || []);
  };
  useEffect(() => {
    void load();
  }, [hostId]);

  const createInvite = async (role: "host" | "checker") => {
    const { error } = await supabase
      .from("invites")
      .insert({ host_id: hostId, role, created_by: user!.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Invite link created");
      void load();
    }
  };

  const revokeInvite = async (id: string) => {
    const { error } = await supabase.from("invites").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Invite revoked");
      void load();
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const removeMember = async (
    memberId: string,
    memberUserId: string,
    memberRole: string,
  ) => {
    if (memberUserId === ownerId) {
      toast.error("The creator can't be removed");
      return;
    }
    if (memberRole === "host" && !isOwner) {
      toast.error("Only the creator can remove host members");
      return;
    }
    const { error } = await supabase
      .from("host_members")
      .delete()
      .eq("id", memberId);
    if (error) toast.error(error.message);
    else {
      toast.success("Member removed");
      void load();
    }
  };

  const changeRole = async (
    memberId: string,
    memberUserId: string,
    currentRole: string,
  ) => {
    if (memberUserId === ownerId) {
      toast.error("The creator's role can't be changed");
      return;
    }
    if (currentRole === "host" && !isOwner) {
      toast.error("Only the creator can demote host members");
      return;
    }
    const newRole = currentRole === "host" ? "checker" : "host";
    const { error } = await supabase
      .from("host_members")
      .update({ role: newRole })
      .eq("id", memberId);
    if (error) toast.error(error.message);
    else {
      toast.success(`Changed to ${newRole}`);
      void load();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Members</h3>
        <div className="space-y-2">
          {members.map((m) => {
            const isCreator = m.user_id === ownerId;
            const canChangeRole =
              !isCreator && (m.role === "checker" || isOwner);
            const canRemove = !isCreator && (m.role === "checker" || isOwner);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between text-sm gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate">
                    {m.displayName || m.user_id.slice(0, 8)}
                  </span>
                  {isCreator && (
                    <span className="text-xs text-muted-foreground">
                      (owner)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="outline">{m.role}</Badge>
                  {canChangeRole && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6 px-2"
                      onClick={() => changeRole(m.id, m.user_id, m.role)}
                    >
                      {m.role === "checker" ? "Promote" : "Demote"}
                    </Button>
                  )}
                  {canRemove && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6 px-2 text-destructive hover:text-destructive"
                      onClick={() => removeMember(m.id, m.user_id, m.role)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <p className="text-xs text-muted-foreground">No members yet.</p>
          )}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Invite links</h3>
        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => createInvite("host")}
          >
            + Host invite
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => createInvite("checker")}
          >
            + Checker invite
          </Button>
        </div>
        <div className="space-y-2">
          {invites.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between text-sm gap-2"
            >
              <span className="font-mono text-xs truncate">
                {i.role} · {i.token.slice(0, 12)}…
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyLink(i.token)}
                >
                  <CopyIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => revokeInvite(i.id)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
          {invites.length === 0 && (
            <p className="text-xs text-muted-foreground">No invites yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function PhotosPanel({ hostId }: { hostId: string }) {
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);

  const load = async () => {
    const { data: ev } = await supabase
      .from("events")
      .select("id, title")
      .eq("host_id", hostId);
    const ids = ((ev as any[]) || []).map((e) => e.id);
    const titleById: Record<string, string> = {};
    for (const e of (ev as any[]) || []) titleById[e.id] = e.title;
    if (ids.length === 0) {
      setPending([]);
      setApproved([]);
      return;
    }
    const { data: ph } = await supabase
      .from("gallery_photos")
      .select("*")
      .in("event_id", ids)
      .order("created_at", { ascending: false });
    const list = ((ph as any[]) || []).map((p) => ({
      ...p,
      eventTitle: titleById[p.event_id],
    }));
    setPending(list.filter((p) => !p.approved && !p.hidden));
    setApproved(list.filter((p) => p.approved && !p.hidden));
  };
  useEffect(() => {
    void load();
  }, [hostId]);

  const setFlag = async (id: string, patch: any, msg: string) => {
    const { error } = await supabase
      .from("gallery_photos")
      .update(patch)
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(msg);
      void load();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-3">
          Pending approval ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing waiting.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pending.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <img
                  src={p.image_url}
                  alt=""
                  className="aspect-square object-cover w-full"
                />
                <div className="p-2 space-y-1">
                  <div className="text-xs text-muted-foreground truncate">
                    {p.eventTitle}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setFlag(p.id, { approved: true }, "Approved")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFlag(p.id, { hidden: true }, "Hidden")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-3">Approved ({approved.length})</h3>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {approved.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <img
                  src={p.image_url}
                  alt=""
                  className="aspect-square object-cover w-full"
                />
                <div className="p-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground truncate">
                    {p.eventTitle}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFlag(p.id, { hidden: true }, "Hidden")}
                  >
                    Hide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
