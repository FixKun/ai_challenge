import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Compass,
  Ticket,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function SiteHeader() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDisplayName(null);
      return;
    }
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name || null));
  }, [user?.id]);

  const navItem = (to: string, label: string, Icon: any) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
          isActive
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        }`
      }
    >
      <Icon className="h-4 w-4" /> {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-7 w-7 rounded-md bg-gradient-primary shadow-glow" />
          <span className="text-base tracking-tight">gather</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItem("/explore", "Explore", Compass)}
          {user && navItem("/tickets", "Tickets", Ticket)}
          {user && navItem("/my-events", "My Events", Calendar)}
          {user && navItem("/dashboard", "Host", LayoutDashboard)}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/auth")}>
                Sign in
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => nav("/auth?mode=signup")}
              >
                Get started
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-sm font-semibold">
                    {(displayName || user.email || "?")[0].toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="font-medium">{displayName || "—"}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/tickets")}>
                  <Ticket className="h-4 w-4 mr-2" /> Tickets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/my-events")}>
                  <Calendar className="h-4 w-4 mr-2" /> My Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/dashboard")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Host dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/become-host")}>
                  <UserIcon className="h-4 w-4 mr-2" /> Become a host
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    nav("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
