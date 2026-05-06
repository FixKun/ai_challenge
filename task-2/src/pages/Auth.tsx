import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});
const signUpSchema = signInSchema.extend({
  displayName: z.string().trim().min(1, "Name required").max(60),
});

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || null;
  const initial = params.get("mode") === "signup" ? "signup" : "signin";
  const [tab, setTab] = useState(initial);
  const [loading, setLoading] = useState(false);

  const resolveRedirect = async () => {
    if (next) return next;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) return "/";
    const { data } = await supabase
      .from("host_members")
      .select("host_id")
      .eq("user_id", u.id)
      .eq("role", "host")
      .limit(1)
      .maybeSingle();
    return data ? "/dashboard" : "/";
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Welcome back");
      nav(await resolveRedirect());
    }
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
      displayName: fd.get("displayName"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signUp(
      parsed.data.email,
      parsed.data.password,
      parsed.data.displayName,
    );
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Account created");
      nav(await resolveRedirect());
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 glow-bg">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-lg"
          >
            <div className="h-8 w-8 rounded-md bg-gradient-primary shadow-glow" />
            gather
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to RSVP and host events.
          </p>
        </div>

        <div className="card-surface border border-border rounded-xl p-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={onSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={onSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label>Display name</Label>
                  <Input name="displayName" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
