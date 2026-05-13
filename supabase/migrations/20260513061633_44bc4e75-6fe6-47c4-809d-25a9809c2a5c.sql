
-- portal_messages table
CREATE TABLE public.portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_from_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portal_messages_customer_created ON public.portal_messages(customer_id, created_at);

ALTER TABLE public.portal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers view own messages" ON public.portal_messages
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "customers send own messages" ON public.portal_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND is_from_admin = false
  );

CREATE POLICY "admins send any messages" ON public.portal_messages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND is_from_admin = true);

CREATE POLICY "admins delete messages" ON public.portal_messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.portal_messages;
ALTER TABLE public.portal_messages REPLICA IDENTITY FULL;

-- Bootstrap trigger: first user -> admin, rest -> customer
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- Customer-submitted testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE POLICY "customers submit draft testimonial" ON public.testimonials
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    AND status = 'draft'
    AND original_id IS NULL
  );

CREATE POLICY "customers view own drafts" ON public.testimonials
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());
