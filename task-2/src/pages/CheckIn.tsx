import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Undo2, X } from "lucide-react";
import { toast } from "sonner";

export default function CheckIn() {
  const { id } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [event, setEvent] = useState<any>(null);
  const [counts, setCounts] = useState({ going: 0, checkedIn: 0, waitlist: 0 });
  const [recent, setRecent] = useState<
    { id: string; name: string; prev: string }[]
  >([]);

  const load = async () => {
    if (!id) return;
    const { data: ev } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    setEvent(ev);
    const { data } = await supabase.rpc("event_counts", { _event_id: id });
    const row = Array.isArray(data) ? data[0] : data;
    if (row)
      setCounts({
        going: row.going ?? 0,
        checkedIn: row.checked_in ?? 0,
        waitlist: row.waitlist ?? 0,
      });
  };

  useEffect(() => {
    void load();
    if (!id) return;
    const ch = supabase
      .channel(`checkin-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${id}`,
        },
        () => void load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    // Fetch rsvp without a profile join — the FK hint pointing at auth.users
    // causes the whole query to fail when joined to profiles directly.
    const { data: r, error: rErr } = await supabase
      .from("rsvps")
      .select("id, status, code, user_id")
      .eq("event_id", id!)
      .eq("code", c)
      .maybeSingle();
    if (rErr) {
      toast.error(rErr.message);
      setCode("");
      inputRef.current?.focus();
      return;
    }
    if (!r) {
      toast.error("Code not found");
    } else if (r.status === "checked_in") {
      // Fetch name for display
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", (r as any).user_id)
        .maybeSingle();
      toast.warning(`Already checked in — ${(prof as any)?.display_name || c}`);
    } else if (r.status !== "going") {
      toast.error(`Status: ${r.status}`);
    } else {
      const prev = r.status;
      const { error } = await supabase
        .from("rsvps")
        .update({
          status: "checked_in",
          checked_in_at: new Date().toISOString(),
        })
        .eq("id", r.id);
      if (error) {
        toast.error(error.message);
      } else {
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", (r as any).user_id)
          .maybeSingle();
        const name = (prof as any)?.display_name || c;
        toast.success(`Checked in: ${name}`);
        setRecent((prev_) => [{ id: r.id, name, prev }, ...prev_].slice(0, 5));
        void load();
      }
    }
    setCode("");
    inputRef.current?.focus();
  };

  const undoLast = async () => {
    const last = recent[0];
    if (!last) return;
    await supabase
      .from("rsvps")
      .update({ status: last.prev as any, checked_in_at: null })
      .eq("id", last.id);
    setRecent((r) => r.slice(1));
    toast.success(`Undid check-in for ${last.name}`);
    void load();
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Check-in</h1>
        <p className="text-muted-foreground mb-6">{event?.title}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Going", val: counts.going },
            { label: "Checked-in", val: counts.checkedIn },
            { label: "Waitlist", val: counts.waitlist },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center card-surface">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {s.label}
              </div>
              <div className="text-3xl font-semibold mt-1">{s.val}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5 card-surface mb-4">
          <form onSubmit={submit} className="flex gap-2">
            <Input
              ref={inputRef}
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter ticket code (e.g. 7F2A9C1B)"
              className="font-mono uppercase tracking-wider"
              maxLength={16}
            />
            <Button type="submit">
              <Check className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Type or paste codes. Scanner devices that emit text + Enter work
            too.
          </p>
        </Card>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent
          </h2>
          {recent.length > 0 && (
            <Button size="sm" variant="ghost" onClick={undoLast}>
              <Undo2 className="h-3 w-3 mr-1" /> Undo last
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">No scans yet.</p>
          )}
          {recent.map((r, i) => (
            <Card
              key={r.id + i}
              className="p-3 flex items-center justify-between text-sm"
            >
              <span>{r.name}</span>
              <span className="text-success flex items-center gap-1">
                <Check className="h-3 w-3" /> Checked in
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
