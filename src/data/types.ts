export type ItemStatus = "published" | "draft";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  span: string | null;
  order_index: number;
  status: ItemStatus;
  original_id: string | null;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  problem: string;
  stack: string[];
  metric: string;
  gradient: string;
  status: ItemStatus;
  original_id: string | null;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  flag: string;
  status: ItemStatus;
  original_id: string | null;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  status: ItemStatus;
  original_id: string | null;
}

export interface SiteConfig {
  key: string;
  value: Record<string, unknown>;
}