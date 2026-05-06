import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import EventDetail from "./pages/EventDetail";
import MyTickets from "./pages/MyTickets";
import BecomeHost from "./pages/BecomeHost";
import HostPage from "./pages/HostPage";
import HostDashboard from "./pages/HostDashboard";
import EventEditor from "./pages/EventEditor";
import CheckIn from "./pages/CheckIn";
import MyEvents from "./pages/MyEvents";
import AcceptInvite from "./pages/AcceptInvite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider delayDuration={150}>
        <Toaster />
        <Sonner theme="dark" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/e/:id" element={<EventDetail />} />
            <Route path="/h/:slug" element={<HostPage />} />
            <Route path="/invite/:token" element={<AcceptInvite />} />

            <Route path="/tickets" element={<RequireAuth><MyTickets /></RequireAuth>} />
            <Route path="/my-events" element={<RequireAuth><MyEvents /></RequireAuth>} />
            <Route path="/become-host" element={<RequireAuth><BecomeHost /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><HostDashboard /></RequireAuth>} />
            <Route path="/dashboard/event/:id" element={<RequireAuth><EventEditor /></RequireAuth>} />
            <Route path="/checkin/:id" element={<RequireAuth><CheckIn /></RequireAuth>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
