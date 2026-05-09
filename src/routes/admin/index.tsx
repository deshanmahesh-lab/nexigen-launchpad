import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Briefcase, MessageSquareQuote, BarChart3, Eye, FileEdit } from "lucide-react";
import {
  fetchServicesAll,
  fetchProjectsAll,
  fetchTestimonialsAll,
  fetchStatsAll,
} from "@/lib/queries";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const services = useQuery({ queryKey: ["services", "admin"], queryFn: fetchServicesAll });
  const projects = useQuery({ queryKey: ["projects", "admin"], queryFn: fetchProjectsAll });
  const testimonials = useQuery({ queryKey: ["testimonials", "admin"], queryFn: fetchTestimonialsAll });
  const stats = useQuery({ queryKey: ["stats", "admin"], queryFn: fetchStatsAll });

  const counts = (rows?: { status: string }[]) => {
    const total = rows?.filter((r) => r.status === "published").length ?? 0;
    const drafts = rows?.filter((r) => r.status === "draft").length ?? 0;
    return { total, drafts };
  };
  const sCounts = counts(services.data);
  const pCounts = counts(projects.data);
  const tCounts = counts(testimonials.data);
  const stCounts = counts(stats.data);

  const cards = [
    { label: "Services", ...sCounts, icon: Wrench, to: "/admin/services" as const },
    { label: "Projects", ...pCounts, icon: Briefcase, to: "/admin/projects" as const },
    { label: "Testimonials", ...tCounts, icon: MessageSquareQuote, to: "/admin/testimonials" as const },
    { label: "Stats", ...stCounts, icon: BarChart3, to: "/admin/stats" as const },
  ];

  const totalDrafts = sCounts.drafts + pCounts.drafts + tCounts.drafts + stCounts.drafts;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-[color:var(--text-muted)]">
            Overview of all site content. Click a card to manage it.
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
            <span className="text-[color:var(--text-muted)]"> — open Preview to review, then publish from each section.</span>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="p-6 glass hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--text-muted)] font-mono">
                    {c.label}
                  </div>
                  <div className="mt-3 font-display font-bold text-4xl text-gradient">{c.total}</div>
                  {c.drafts > 0 && (
                    <div className="mt-1 text-xs font-mono text-primary">+{c.drafts} draft{c.drafts === 1 ? "" : "s"}</div>
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-brand/20 border border-border flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6 glass">
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[color:var(--surface-2)] border border-border hover:border-primary/40 transition-all"
            >
              <c.icon className="h-4 w-4 text-primary" />
              <span className="text-sm">Manage {c.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}