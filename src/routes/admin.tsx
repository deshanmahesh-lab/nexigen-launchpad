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
import { lovable } from "@/integrations/lovable/index";

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
  const [checkingRole, setCheckingRole] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) { setAuthed(false); setHydrated(true); }
        return;
      }
      setCheckingRole(true);
      const { data: adminRow, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      if (error || !adminRow) {
        // Not an admin — if signed in, send to /portal instead of forcing logout
        setAuthed(false);
        toast.message("Redirecting to your client portal…");
        navigate({ to: "/portal" });
      } else {
        setAuthed(true);
      }
      setCheckingRole(false);
      setHydrated(true);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      void check(session?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!hydrated || checkingRole) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
      onSuccess();
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
    }
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
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {mode === "signin" ? "Sign in to manage site content" : "Create the first admin account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
              className="mt-1.5"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand hover:opacity-90">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create admin account"}
          </Button>
        </form>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-[color:var(--surface-1)] text-[color:var(--text-muted)]">or</span></div>
        </div>
        <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
          Continue with Google
        </Button>
        <div className="mt-4 text-center text-xs text-[color:var(--text-muted)]">
          {mode === "signin" ? (
            <button type="button" onClick={() => setMode("signup")} className="hover:text-foreground underline-offset-4 hover:underline">
              First time here? Create the admin account
            </button>
          ) : (
            <button type="button" onClick={() => setMode("signin")} className="hover:text-foreground underline-offset-4 hover:underline">
              Already have an account? Sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}