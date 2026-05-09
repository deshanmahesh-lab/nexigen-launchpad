import { supabase } from "@/lib/supabase";
import type { Service, Project, Testimonial, Stat, SiteConfig } from "@/data/types";

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id,title,description,icon,span,order_index")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("fetchServices", error);
    return [];
  }
  return (data ?? []) as Service[];
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,category,problem,stack,metric,gradient")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchProjects", error);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("id,quote,name,role,flag")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchTestimonials", error);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

export async function fetchStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from("stats")
    .select("id,label,value,suffix")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchStats", error);
    return [];
  }
  return (data ?? []) as Stat[];
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