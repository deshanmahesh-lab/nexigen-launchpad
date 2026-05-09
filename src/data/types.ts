export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  span: string | null;
  order_index: number;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  problem: string;
  stack: string[];
  metric: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  flag: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface SiteConfig {
  key: string;
  value: Record<string, unknown>;
}