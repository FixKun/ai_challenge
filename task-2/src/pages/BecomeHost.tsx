import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(500),
  contact_email: z.string().trim().email().max(255),
});

export default function BecomeHost() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const uploadLogo = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("logos").upload(path, file);
    if (error) { toast.error(error.message); return; }
    setLogoUrl(supabase.storage.from("logos").getPublicUrl(path).data.publicUrl);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"), bio: fd.get("bio"), contact_email: fd.get("contact_email"),
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const baseSlug = slugify(parsed.data.name);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase.from("hosts").insert({
      name: parsed.data.name,
      bio: parsed.data.bio,
      contact_email: parsed.data.contact_email,
      slug,
      owner_id: user.id,
      logo_url: logoUrl ?? undefined,
    }).select().single();
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Host page created!");
    nav(`/dashboard?host=${data.id}`);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Become a host</h1>
        <p className="text-muted-foreground mb-8">Create a public page for your community or organization.</p>

        <Card className="p-6 card-surface">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2"><Label>Host name</Label><Input name="name" required maxLength={80} /></div>
            <div className="space-y-2"><Label>Short bio</Label><Textarea name="bio" maxLength={500} placeholder="What is your community about?" /></div>
            <div className="space-y-2"><Label>Contact email</Label><Input name="contact_email" type="email" required defaultValue={user?.email || ""} /></div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-md object-cover border border-border" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                  <Button asChild variant="outline" size="sm" type="button"><span>Upload logo</span></Button>
                </label>
              </div>
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create host page"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
