import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Flag,
  Image as ImageIcon,
  Star,
  Upload,
  Globe,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { fmtDateTime, isPast } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildICS, downloadICS } from "@/lib/calendar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue: string;
  online_url: string | null;
  capacity: number;
  cover_url: string | null;
  visibility: string;
  status: string;
  host_id: string;
  host: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    bio: string;
  } | null;
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [counts, setCounts] = useState({ going: 0, waitlist: 0 });
  const [myRsvp, setMyRsvp] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    void load();
    // Live counter — anyone gets pinged when RSVPs change
    const ch = supabase
      .channel(`rsvps-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${id}`,
        },
        () => {
          void refreshCounts();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  async function refreshCounts() {
    if (!id) return;
    const { data } = await supabase.rpc("event_counts", { _event_id: id });
    const row = Array.isArray(data) ? data[0] : data;
    if (row) setCounts({ going: row.going ?? 0, waitlist: row.waitlist ?? 0 });
  }

  async function load() {
    setLoading(true);
    const { data: ev } = await supabase
      .from("events")
      .select("*, host:hosts(id, name, slug, logo_url, bio)")
      .eq("id", id!)
      .maybeSingle();
    setEvent(ev as any);
    if (ev) {
      await refreshCounts();
      if (user) {
        const { data: mine } = await supabase
          .from("rsvps")
          .select("*")
          .eq("event_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();
        setMyRsvp(mine);
      }
      const { data: ph } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("event_id", id!)
        .eq("approved", true)
        .eq("hidden", false)
        .order("created_at", { ascending: false });
      setPhotos(ph || []);
      const { data: fb } = await supabase
        .from("feedback")
        .select("*")
        .eq("event_id", id!)
        .order("created_at", { ascending: false });
      setFeedback(fb || []);
    }
    setLoading(false);
  }

  const handleRsvp = async () => {
    if (!user) {
      nav(`/auth?next=${encodeURIComponent(`/e/${id}`)}`);
      return;
    }
    // If a cancelled row exists, reactivate it instead of inserting (avoids unique constraint)
    const { data: existing } = await supabase
      .from("rsvps")
      .select("id, status")
      .eq("event_id", id!)
      .eq("user_id", user.id)
      .maybeSingle();
    let status: string;
    if (existing) {
      const { data: updated, error } = await supabase
        .from("rsvps")
        .update({
          status: "going",
          waitlist_position: null,
          checked_in_at: null,
        })
        .eq("id", existing.id)
        .select("status")
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      status = updated.status;
    } else {
      const { data, error } = await supabase
        .from("rsvps")
        .insert({ event_id: id!, user_id: user.id })
        .select("status")
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      status = data.status;
    }
    if (status === "waitlist") toast.success("You're on the waitlist");
    else toast.success("You're going! Ticket ready.");
    void load();
  };

  const cancelRsvp = async () => {
    if (!myRsvp) return;
    const { error } = await supabase
      .from("rsvps")
      .update({ status: "cancelled" })
      .eq("id", myRsvp.id);
    if (error) toast.error(error.message);
    else {
      toast.success("RSVP cancelled");
      void load();
    }
  };

  const addToCalendar = (type: "ics" | "google" | "outlook") => {
    if (!event) return;
    const fmt = (d: string) =>
      new Date(d).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const location = event.venue || event.online_url || "";
    if (type === "google") {
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.set("action", "TEMPLATE");
      url.searchParams.set("text", event.title);
      url.searchParams.set(
        "dates",
        `${fmt(event.starts_at)}/${fmt(event.ends_at)}`,
      );
      url.searchParams.set("details", event.description);
      url.searchParams.set("location", location);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } else if (type === "outlook") {
      const url = new URL(
        "https://outlook.live.com/calendar/0/deeplink/compose",
      );
      url.searchParams.set("path", "/calendar/action/compose");
      url.searchParams.set("rru", "addevent");
      url.searchParams.set("subject", event.title);
      url.searchParams.set("startdt", event.starts_at);
      url.searchParams.set("enddt", event.ends_at);
      url.searchParams.set("body", event.description);
      url.searchParams.set("location", location);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } else {
      const ics = buildICS({
        title: event.title,
        description: event.description,
        location,
        startsAt: event.starts_at,
        endsAt: event.ends_at,
        uid: event.id,
      });
      downloadICS(`${event.title}.ics`, ics);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!user || !event) return;
    const path = `${user.id}/${event.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    await supabase.from("gallery_photos").insert({
      event_id: event.id,
      user_id: user.id,
      image_url: pub.publicUrl,
    });
    toast.success("Photo submitted for approval");
    void load();
  };

  const submitReport = async (reason: string) => {
    if (!user || !event) return;
    await supabase.from("reports").insert({
      target_type: "event",
      target_id: event.id,
      reporter_id: user.id,
      reason,
    });
    toast.success("Report submitted");
  };

  const submitFeedback = async (rating: number, comment: string) => {
    if (!user || !event) return;
    const { error } = await supabase
      .from("feedback")
      .insert({ event_id: event.id, user_id: user.id, rating, comment });
    if (error) {
      if (error.code === "23505")
        toast.error("You've already submitted a review for this event.");
      else toast.error(error.message);
    } else {
      toast.success("Thanks for your feedback");
      void load();
    }
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container py-20 text-muted-foreground">Loading…</div>
      </div>
    );
  if (!event)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container py-20">Event not found.</div>
      </div>
    );

  const past = isPast(event.ends_at);
  const isFull = counts.going >= event.capacity;
  const seatsLeft = Math.max(0, event.capacity - counts.going);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {/* Social meta — single H1 */}
      <title>{`${event.title} — gather`}</title>
      <meta name="description" content={event.description.slice(0, 155)} />
      <meta property="og:title" content={event.title} />
      <meta
        property="og:description"
        content={event.description.slice(0, 155)}
      />
      {event.cover_url && (
        <meta property="og:image" content={event.cover_url} />
      )}
      <link
        rel="canonical"
        href={typeof window !== "undefined" ? window.location.href : ""}
      />

      <div className="container py-10 grid lg:grid-cols-[1fr_360px] gap-10">
        <main className="space-y-8 animate-fade-in">
          <div className="aspect-[16/8] rounded-xl overflow-hidden border border-border/60 bg-muted">
            {event.cover_url ? (
              <img
                src={event.cover_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent to-secondary" />
            )}
          </div>

          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {past && <Badge variant="secondary">Ended</Badge>}
              {event.visibility === "unlisted" && (
                <Badge variant="outline">Unlisted</Badge>
              )}
              <Badge variant="outline">Free</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">
              {event.title}
            </h1>
            {event.host && (
              <Link
                to={`/h/${event.host.slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {event.host.logo_url ? (
                  <img
                    src={event.host.logo_url}
                    className="h-6 w-6 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-primary" />
                )}
                Hosted by {event.host.name}
              </Link>
            )}
          </header>

          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90">
            {event.description}
          </div>

          {/* Gallery */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Gallery
              </h2>
              {user && (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && uploadPhoto(e.target.files[0])
                    }
                  />
                  <Button asChild variant="outline" size="sm">
                    <span>
                      <Upload className="h-3 w-3 mr-1" /> Upload
                    </span>
                  </Button>
                </label>
              )}
            </div>
            {photos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No photos yet. Uploads need host approval.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((p) => (
                  <img
                    key={p.id}
                    src={p.image_url}
                    className="aspect-square object-cover rounded-md border border-border"
                    alt=""
                  />
                ))}
              </div>
            )}
          </section>

          {/* Feedback */}
          {past && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-4 w-4" /> Feedback
              </h2>
              {(() => {
                const myFeedback = user
                  ? feedback.find((f) => f.user_id === user.id)
                  : null;
                if (!user) return null;
                if (myFeedback) {
                  return (
                    <div className="rounded-md border border-border p-3 text-sm text-muted-foreground mb-2">
                      You reviewed this event{" "}
                      <span className="inline-flex gap-0.5 align-middle">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < myFeedback.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </span>
                      {myFeedback.comment && ` — "${myFeedback.comment}"`}
                    </div>
                  );
                }
                return <FeedbackForm onSubmit={submitFeedback} />;
              })()}
              <div className="space-y-3 mt-4">
                {feedback.map((f) => (
                  <Card key={f.id} className="p-4">
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < f.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    {f.comment && <p className="text-sm">{f.comment}</p>}
                  </Card>
                ))}
                {feedback.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No feedback yet.
                  </p>
                )}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-4">
          <Card className="p-5 card-surface space-y-4 sticky top-20">
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <div>{fmtDateTime(event.starts_at)}</div>
                  <div className="text-muted-foreground">
                    to {fmtDateTime(event.ends_at)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.timezone}
                  </div>
                </div>
              </div>
              {event.venue ? (
                <>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  {event.online_url && (
                    <div className="flex items-start gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <a
                        href={event.online_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground break-all"
                      >
                        {event.online_url}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2 text-sm">
                  <Globe className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  {event.online_url ? (
                    <a
                      href={event.online_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary break-all"
                    >
                      Join online →
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Online event</span>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <Users className="h-4 w-4 mt-0.5 text-primary" />
                <span>
                  {counts.going}/{event.capacity} going · {counts.waitlist}{" "}
                  waitlist
                </span>
              </div>
            </div>

            {past ? (
              <div className="text-center text-sm text-muted-foreground py-2 border-t border-border">
                This event has ended
              </div>
            ) : myRsvp && myRsvp.status !== "cancelled" ? (
              <div className="space-y-2">
                <div className="rounded-md bg-primary/10 border border-primary/30 p-3 text-sm">
                  {myRsvp.status === "waitlist"
                    ? "You're on the waitlist."
                    : "You're going! "}
                  {myRsvp.status === "going" ||
                  myRsvp.status === "checked_in" ? (
                    <Link
                      to="/tickets"
                      className="text-primary hover:underline ml-1"
                    >
                      View ticket →
                    </Link>
                  ) : null}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-3.5 w-3.5 mr-1" /> Add to calendar{" "}
                      <ChevronDown className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem onClick={() => addToCalendar("google")}>
                      Google Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addToCalendar("outlook")}>
                      Outlook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addToCalendar("ics")}>
                      Download .ics (Apple / other)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="w-full" onClick={cancelRsvp}>
                  Cancel RSVP
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleRsvp}>
                  {isFull ? "Join waitlist" : "RSVP — Free"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {isFull
                    ? "Capacity reached"
                    : `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`}
                </p>
              </div>
            )}

            {user && (
              <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                  >
                    <Flag className="h-3 w-3 mr-1" /> Report event
                  </Button>
                </DialogTrigger>
                <ReportDialog
                  onSubmit={async (r) => {
                    await submitReport(r);
                    setReportOpen(false);
                  }}
                />
              </Dialog>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function FeedbackForm({
  onSubmit,
}: {
  onSubmit: (r: number, c: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <Card className="p-4 space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star
              className={`h-5 w-5 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
      />
      <Button
        disabled={rating === 0}
        onClick={() => {
          onSubmit(rating, comment);
          setRating(0);
          setComment("");
        }}
      >
        Submit
      </Button>
    </Card>
  );
}

function ReportDialog({ onSubmit }: { onSubmit: (r: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Report event</DialogTitle>
      </DialogHeader>
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Tell us what's wrong"
        maxLength={500}
      />
      <DialogFooter>
        <Button onClick={() => onSubmit(reason)}>Submit</Button>
      </DialogFooter>
    </DialogContent>
  );
}
