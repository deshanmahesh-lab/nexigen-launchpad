
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  span text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  problem text not null,
  stack text[] not null default '{}',
  metric text not null,
  gradient text not null,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  flag text not null,
  created_at timestamptz not null default now()
);

create table public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value int not null,
  suffix text not null default '',
  created_at timestamptz not null default now()
);

create table public.site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.stats enable row level security;
alter table public.site_config enable row level security;

-- Public read
create policy "public read services" on public.services for select using (true);
create policy "public read projects" on public.projects for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read stats" on public.stats for select using (true);
create policy "public read site_config" on public.site_config for select using (true);

-- Public write (matches admin spec; hardcoded client-side auth)
create policy "public write services" on public.services for all using (true) with check (true);
create policy "public write projects" on public.projects for all using (true) with check (true);
create policy "public write testimonials" on public.testimonials for all using (true) with check (true);
create policy "public write stats" on public.stats for all using (true) with check (true);
create policy "public write site_config" on public.site_config for all using (true) with check (true);

insert into public.services (title, description, icon, span, order_index) values
  ('Custom Enterprise Software Development','We architect bespoke platforms that eliminate operational bottlenecks and drive revenue growth.','Code2','md:col-span-2',1),
  ('Cloud Infrastructure & DevOps','AWS, GCP, and Azure architectures built for 99.99% uptime.','Cloud',null,2),
  ('AI & Machine Learning Integration','Embed intelligent automation into your existing workflows.','Brain',null,3),
  ('Mobile App Development','Cross-platform iOS & Android applications.','Smartphone','md:col-span-2',4),
  ('API & Systems Integration','Connect your enterprise stack seamlessly.','Plug',null,5),
  ('UI/UX Design & Prototyping','User-centered design that converts.','Palette',null,6);

insert into public.projects (name, category, problem, stack, metric, gradient) values
  ('FinanceOS Platform','FinTech','Rebuilt core banking module reducing latency by 78%.',ARRAY['Node.js','PostgreSQL','AWS'],'↑ 78% Latency Reduction','from-[#7CC4E8]/30 to-[#8B6EC4]/30'),
  ('HealthBridge','Healthcare','HIPAA-compliant patient portal serving 50k+ users.',ARRAY['Next.js','Python','GCP'],'50k+ Active Users','from-[#5BB8D4]/30 to-[#A89FD8]/30'),
  ('LogiTrack ERP','Enterprise','Custom ERP system cutting manual ops time by 60%.',ARRAY['React','Go','Kubernetes'],'↑ 340% Performance Gain','from-[#8B6EC4]/30 to-[#7CC4E8]/30');

insert into public.testimonials (quote, name, role, flag) values
  ('Nexigen delivered our platform 2 weeks ahead of schedule. Their architecture decisions saved us $40k in infrastructure costs.','James R.','CTO, TechFlow Inc.','🇺🇸'),
  ('The team understood our compliance requirements immediately. No other agency came close to their technical depth.','Priya M.','Head of Engineering, MediCore','🇬🇧'),
  ('Working across time zones was seamless. Best offshore engineering partner we''ve ever had.','Lars K.','Founder, ScandiSaaS','🇸🇪');

insert into public.stats (label, value, suffix) values
  ('Projects Delivered',50,'+'),
  ('Countries Served',12,'+'),
  ('Client Retention Rate',98,'%'),
  ('Average Team Experience',5,'yrs');
