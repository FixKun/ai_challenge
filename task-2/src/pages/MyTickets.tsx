import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fmtDateTime } from "@/lib/format";
import { buildICS, downloadICS } from "@/lib/calendar";

interface Ticket {
  id: string; code: string; status: string;
  event: { id: string; title: string; starts_at: string; ends_at: string; venue: string; online_url: string | null; description: string };
}

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("id, code, status, event:events(id, title, starts_at, ends_at, venue, online_url, description)")
        .eq("user_id", user.id)
        .in("status", ["going", "checked_in", "waitlist"])
        .order("created_at", { ascending: false });
      const arr = ((data as any[]) || []).filter(t => t.event && new Date(t.event.ends_at).getTime() > Date.now() - 1000 * 60 * 60 * 6);
      setTickets(arr);
      const codes: Record<string, string> = {};
      for (const t of arr) {
        codes[t.id] = await QRCode.toDataURL(t.code, { color: { dark: "#d6ff4a", light: "#0e1014" }, margin: 1, width: 240 });
      }
      setQrs(codes);
    })();
  }, [user]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">My Tickets</h1>
        <p className="text-muted-foreground mb-8">Show this code at the door for check-in.</p>

        {tickets.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            No upcoming tickets yet. <Link to="/explore" className="text-primary hover:underline">Find an event</Link>.
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map(t => (
              <Card key={t.id} className="overflow-hidden card-surface">
                <div className="grid sm:grid-cols-[1fr_auto] gap-6 p-6">
                  <div className="space-y-2">
                    <div className="text-xs text-primary uppercase tracking-wider font-medium">
                      {t.status === "waitlist" ? "Waitlist" : t.status === "checked_in" ? "Checked in" : "Confirmed"}
                    </div>
                    <Link to={`/e/${t.event.id}`} className="text-lg font-semibold hover:text-primary">{t.event.title}</Link>
                    <div className="text-sm text-muted-foreground">{fmtDateTime(t.event.starts_at)}</div>
                    <div className="text-sm text-muted-foreground">{t.event.online_url ? "Online" : t.event.venue}</div>
                    <div className="font-mono text-xs text-muted-foreground pt-2">Code · <span className="text-foreground">{t.code}</span></div>
                    <Button
                      size="sm" variant="outline" className="mt-2"
                      onClick={() => downloadICS(`${t.event.title}.ics`, buildICS({
                        title: t.event.title, description: t.event.description,
                        location: t.event.online_url || t.event.venue,
                        startsAt: t.event.starts_at, endsAt: t.event.ends_at, uid: t.id,
                      }))}
                    >Add to calendar</Button>
                  </div>
                  {t.status !== "waitlist" && qrs[t.id] && (
                    <div className="ticket-grid-bg rounded-md border border-border p-3 grid place-items-center">
                      <img src={qrs[t.id]} alt="Ticket QR" className="w-40 h-40" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
