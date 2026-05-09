import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Wrench, Briefcase, MessageSquareQuote, BarChart3 } from "lucide-react";
import {
  fetchServices,
  fetchProjects,
  fetchTestimonials,
  fetchStats,
} from "@/lib/queries";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const services = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const projects = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const testimonials = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  const stats = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  const cards = [
    { label: "Services", count: services.data?.length ?? 0, icon: Wrench, to: "/admin/services" },
    { label: "Projects", count: projects.data?.length ?? 0, icon: Briefcase, to: "/admin/projects" },
    { label: "Testimonials", count: testimonials.data?.length ?? 0, icon: MessageSquareQuote, to: "/admin/testimonials" },
    { label: "Stats", count: stats.data?.length ?? 0, icon: BarChart3, to: "/admin/stats" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-[color:var(--text-muted)]">
          Overview of all site content. Click a card to manage it.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="p-6 glass hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--text-muted)] font-mono">
                    {c.label}
                  </div>
                  <div className="mt-3 font-display font-bold text-4xl text-gradient">{c.count}</div>
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