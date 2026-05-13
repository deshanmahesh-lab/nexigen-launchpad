import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Nexigen Client Portal" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortalLayout,
});

function PortalLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const apply = async (uid: string | undefined, em: string | undefined) => {
      if (!uid) {
        if (mounted) { setUserId(null); setHydrated(true); }
        return;
      }
      // If admin, send to /admin instead
      const { data: adminRow } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (!mounted) return;
      if (adminRow) { navigate({ to: "/admin" }); return; }
      setUserId(uid);
      setEmail(em ?? null);
      setHydrated(true);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      void apply(session?.user?.id, session?.user?.email);
    });
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user?.id, data.session?.user?.email));
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!userId) return <PortalLogin />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-xl text-gradient">Client Portal</div>
            {email && <div className="text-xs text-[color:var(--text-muted)]">{email}</div>}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function PortalLogin() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/portal` },
        });
        if (error) throw error;
        toast.success("Account created.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal",
    });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute" style={{ top: "-100px", left: "-100px", width: 500, height: 500, background: "rgba(124,196,232,0.18)", filter: "blur(120px)" }} />
      <div className="absolute" style={{ bottom: "-120px", right: "-120px", width: 500, height: 500, background: "rgba(139,110,196,0.22)", filter: "blur(110px)" }} />
      <Card className="relative w-full max-w-md p-8 glass border-border">
        <div className="text-center mb-6">
          <div className="font-display font-bold text-2xl text-gradient">Client Portal</div>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {mode === "signin" ? "Sign in to your account" : "Create your client account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "signup" ? 8 : undefined} className="mt-1.5" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand hover:opacity-90">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create account"}
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
              New here? Create an account
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