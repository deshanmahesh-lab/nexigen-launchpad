import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { resolveAuthRedirect } from "@/lib/auth-redirect";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nexigen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // On mount (and after OAuth return), if the user is already signed in,
  // route them to their destination.
  useEffect(() => {
    let active = true;
    (async () => {
      const dest = await resolveAuthRedirect();
      if (!active) return;
      if (dest) navigate({ to: dest });
      else setChecking(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (evt) => {
      if (evt === "SIGNED_IN") {
        const dest = await resolveAuthRedirect();
        if (dest && active) navigate({ to: dest });
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm if required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const dest = await resolveAuthRedirect();
      if (dest) {
        toast.success("Welcome");
        navigate({ to: dest });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/login",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    const dest = await resolveAuthRedirect();
    if (dest) navigate({ to: dest });
  };

  if (checking) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div
        className="absolute pointer-events-none"
        style={{ top: "-100px", left: "-100px", width: 500, height: 500, background: "rgba(124,196,232,0.18)", filter: "blur(120px)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: "-120px", right: "-120px", width: 500, height: 500, background: "rgba(139,110,196,0.22)", filter: "blur(110px)" }}
      />
      <Card className="relative w-full max-w-md p-8 glass border-border animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-6">
          <div className="font-display font-bold text-3xl text-gradient">Nexigen</div>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {mode === "signin" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand hover:opacity-90">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create account"}
          </Button>
        </form>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[color:var(--surface-1)] text-[color:var(--text-muted)]">or</span>
          </div>
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