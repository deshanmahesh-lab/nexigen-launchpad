import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
        if (mounted) navigate({ to: "/login" });
        return;
      }
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

  if (!hydrated || !userId) return <div className="min-h-screen bg-background" />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
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