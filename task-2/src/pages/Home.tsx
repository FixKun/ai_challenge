import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import EventCard, { EventCardData } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Ticket, Users } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, starts_at, venue, online_url, cover_url, capacity, host:hosts(name, slug)")
        .eq("status", "published").eq("visibility", "public").eq("hidden", false)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(6);
      setEvents((data as any[]) || []);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 glow-bg pointer-events-none" />
        <div className="container relative py-24 md:py-32 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 text-primary" /> A lightweight platform for community events
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 animate-fade-in">
            Host gatherings <br /> people <span className="text-gradient">remember</span>.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in">
            Publish an event in minutes. Share a link. Manage RSVPs, waitlist, and check-in — all in one calm dashboard.
          </p>
          <div className="flex items-center justify-center gap-3 animate-fade-in">
            <Button asChild size="lg"><Link to="/explore">Explore events <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/become-host">Become a host</Link></Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Upcoming events</h2>
            <p className="text-sm text-muted-foreground mt-1">Find something to do this week.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/explore">See all <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
            No events yet. <Link to="/become-host" className="text-primary underline-offset-4 hover:underline">Be the first host</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      <section className="container py-16 border-t border-border/60">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Ticket, title: "Free QR tickets", body: "Every confirmed RSVP gets a unique scannable code and an Add-to-Calendar option." },
            { icon: Users, title: "Smart waitlist", body: "Capacity full? People are queued and auto-promoted as seats open." },
            { icon: Sparkles, title: "Calm dashboard", body: "Live counts, CSV exports, member roles for hosts and door checkers." },
          ].map((f, i) => (
            <div key={i} className="card-surface border border-border/60 rounded-xl p-6">
              <f.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Built with care · gather
      </footer>
    </div>
  );
}
