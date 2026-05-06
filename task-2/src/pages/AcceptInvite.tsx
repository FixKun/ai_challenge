import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AcceptInvite() {
  const { token } = useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [invite, setInvite] = useState<any>(null);
  const [host, setHost] = useState<any>(null);
  const [existing, setExisting] = useState<any>(undefined); // undefined = not yet loaded
  const [working, setWorking] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: inv } = await supabase
        .from("invites")
        .select("*")
        .eq("token", token!)
        .maybeSingle();
      setInvite(inv);
      if (inv) {
        const { data: h } = await supabase
          .from("hosts")
          .select("name, slug")
          .eq("id", inv.host_id)
          .maybeSingle();
        setHost(h);
      }
    })();
  }, [token]);

  // Load existing membership whenever user or invite becomes available
  useEffect(() => {
    if (!user || !invite) {
      setExisting(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("host_members")
        .select("role")
        .eq("host_id", invite.host_id)
        .eq("user_id", user.id)
        .maybeSingle();
      setExisting(data || null);
    })();
  }, [user, invite]);

  const alreadyHost = existing?.role === "host" && invite?.role === "checker";
  const alreadyMember = !!existing;

  const accept = async () => {
    if (!user) {
      nav(`/auth?next=${encodeURIComponent(`/invite/${token}`)}`);
      return;
    }
    if (!invite) return;
    // Block host → checker downgrade
    if (alreadyHost) return;
    setWorking(true);
    const { error } = await supabase.from("host_members").upsert(
      {
        host_id: invite.host_id,
        user_id: user.id,
        role: invite.role,
      },
      { onConflict: "host_id,user_id" },
    );
    setWorking(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Joined!");
      nav(
        invite.role === "checker"
          ? "/my-events"
          : `/dashboard?host=${invite.host_id}`,
      );
    }
  };

  if (loading) return null;
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-20 max-w-md">
        <Card className="p-8 text-center card-surface">
          {!invite ? (
            <p className="text-muted-foreground">Invite not found.</p>
          ) : alreadyHost ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                You're already a host
              </h1>
              <p className="text-muted-foreground mb-6">
                You have host access to{" "}
                <span className="text-foreground">{host?.name}</span> — a
                checker invite can't override that.
              </p>
              <Button
                className="w-full"
                onClick={() => nav(`/dashboard?host=${invite.host_id}`)}
              >
                Go to dashboard
              </Button>
            </>
          ) : alreadyMember ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Already a member
              </h1>
              <p className="text-muted-foreground mb-6">
                You're already a{" "}
                <span className="text-foreground">{existing.role}</span> of{" "}
                <span className="text-foreground">{host?.name}</span>.
              </p>
              <Button
                className="w-full"
                onClick={() =>
                  nav(
                    existing.role === "host"
                      ? `/dashboard?host=${invite.host_id}`
                      : "/my-events",
                  )
                }
              >
                Go to {existing.role === "host" ? "dashboard" : "my events"}
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Join {host?.name}
              </h1>
              <p className="text-muted-foreground mb-6">
                You'll be added as{" "}
                <span className="text-foreground">{invite.role}</span>.
              </p>
              <Button className="w-full" onClick={accept} disabled={working}>
                {user
                  ? working
                    ? "Joining…"
                    : "Accept invite"
                  : "Sign in to accept"}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
