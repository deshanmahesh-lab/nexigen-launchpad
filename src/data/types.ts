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

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  order_index: number;
}

export interface TechGroup {
  id: string;
  category: string;
  items: string[];
  order_index: number;
}

export interface Perk {
  id: string;
  emoji: string;
  title: string;
  description: string;
  order_index: number;
}

export interface OpenRole {
  id: string;
  title: string;
  department: string;
  type: string;
  apply_link: string;
  order_index: number;
}

export interface BlogPost {
  id: string;
  category: string;
  title: string;
  author: string;
  read_time: string;
  link: string;
  order_index: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  company: string | null;
  email: string;
  project_type: string | null;
  message: string;
  read: boolean;
  created_at: string;
}