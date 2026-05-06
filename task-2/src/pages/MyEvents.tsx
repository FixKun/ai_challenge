import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fmtDateTime, isPast } from "@/lib/format";
import { ScanLine, Pencil } from "lucide-react";

export default function MyEvents() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [hostFilter, setHostFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: mem } = await supabase
        .from("host_members")
        .select("role, host:hosts(id, name)")
        .eq("user_id", user.id);
      setMemberships((mem as any[]) || []);
      const hostIds = ((mem as any[]) || []).map(m => m.host.id);
      if (hostIds.length === 0) return;
      const { data: ev } = await supabase
        .from("events")
        .select("*, host:hosts(id, name)")
        .in("host_id", hostIds)
        .order("starts_at", { ascending: false });
      setEvents((ev as any[]) || []);
    })();
  }, [user]);

  const roleByHost: Record<string, string> = {};
  for (const m of memberships) roleByHost[m.host.id] = m.role;

  const filtered = events.filter(e => {
    if (hostFilter !== "all" && e.host.id !== hostFilter) return false;
    if (q && !e.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">My Events</h1>
        <p className="text-muted-foreground mb-8">Events from hosts where you have a role.</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="max-w-xs" />
          <Select value={hostFilter} onValueChange={setHostFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All hosts</SelectItem>
              {memberships.map(m => <SelectItem key={m.host.id} value={m.host.id}>{m.host.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">Nothing here yet.</Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(e => {
              const role = roleByHost[e.host.id];
              return (
                <Card key={e.id} className="p-4 flex flex-wrap items-center gap-4 card-surface">
                  <div className="flex-1 min-w-[220px]">
                    <Link to={`/e/${e.id}`} className="font-medium hover:text-primary">{e.title}</Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      {e.host.name} · {fmtDateTime(e.starts_at)} {isPast(e.ends_at) && <Badge variant="secondary" className="ml-1">Ended</Badge>}
                    </div>
                  </div>
                  <Badge variant="outline">{role}</Badge>
                  <div className="flex gap-1">
                    {role === "host" && (
                      <Button size="sm" variant="ghost" asChild><Link to={`/dashboard/event/${e.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
                    )}
                    <Button size="sm" variant="ghost" asChild><Link to={`/checkin/${e.id}`}><ScanLine className="h-3.5 w-3.5" /></Link></Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
