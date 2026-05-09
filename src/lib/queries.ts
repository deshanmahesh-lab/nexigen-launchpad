import { supabase } from "@/lib/supabase";
import type { Service, Project, Testimonial, Stat, SiteConfig } from "@/data/types";

const SERVICE_COLS = "id,title,description,icon,span,order_index,status,original_id";
const PROJECT_COLS = "id,name,category,problem,stack,metric,gradient,status,original_id,created_at";
const TESTIMONIAL_COLS = "id,quote,name,role,flag,status,original_id,created_at";
const STAT_COLS = "id,label,value,suffix,status,original_id,created_at";

/** In preview mode, drafts replace their published originals; standalone drafts are appended. */
function mergeForPreview<T extends { id: string; status: "published" | "draft"; original_id: string | null }>(
  rows: T[],
): T[] {
  const drafts = rows.filter((r) => r.status === "draft");
  const editedIds = new Set(drafts.map((d) => d.original_id).filter((v): v is string => !!v));
  const result: T[] = [];
  for (const r of rows) {
    if (r.status === "published" && editedIds.has(r.id)) {
      const draft = drafts.find((d) => d.original_id === r.id)!;
      result.push(draft);
    } else if (r.status === "published") {
      result.push(r);
    }
  }
  // Append brand-new drafts (no original) at the end
  for (const d of drafts) if (!d.original_id) result.push(d);
  return result;
}

/* ---------------- SERVICES ---------------- */
export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_COLS)
    .eq("status", "published")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("fetchServices", error);
    return [];
  }
  return (data ?? []) as Service[];
}

export async function fetchServicesAll(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_COLS)
    .order("order_index", { ascending: true });
  if (error) { console.error("fetchServicesAll", error); return []; }
  return (data ?? []) as Service[];
}

export async function fetchServicesPreview(): Promise<Service[]> {
  const all = await fetchServicesAll();
  return mergeForPreview(all);
}

/* ---------------- PROJECTS ---------------- */
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLS)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchProjects", error);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function fetchProjectsAll(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLS)
    .order("created_at", { ascending: true });
  if (error) { console.error("fetchProjectsAll", error); return []; }
  return (data ?? []) as Project[];
}

export async function fetchProjectsPreview(): Promise<Project[]> {
  return mergeForPreview(await fetchProjectsAll());
}

/* ---------------- TESTIMONIALS ---------------- */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLS)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchTestimonials", error);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

export async function fetchTestimonialsAll(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLS)
    .order("created_at", { ascending: true });
  if (error) { console.error("fetchTestimonialsAll", error); return []; }
  return (data ?? []) as Testimonial[];
}

export async function fetchTestimonialsPreview(): Promise<Testimonial[]> {
  return mergeForPreview(await fetchTestimonialsAll());
}

/* ---------------- STATS ---------------- */
export async function fetchStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from("stats")
    .select(STAT_COLS)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchStats", error);
    return [];
  }
  return (data ?? []) as Stat[];
}

export async function fetchStatsAll(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from("stats")
    .select(STAT_COLS)
    .order("created_at", { ascending: true });
  if (error) { console.error("fetchStatsAll", error); return []; }
  return (data ?? []) as Stat[];
}

export async function fetchStatsPreview(): Promise<Stat[]> {
  return mergeForPreview(await fetchStatsAll());
}

export async function fetchSiteConfig(key: string): Promise<SiteConfig | null> {
  const { data, error } = await supabase
    .from("site_config")
    .select("key,value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("fetchSiteConfig", error);
    return null;
  }
  if (!data) return null;
  return { key: data.key, value: data.value as Record<string, unknown> };
}