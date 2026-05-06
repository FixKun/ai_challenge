import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="container py-20 text-muted-foreground">Loading…</div>;
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/auth?next=${next}`} replace />;
  }
  return <>{children}</>;
}
