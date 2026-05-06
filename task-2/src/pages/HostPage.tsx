import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import EventCard, { EventCardData } from "@/components/EventCard";

export default function HostPage() {
  const { slug } = useParams();
  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data: h } = await supabase.from("hosts").select("*").eq("slug", slug!).maybeSingle();
      setHost(h);
      if (h) {
        const { data: ev } = await supabase
          .from("events")
          .select("id, title, starts_at, venue, online_url, cover_url, capacity")
          .eq("host_id", h.id).eq("status", "published").eq("hidden", false)
          .order("starts_at", { ascending: false });
        setEvents((ev as any[]) || []);
      }
    })();
  }, [slug]);

  if (!host) return <div className="min-h-screen"><SiteHeader /><div className="container py-20 text-muted-foreground">Loading…</div></div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <title>{`${host.name} — gather`}</title>
      <meta property="og:title" content={host.name} />
      <meta property="og:description" content={host.bio || `Events by ${host.name}`} />
      {host.logo_url && <meta property="og:image" content={host.logo_url} />}

      <div className="container py-10">
        <div className="flex items-center gap-5 mb-10 animate-fade-in">
          {host.logo_url
            ? <img src={host.logo_url} alt="" className="h-20 w-20 rounded-xl object-cover border border-border" />
            : <div className="h-20 w-20 rounded-xl bg-gradient-primary" />}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{host.name}</h1>
            <p className="text-muted-foreground mt-1 max-w-xl">{host.bio}</p>
            <a href={`mailto:${host.contact_email}`} className="text-sm text-primary mt-1 inline-block">{host.contact_email}</a>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Events</h2>
        {events.length === 0
          ? <div className="text-muted-foreground border border-dashed border-border rounded-xl p-10 text-center">No events yet.</div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{events.map(e => <EventCard key={e.id} event={e} />)}</div>}
      </div>
    </div>
  );
}
