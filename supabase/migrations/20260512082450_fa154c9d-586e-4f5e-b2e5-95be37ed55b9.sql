
-- process_steps
CREATE TABLE public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "admins write process_steps" ON public.process_steps FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- tech_stack
CREATE TABLE public.tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tech_stack" ON public.tech_stack FOR SELECT USING (true);
CREATE POLICY "admins write tech_stack" ON public.tech_stack FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- perks
CREATE TABLE public.perks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji TEXT NOT NULL DEFAULT '✨',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.perks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read perks" ON public.perks FOR SELECT USING (true);
CREATE POLICY "admins write perks" ON public.perks FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- open_roles
CREATE TABLE public.open_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Full-time',
  apply_link TEXT NOT NULL DEFAULT '#',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.open_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read open_roles" ON public.open_roles FOR SELECT USING (true);
CREATE POLICY "admins write open_roles" ON public.open_roles FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- blog_posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '#',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "admins write blog_posts" ON public.blog_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- contact_messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  project_type TEXT,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submit contact" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins view contact" ON public.contact_messages FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins update contact" ON public.contact_messages FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins delete contact" ON public.contact_messages FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

-- Seed site_config keys
INSERT INTO public.site_config (key, value) VALUES
  ('hero', jsonb_build_object(
    'badge','Engineering Tomorrow''s Digital Foundations',
    'title_line1','We Engineer Software',
    'title_line2','That Scales Globally.',
    'description','Nexigen builds custom enterprise software, cloud infrastructure, and AI-integrated platforms for businesses worldwide — from Colombo to California.'
  )),
  ('about', jsonb_build_object(
    'title','Built in Sri Lanka. Built for the World.',
    'paragraphs', jsonb_build_array(
      'We started Nexigen with one belief: world-class software engineering shouldn''t be limited by geography.',
      'Based in Sri Lanka — one of Asia''s fastest-growing tech ecosystems — we combine elite engineering talent with global delivery standards to build software that competes at the highest level.',
      'From regulated FinTech platforms to AI-powered SaaS, we partner with ambitious teams shipping ambitious products.'
    )
  )),
  ('certs', jsonb_build_object(
    'title','Globally Certified. Enterprise Ready.'
  )),
  ('careers_intro', jsonb_build_object(
    'description','We''re looking for engineers who want to build things that matter — remotely, flexibly, ambitiously.'
  )),
  ('contact_info', jsonb_build_object(
    'email','hello@nexigen.io',
    'phone','',
    'location','Colombo, Sri Lanka',
    'hours','Mon–Fri, 9am–6pm IST'
  )),
  ('footer', jsonb_build_object(
    'tagline','Engineering Tomorrow''s Digital Foundations.',
    'email','hello@nexigen.io',
    'location','Colombo, Sri Lanka 🇱🇰',
    'copyright','© 2025 Nexigen (Pvt) Ltd. All rights reserved.',
    'linkedin','#',
    'github','#',
    'twitter','#',
    'dribbble','#'
  ))
ON CONFLICT (key) DO NOTHING;
