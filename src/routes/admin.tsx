import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  MessageSquareQuote,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
  ListChecks,
  Cpu,
  Sparkles,
  UserCheck,
  BookOpen,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Nexigen Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
  // අලුතින් එකතු කළ කොටස
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-[color:var(--text-muted)]">
      <h2 className="text-2xl font-bold text-foreground mb-2">404 - Page Not Found</h2>
      <p>The admin page you are looking for does not exist.</p>
    </div>
  ),
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/process", label: "Process", icon: ListChecks },
  { to: "/admin/tech", label: "Tech Stack", icon: Cpu },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/perks", label: "Perks", icon: Sparkles },
  { to: "/admin/roles", label: "Open Roles", icon: UserCheck },
  { to: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { to: "/admin/stats", label: "Stats", icon: BarChart3 },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/chats", label: "Client Chats", icon: MessageSquareQuote },
] as const;

function AdminLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (!mounted) return;
      if (!userId) {
        navigate({ to: "/login" });
        return;
      }
      const { data: adminRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      if (adminRow) {
        setAuthed(true);
        setHydrated(true);
      } else {
        await supabase.auth.signOut();
        toast.error("Access Denied: Admin privileges required");
        navigate({ to: "/login" });
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((evt) => {
      if (evt === "SIGNED_OUT" && mounted) {
        setAuthed(false);
        navigate({ to: "/login" });
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!hydrated || !authed) {
    return <div className="min-h-screen bg-background" />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between glass px-4 py-3 border-b border-border">
        <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-md hover:bg-[color:var(--surface-2)]">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="font-display font-bold text-gradient">Nexigen Admin</span>
        <button onClick={handleLogout} className="p-2 rounded-md hover:bg-[color:var(--surface-2)]">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            open ? "block" : "hidden"
          } lg:block fixed lg:sticky inset-y-0 lg:top-0 left-0 z-30 w-64 lg:h-screen glass border-r border-border p-5`}
        >
          <div className="font-display font-bold text-xl text-gradient mb-8 hidden lg:block">
            Nexigen Admin
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Desktop topbar */}
          <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border glass sticky top-0 z-20">
            <span className="font-display font-semibold text-lg">Nexigen Admin</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
          <main className="p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  onClick?: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? path === to : path === to || path.startsWith(to + "/");
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        active
          ? "bg-gradient-brand/20 text-foreground border border-primary/30"
          : "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-2)] hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}