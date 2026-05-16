import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench, Briefcase, MessageSquareQuote, Eye, FileEdit,
  Inbox, Clock4, Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchServicesAll,
  fetchProjectsAll,
  fetchTestimonialsAll,
} from "@/lib/queries";
import type { ContactMessage } from "@/data/types";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const services = useQuery({ queryKey: ["services", "admin"], queryFn: fetchServicesAll });
  const projects = useQuery({ queryKey: ["projects", "admin"], queryFn: fetchProjectsAll });
  const testimonials = useQuery({ queryKey: ["testimonials", "admin"], queryFn: fetchTestimonialsAll });
  const messages = useQuery({
    queryKey: ["contact_messages", "admin"],
    queryFn: async (): Promise<ContactMessage[]> => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return (data ?? []) as ContactMessage[];
    },
  });
  const activeChats = useQuery({
    queryKey: ["portal_messages", "active_count"],
    queryFn: async () => {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase.from("portal_messages").select("customer_id").gte("created_at", since);
      const ids = new Set((data ?? []).map((r) => r.customer_id));
      return ids.size;
    },
  });

  const counts = (rows?: { status: string }[]) => {
    const total = rows?.filter((r) => r.status === "published").length ?? 0;
    const drafts = rows?.filter((r) => r.status === "draft").length ?? 0;
    return { total, drafts };
  };
  const sCounts = counts(services.data);
  const pCounts = counts(projects.data);
  const tCounts = counts(testimonials.data);
  const unread = messages.data?.filter((m) => !m.read).length ?? 0;
  const recent = (messages.data ?? []).slice(0, 5);

  const heroCards = [
    { label: "Published Services", value: sCounts.total, icon: Wrench, to: "/admin/services" as const },
    { label: "Published Projects", value: pCounts.total, icon: Briefcase, to: "/admin/projects" as const },
    { label: "Published Testimonials", value: tCounts.total, icon: MessageSquareQuote, to: "/admin/testimonials" as const },
    { label: "Pending Reviews", value: tCounts.drafts, icon: Star, to: "/admin/testimonials" as const },
    { label: "Unread Messages", value: unread, icon: Inbox, to: "/admin/messages" as const },
    { label: "Active Chats (7d)", value: activeChats.data ?? 0, icon: Clock4, to: "/admin/chats" as const },
  ];

  const totalDrafts = sCounts.drafts + pCounts.drafts + tCounts.drafts;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-[color:var(--text-muted)]">
            Welcome back. Here's a snapshot of your site.
          </p>
        </div>
        <a href="/?preview=1" target="_blank" rel="noopener">
          <Button className="bg-gradient-brand hover:opacity-90 gap-2">
            <Eye className="h-4 w-4" /> Open Preview
            {totalDrafts > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-2 py-0.5 text-xs">
                {totalDrafts} draft{totalDrafts === 1 ? "" : "s"}
              </span>
            )}
          </Button>
        </a>
      </div>

      {totalDrafts > 0 && (
        <Card className="p-5 glass border-primary/30 flex items-center gap-3">
          <FileEdit className="h-5 w-5 text-primary shrink-0" />
          <div className="text-sm">
            <span className="font-medium">{totalDrafts} unpublished draft{totalDrafts === 1 ? "" : "s"}</span>
            <span className="text-[color:var(--text-muted)]"> — open Preview to review, then publish from the relevant section.</span>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {heroCards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="p-5 glass hover:border-primary/40 transition-all hover:-translate-y-1 h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] font-mono leading-tight">
                    {c.label}
                  </div>
                  <div className="mt-2 font-display font-bold text-3xl text-gradient">{c.value}</div>
                </div>
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-brand/20 border border-border flex items-center justify-center">
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Recent Messages</h2>
          <Link to="/admin/messages" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {recent.length ? (
          <ul className="divide-y divide-border">
            {recent.map((m) => (
              <li key={m.id} className="py-3 flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${m.read ? "bg-[color:var(--text-muted)]/40" : "bg-primary"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{m.name}{m.company ? ` · ${m.company}` : ""}</div>
                  <div className="text-xs text-[color:var(--text-muted)] truncate">{m.message}</div>
                </div>
                <div className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                  {new Date(m.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[color:var(--text-muted)]">No messages yet.</p>
        )}
      </Card>

      <Card className="p-6 glass">
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {heroCards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[color:var(--surface-2)] border border-border hover:border-primary/40 transition-all"
            >
              <c.icon className="h-4 w-4 text-primary" />
              <span className="text-sm truncate">{c.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}