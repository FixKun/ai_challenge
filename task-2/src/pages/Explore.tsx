import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import EventCard, { EventCardData } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Mode = "all" | "online" | "in_person";

export default function Explore() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [includePast, setIncludePast] = useState(false);
  const [mode, setMode] = useState<Mode>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      let query = supabase
        .from("events")
        .select(
          "id, title, starts_at, venue, online_url, cover_url, capacity, host:hosts(name, slug)",
        )
        .eq("status", "published")
        .eq("visibility", "public")
        .eq("hidden", false)
        .order("starts_at", { ascending: !includePast });

      if (!includePast) {
        query = query.gte(
          "starts_at",
          from ? new Date(from).toISOString() : new Date().toISOString(),
        );
      } else if (from) {
        query = query.gte("starts_at", new Date(from).toISOString());
      }
      if (to)
        query = query.lte(
          "starts_at",
          new Date(to + "T23:59:59").toISOString(),
        );
      if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
      if (mode === "online") query = query.eq("venue", "");
      if (mode === "in_person") query = query.neq("venue", "");
      if (location.trim()) {
        const term = location.trim();
        if (mode === "online") {
          query = query.ilike("online_url", `%${term}%`);
        } else if (mode === "in_person") {
          query = query.ilike("venue", `%${term}%`);
        } else {
          query = query.or(`venue.ilike.%${term}%,online_url.ilike.%${term}%`);
        }
      }

      const { data } = await query.limit(60);
      if (!cancel) {
        setEvents((data as any[]) || []);
        setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [q, location, includePast, mode, from, to]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Explore
        </h1>
        <p className="text-muted-foreground mb-8">
          Discover community events happening soon.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events…"
                className="pl-9"
              />
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by location or platform"
              className="md:w-64"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(v) => v && setMode(v as Mode)}
              className="border border-border rounded-md"
            >
              <ToggleGroupItem value="all" className="px-3 text-xs">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="in_person" className="px-3 text-xs">
                In-person
              </ToggleGroupItem>
              <ToggleGroupItem value="online" className="px-3 text-xs">
                Online
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-40"
              />
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border">
              <Switch
                id="past"
                checked={includePast}
                onCheckedChange={setIncludePast}
              />
              <Label htmlFor="past" className="text-sm">
                Include past
              </Label>
            </div>

            <button
              type="button"
              onClick={() => {
                setQ("");
                setLocation("");
                setIncludePast(false);
                setMode("all");
                setFrom("");
                setTo("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline px-2"
            >
              Reset filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
            No events match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
