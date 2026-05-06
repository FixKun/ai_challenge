import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Info, Upload } from "lucide-react";

export default function EventEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const [params] = useSearchParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    starts_date: "",
    starts_time: "",
    ends_date: "",
    ends_time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_online: false,
    venue: "",
    online_url: "",
    capacity: 50,
    cover_url: null,
    visibility: "public",
    status: "draft",
    is_paid: false,
    host_id: params.get("host") || "",
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (data) {
        const startsLocal = toLocal(data.starts_at);
        const endsLocal = toLocal(data.ends_at);
        setForm({
          ...data,
          starts_date: startsLocal.slice(0, 10),
          starts_time: startsLocal.slice(11, 16),
          ends_date: endsLocal.slice(0, 10),
          ends_time: endsLocal.slice(11, 16),
          is_online: !data.venue || data.venue.trim() === "",
        });
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  function toLocal(iso: string) {
    const d = new Date(iso);
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
  }

  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const uploadCover = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("covers").upload(path, file);
    if (error) {
      toast.error(error.message);
      return;
    }
    upd(
      "cover_url",
      supabase.storage.from("covers").getPublicUrl(path).data.publicUrl,
    );
  };

  const save = async (publish?: boolean) => {
    if (!user) return;
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }
    if (!form.starts_date || !form.ends_date) {
      toast.error("Start date and end date required");
      return;
    }
    setSaving(true);
    const startsAt = new Date(
      `${form.starts_date}T${form.starts_time || "00:00"}`,
    ).toISOString();
    const endsAt = new Date(
      `${form.ends_date}T${form.ends_time || "23:59"}`,
    ).toISOString();
    const {
      starts_date,
      starts_time,
      ends_date,
      ends_time,
      is_online,
      ...formRest
    } = form;
    const payload = {
      ...formRest,
      starts_at: startsAt,
      ends_at: endsAt,
      venue: is_online ? "" : form.venue,
      capacity: Number(form.capacity),
      status: publish ? "published" : form.status,
      created_by: user.id,
      online_url: form.online_url || null,
    };
    if (isNew) {
      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(publish ? "Published" : "Saved as draft");
      nav(`/dashboard/event/${data.id}`);
    } else {
      const { error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", id!);
      setSaving(false);
      if (error) toast.error(error.message);
      else toast.success(publish ? "Published" : "Saved");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container py-20 text-muted-foreground">Loading…</div>
      </div>
    );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">
          {isNew ? "Create event" : "Edit event"}
        </h1>

        <Card className="p-6 card-surface space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => upd("title", e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={6}
              value={form.description}
              onChange={(e) => upd("description", e.target.value)}
              maxLength={5000}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Starts</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={form.starts_date}
                  onChange={(e) => {
                    const d = e.target.value;
                    setForm((f: any) => ({
                      ...f,
                      starts_date: d,
                      ends_date: d || f.ends_date,
                    }));
                  }}
                />
                <Input
                  type="time"
                  value={form.starts_time}
                  onChange={(e) => upd("starts_time", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Ends{" "}
                <span className="text-xs text-muted-foreground">
                  (time optional)
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={form.ends_date}
                  onChange={(e) => upd("ends_date", e.target.value)}
                />
                <Input
                  type="time"
                  value={form.ends_time}
                  onChange={(e) => upd("ends_time", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Time zone</Label>
            <Input
              value={form.timezone}
              onChange={(e) => upd("timezone", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border p-3">
            <Switch
              id="is_online"
              checked={form.is_online}
              onCheckedChange={(v) => upd("is_online", v)}
            />
            <Label htmlFor="is_online" className="cursor-pointer font-normal">
              {form.is_online ? "Online event" : "In-person event"}
            </Label>
          </div>

          {form.is_online ? (
            <div className="space-y-2">
              <Label>Join URL</Label>
              <Input
                value={form.online_url || ""}
                onChange={(e) => upd("online_url", e.target.value)}
                placeholder="https://meet.example.com/…"
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input
                  value={form.venue}
                  onChange={(e) => upd("venue", e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Website{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  value={form.online_url || ""}
                  onChange={(e) => upd("online_url", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => upd("capacity", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={form.visibility}
                onValueChange={(v) => upd("visibility", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — searchable</SelectItem>
                  <SelectItem value="unlisted">Unlisted — link only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover image</Label>
            <div className="flex items-center gap-3">
              {form.cover_url && (
                <img
                  src={form.cover_url}
                  alt=""
                  className="h-16 w-28 object-cover rounded-md border border-border"
                />
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && uploadCover(e.target.files[0])
                  }
                />
                <Button asChild variant="outline" size="sm" type="button">
                  <span>
                    <Upload className="h-3 w-3 mr-1" /> Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3 opacity-80">
            <div>
              <div className="text-sm font-medium flex items-center gap-1">
                Pricing — Free
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>Paid events coming soon.</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground">
                Toggle paid tickets when available.
              </p>
            </div>
            <Switch checked={false} disabled />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => save(false)}
              disabled={saving}
            >
              Save draft
            </Button>
            <Button onClick={() => save(true)} disabled={saving}>
              Publish
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
