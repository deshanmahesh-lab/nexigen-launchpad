import { ArrowRight, Code2, Cloud, Brain, Smartphone, Plug, Palette, Shield, CheckCircle2, Globe2, Sparkles, Github, Linkedin, Twitter, Dribbble, Mail, MapPin, Clock, Star, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchProjects, fetchStats, fetchTestimonials } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Code2, Cloud, Brain, Smartphone, Plug, Palette, Shield, CheckCircle2, Globe2, Sparkles,
};

/* ------------ HERO ------------ */
export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="orb animate-orb-1" style={{ top: "-100px", left: "-100px", width: 600, height: 600, background: "rgba(124,196,232,0.18)", filter: "blur(120px)" }} />
      <div className="orb animate-orb-2" style={{ bottom: "-120px", right: "-120px", width: 500, height: 500, background: "rgba(139,110,196,0.22)", filter: "blur(110px)" }} />
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono mb-8 animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Engineering Tomorrow's Digital Foundations
        </div>
        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-tight animate-fade-up" style={{ animationDelay: "0.05s" }}>
          We Engineer Software <br className="hidden md:block" />
          That <span className="text-gradient">Scales Globally.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-[color:var(--text-muted)] animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Nexigen builds custom enterprise software, cloud infrastructure, and AI-integrated platforms for businesses worldwide — from Colombo to California.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold bg-gradient-brand text-primary-foreground hover:scale-[1.03] hover:shadow-[0_0_50px_-8px_rgba(139,110,196,0.7)] transition-all">
            Start Your Project <ArrowRight className="h-5 w-5" />
          </a>
          <a href="#work" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold glass hover:border-primary/40 hover:scale-[1.02] transition-all">
            View Our Work
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.7s" }}>
          {["ISO 27001 Certified", "GDPR Compliant", "50+ Projects", "10+ Countries Served"].map((b) => (
            <span key={b} className="glass rounded-full px-4 py-1.5 text-xs text-[color:var(--text-muted)]">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ MARQUEE ------------ */
export function Marquee() {
  const items = ["React", "Next.js", "Node.js", "AWS", "Docker", "Python", "PostgreSQL", "Kubernetes", "Terraform", "TypeScript", "GraphQL", "Redis"];
  const row = [...items, ...items];
  return (
    <section className="relative py-10 border-y border-border bg-[color:var(--surface)] overflow-hidden">
      <div className="flex marquee-track gap-12 whitespace-nowrap">
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-12 text-[color:var(--text-muted)] font-mono text-lg">
            <span className="hover:text-primary transition-colors">{it}</span>
            <span className="text-primary/40">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------ SERVICES ------------ */
export function Services() {
  const preview = usePreview();
  const { data, isLoading } = useQuery({
    queryKey: ["services", preview ? "preview" : "public"],
    queryFn: preview ? fetchServicesPreview : fetchServices,
  });
  const cards = data ?? [];
  return (
    <section id="services" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl">What We <span className="text-gradient">Build</span></h2>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)] text-lg">End-to-end software solutions engineered for scale, security, and measurable business impact.</p>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))
            : cards.map((c, i) => {
                const Icon = ICONS[c.icon] ?? Sparkles;
                return (
                  <Reveal key={c.id} delay={i * 60} className={c.span ?? ""}>
                    <div className="group relative h-full rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_rgba(124,196,232,0.35)]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand/20 border border-border mb-5">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold leading-snug">{c.title}</h3>
                      <p className="mt-3 text-[color:var(--text-muted)]">{c.description}</p>
                      <div className="mt-6 inline-flex items-center gap-1 text-sm text-primary opacity-80 group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}

/* ------------ PROCESS ------------ */
export function Process() {
  const steps = [
    { n: "01", t: "Discovery", d: "We learn your business goals and constraints." },
    { n: "02", t: "Architecture", d: "We design a scalable technical blueprint." },
    { n: "03", t: "Build & Iterate", d: "Agile sprints with weekly demos." },
    { n: "04", t: "Deploy & Scale", d: "CI/CD pipelines, monitoring, support." },
  ];
  return (
    <section className="relative py-28 bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><h2 className="font-display font-bold text-4xl md:text-6xl">Our <span className="text-gradient">Process</span></h2></Reveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] border-t-2 border-dashed border-primary/30" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative">
                <div className="h-14 w-14 rounded-full glass-strong flex items-center justify-center font-display font-bold text-lg bg-gradient-brand/10 border-primary/30">
                  <span className="text-gradient">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-[color:var(--text-muted)]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ STATS ------------ */
export function Stats() {
  const preview = usePreview();
  const { data, isLoading } = useQuery({
    queryKey: ["stats", preview ? "preview" : "public"],
    queryFn: preview ? fetchStatsPreview : fetchStats,
  });
  const stats = data ?? [];
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="orb" style={{ top: "10%", left: "10%", width: 400, height: 400, background: "rgba(124,196,232,0.12)", filter: "blur(120px)" }} />
      <div className="orb" style={{ bottom: "10%", right: "10%", width: 400, height: 400, background: "rgba(139,110,196,0.15)", filter: "blur(120px)" }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : stats.map((s) => (
                <Reveal key={s.id}>
                  <div className="text-center md:text-left">
                    <div className="font-display font-bold text-5xl md:text-7xl text-gradient leading-none">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-3 text-[color:var(--text-muted)]">{s.label}</div>
                  </div>
                </Reveal>
              ))}
        </div>
        <p className="mt-12 text-center text-[color:var(--text-muted)]">Numbers that reflect our commitment to excellence.</p>
      </div>
    </section>
  );
}

/* ------------ WORK ------------ */
export function Work() {
  const preview = usePreview();
  const { data, isLoading } = useQuery({
    queryKey: ["projects", preview ? "preview" : "public"],
    queryFn: preview ? fetchProjectsPreview : fetchProjects,
  });
  const projects = data ?? [];
  const tabs = ["All", "Enterprise", "FinTech", "Healthcare", "SaaS"];
  const [active, setActive] = useState("All");
  const visible = projects.filter((p) => active === "All" || p.category === active);
  return (
    <section id="work" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl">Our <span className="text-gradient">Work</span></h2>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActive(t)} className={`rounded-full px-4 py-2 text-sm transition-all ${active === t ? "bg-gradient-brand text-primary-foreground" : "glass hover:border-primary/40"}`}>{t}</button>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))
            : visible.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="group relative rounded-2xl glass overflow-hidden hover:-translate-y-1 hover:border-primary/40 transition-all">
                <div className={`h-44 bg-gradient-to-br ${p.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 dot-pattern opacity-50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs rounded-full glass px-3 py-1">{p.category}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <p className="mt-2 text-[color:var(--text-muted)] text-sm">{p.problem}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => <span key={s} className="text-xs font-mono glass rounded-md px-2 py-1">{s}</span>)}
                  </div>
                  <div className="mt-5 text-sm font-semibold text-gradient">{p.metric}</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground">View Case Study <ArrowRight className="h-4 w-4" /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 glass hover:border-primary/40 transition-all">View All Case Studies <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
}

/* ------------ TECH STACK ------------ */
export function TechStack() {
  const groups = [
    { c: "Frontend", items: ["React", "Next.js", "Vue.js", "TypeScript"] },
    { c: "Backend", items: ["Node.js", "Python", "Go", "Laravel"] },
    { c: "Cloud", items: ["AWS", "GCP", "Docker", "Kubernetes"] },
    { c: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"] },
    { c: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenAI APIs", "LangChain"] },
  ];
  return (
    <section className="relative py-28 bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl">Our <span className="text-gradient">Tech Stack</span></h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <Reveal key={g.c} delay={i * 60}>
              <div className="rounded-2xl glass p-6 h-full hover:border-primary/40 transition-all">
                <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">{g.c}</div>
                <div className="grid grid-cols-2 gap-3">
                  {g.items.map((t) => (
                    <div key={t} className="flex items-center gap-2 rounded-lg bg-[color:var(--surface-2)] px-3 py-2 text-sm border border-border">
                      <span className="h-2 w-2 rounded-full bg-gradient-brand" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ TESTIMONIALS ------------ */
export function Testimonials() {
  const preview = usePreview();
  const { data, isLoading } = useQuery({
    queryKey: ["testimonials", preview ? "preview" : "public"],
    queryFn: preview ? fetchTestimonialsPreview : fetchTestimonials,
  });
  const t = data ?? [];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><h2 className="font-display font-bold text-4xl md:text-6xl">What Clients <span className="text-gradient">Say</span></h2></Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))
            : t.map((x, i) => (
            <Reveal key={x.id} delay={i * 90}>
              <div className="rounded-2xl glass p-7 h-full hover:border-primary/40 hover:-translate-y-1 transition-all">
                <Quote className="h-8 w-8 text-primary" />
                <p className="mt-4 italic text-foreground/90 leading-relaxed">"{x.quote}"</p>
                <div className="mt-6 flex text-yellow-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">{x.name} <span className="ml-1">{x.flag}</span></div>
                  <div className="text-[color:var(--text-muted)]">{x.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ ABOUT ------------ */
export function About() {
  return (
    <section id="about" className="relative py-28 bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight">
            Built in Sri Lanka. <br /> Built for the <span className="text-gradient">World.</span>
          </h2>
          <div className="mt-6 space-y-4 text-[color:var(--text-muted)] leading-relaxed">
            <p>We started Nexigen with one belief: world-class software engineering shouldn't be limited by geography.</p>
            <p>Based in Sri Lanka — one of Asia's fastest-growing tech ecosystems — we combine elite engineering talent with global delivery standards to build software that competes at the highest level.</p>
            <p>From regulated FinTech platforms to AI-powered SaaS, we partner with ambitious teams shipping ambitious products.</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Radical Transparency", "Engineering Excellence", "Client Obsession", "Continuous Learning"].map((v) => (
              <span key={v} className="glass rounded-full px-4 py-1.5 text-xs">{v}</span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-square max-w-[480px] mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-30 blur-3xl" />
            <div className="relative h-full w-full rounded-3xl glass-strong overflow-hidden p-10">
              <div className="absolute inset-0 dot-pattern opacity-30" />
              <div className="relative h-full grid grid-cols-2 gap-4">
                {[
                  { l: "Founded", v: "2024" },
                  { l: "HQ", v: "Colombo, LK" },
                  { l: "Team", v: "Remote-First" },
                  { l: "Compliance", v: "ISO Certified" },
                ].map((it, i) => (
                  <div key={it.l} className="glass rounded-xl p-4 self-center animate-float-slow" style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="text-xs text-[color:var(--text-muted)]">{it.l}</div>
                    <div className="font-display font-semibold text-lg mt-1">{it.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------ CERTIFICATIONS ------------ */
export function Certs() {
  const certs = [
    { i: Shield, t: "ISO/IEC 27001", d: "Information security management" },
    { i: CheckCircle2, t: "SOC 2 Type II", d: "Audited security controls" },
    { i: Globe2, t: "GDPR Compliant", d: "EU data protection standard" },
    { i: Brain, t: "ISO/IEC 42001", d: "AI management systems" },
    { i: Sparkles, t: "WCAG 2.1 AA", d: "Accessibility compliance" },
  ];
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="orb" style={{ top: "20%", left: "30%", width: 500, height: 500, background: "rgba(139,110,196,0.12)", filter: "blur(140px)" }} />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-5xl">Globally Certified. <span className="text-gradient">Enterprise Ready.</span></h2>
        </Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {certs.map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <div className="glass rounded-2xl px-6 py-5 min-w-[220px] hover:border-primary/40 transition-all">
                <c.i className="h-6 w-6 mx-auto text-primary" />
                <div className="mt-3 font-display font-semibold">{c.t}</div>
                <div className="text-xs text-[color:var(--text-muted)] mt-1">{c.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ CAREERS ------------ */
export function Careers() {
  const benefits = [
    { e: "🌍", t: "Work Fully Remote", d: "From anywhere, on your schedule." },
    { e: "💡", t: "Continuous Learning Budget", d: "Annual stipend for courses, books, and conferences." },
    { e: "📈", t: "Equity Opportunities", d: "Own a piece of what you help build." },
  ];
  const roles = [
    { t: "Senior React Developer", d: "Engineering" },
    { t: "Node.js Backend Engineer", d: "Engineering" },
    { t: "UI/UX Designer", d: "Design" },
    { t: "DevOps Engineer", d: "Infrastructure" },
  ];
  return (
    <section id="careers" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl">Join the <span className="text-gradient">Team</span></h2>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)] text-lg">We're looking for engineers who want to build things that matter — remotely, flexibly, ambitiously.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <Reveal key={b.t} delay={i * 70}>
              <div className="glass rounded-2xl p-6 h-full hover:border-primary/40 transition-all">
                <div className="text-3xl">{b.e}</div>
                <div className="mt-3 font-display font-semibold text-lg">{b.t}</div>
                <div className="text-[color:var(--text-muted)] mt-2 text-sm">{b.d}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="font-display text-2xl font-semibold mb-5">Open Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r, i) => (
              <Reveal key={r.t} delay={i * 60}>
                <div className="group flex items-center justify-between gap-4 glass rounded-xl p-5 hover:border-primary/40 transition-all">
                  <div>
                    <div className="font-display font-semibold">{r.t}</div>
                    <div className="text-xs text-[color:var(--text-muted)] mt-1">{r.d} • Full-time • Remote</div>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">Apply <ArrowRight className="h-4 w-4" /></a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[color:var(--text-muted)]">
            Don't see your role? <a href="#contact" className="text-primary hover:underline">Send us your CV →</a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------ BLOG ------------ */
export function Blog() {
  const posts = [
    { c: "Tech Architecture", t: "Building Scalable Multi-Tenant SaaS on AWS", r: "8 min read" },
    { c: "Industry", t: "Why Sri Lanka is Becoming Asia's Next Dev Hub", r: "5 min read" },
    { c: "Business", t: "The Hidden Costs of Offshore Development (And How We Solved Them)", r: "6 min read" },
  ];
  return (
    <section id="blog" className="relative py-28 bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><h2 className="font-display font-bold text-4xl md:text-6xl">From Our <span className="text-gradient">Engineers</span></h2></Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <article className="rounded-2xl glass overflow-hidden hover:-translate-y-1 hover:border-primary/40 transition-all h-full flex flex-col">
                <div className="h-36 bg-gradient-to-br from-[#7CC4E8]/25 to-[#8B6EC4]/25 dot-pattern" />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs rounded-full glass px-3 py-1 self-start">{p.c}</span>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{p.t}</h3>
                  <div className="mt-auto pt-5 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--text-muted)]">{p.r}</span>
                    <a href="#" className="text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">Read Article <ArrowRight className="h-4 w-4" /></a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ CONTACT ------------ */
export function Contact() {
  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      <div className="orb" style={{ top: "10%", left: "5%", width: 500, height: 500, background: "rgba(124,196,232,0.18)", filter: "blur(130px)" }} />
      <div className="orb" style={{ bottom: "5%", right: "5%", width: 500, height: 500, background: "rgba(139,110,196,0.22)", filter: "blur(130px)" }} />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl">Ready to Build Something <span className="text-gradient">Extraordinary?</span></h2>
          <p className="mt-5 text-[color:var(--text-muted)] text-lg max-w-2xl mx-auto">Tell us about your project. We'll respond within 24 hours with a technical assessment and timeline.</p>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll be in touch within 24 hours."); }} className="mt-12 glass-strong rounded-3xl p-6 md:p-10 text-left space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name" name="name" required />
              <Input label="Company" name="company" />
              <Input label="Email" name="email" type="email" required />
              <Select label="Project Type" name="project_type" options={["Web Application", "Mobile App", "Enterprise Software", "Cloud Infrastructure", "AI Integration", "Other"]} />
              <Select label="Budget Range" name="budget" options={["$5k–$15k", "$15k–$50k", "$50k–$150k", "$150k+"]} />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[color:var(--text-muted)]">Message</label>
              <textarea name="message" rows={5} required className="mt-2 w-full rounded-xl bg-[color:var(--surface-2)] border border-border px-4 py-3 text-foreground outline-none focus:border-primary/60 transition" />
            </div>
            <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold bg-gradient-brand text-primary-foreground hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(139,110,196,0.7)] transition-all">
              Send Message <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2"><Mail className="h-4 w-4 text-primary" /> hello@nexigen.io</span>
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2"><MapPin className="h-4 w-4 text-primary" /> Colombo, Sri Lanka</span>
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2"><Clock className="h-4 w-4 text-primary" /> Mon–Fri, 9am–6pm IST</span>
        </div>
      </div>
    </section>
  );
}
function Input({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-widest text-[color:var(--text-muted)]">{label}</label>
      <input name={name} type={type} required={required} className="mt-2 w-full rounded-xl bg-[color:var(--surface-2)] border border-border px-4 py-3 text-foreground outline-none focus:border-primary/60 transition" />
    </div>
  );
}
function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-widest text-[color:var(--text-muted)]">{label}</label>
      <select name={name} defaultValue="" className="mt-2 w-full rounded-xl bg-[color:var(--surface-2)] border border-border px-4 py-3 text-foreground outline-none focus:border-primary/60 transition">
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ------------ FOOTER ------------ */
export function Footer() {
  return (
    <footer className="relative mt-10 bg-[#0A0E1A]">
      <div className="h-px bg-gradient-brand opacity-60" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display font-bold text-xl text-gradient">NEXIGEN</div>
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">Engineering Tomorrow's Digital Foundations.</p>
          <div className="mt-5 flex gap-3">
            {[Linkedin, Github, Twitter, Dribbble].map((I, i) => (
              <a key={i} aria-label="social" href="#" className="glass rounded-full p-2 hover:border-primary/40 transition-all"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <FooterCol title="Services" links={["Enterprise Software", "Cloud & DevOps", "AI Integration", "Mobile Apps", "UI/UX Design"]} />
        <FooterCol title="Company" links={["About", "Case Studies", "Careers", "Blog", "Press"]} />
        <FooterCol title="Legal & Contact" links={["Privacy Policy", "Terms of Service", "hello@nexigen.io", "Colombo, Sri Lanka 🇱🇰"]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[color:var(--text-muted)]">
          <span>© 2025 Nexigen (Pvt) Ltd. All rights reserved.</span>
          <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1"><Shield className="h-3 w-3 text-primary" /> ISO 27001 Certified</span>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-display font-semibold mb-4">{title}</div>
      <ul className="space-y-2 text-sm text-[color:var(--text-muted)]">
        {links.map((l) => <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
}
