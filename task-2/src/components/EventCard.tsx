import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { fmtDateTime, isPast } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export interface EventCardData {
  id: string;
  title: string;
  starts_at: string;
  venue: string;
  online_url: string | null;
  cover_url: string | null;
  capacity: number;
  going_count?: number;
  host?: { name: string; slug: string };
}

function onlineLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function EventCard({ event }: { event: EventCardData }) {
  const past = isPast(event.starts_at);
  return (
    <Link
      to={`/e/${event.id}`}
      className="group block rounded-xl overflow-hidden border border-border/60 card-surface hover:border-primary/50 transition-all hover:-translate-y-0.5 animate-fade-in"
    >
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        {event.cover_url ? (
          <img
            src={event.cover_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent to-secondary" />
        )}
        {past && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur"
            >
              Ended
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        {event.host && (
          <div className="text-xs text-muted-foreground">{event.host.name}</div>
        )}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {fmtDateTime(event.starts_at)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">
            {event.venue
              ? event.venue
              : event.online_url
                ? `Online · ${onlineLabel(event.online_url)}`
                : "TBA"}
          </span>
        </div>
        {typeof event.going_count === "number" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> {event.going_count}/
            {event.capacity} going
          </div>
        )}
      </div>
    </Link>
  );
}
