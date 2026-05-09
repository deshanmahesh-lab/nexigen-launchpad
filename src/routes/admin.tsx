import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  MessageSquareQuote,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "nexigen_admin";
const ADMIN_USER = "admin";
const ADMIN_PASS = "nexigen2025";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Nexigen Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/stats", label: "Stats", icon: BarChart3 },
] as const;

function AdminLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    toast.success("Signed out");
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

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, "1");
      toast.success("Welcome back");
      onSuccess();
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid credentials");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div
        className="absolute"
        style={{ top: "-100px", left: "-100px", width: 500, height: 500, background: "rgba(124,196,232,0.18)", filter: "blur(120px)" }}
      />
      <div
        className="absolute"
        style={{ bottom: "-120px", right: "-120px", width: 500, height: 500, background: "rgba(139,110,196,0.22)", filter: "blur(110px)" }}
      />
      <Card className="relative w-full max-w-md p-8 glass border-border">
        <div className="text-center mb-6">
          <div className="font-display font-bold text-2xl text-gradient">Nexigen Admin</div>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">Sign in to manage site content</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1.5"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand hover:opacity-90">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}