
ALTER TABLE public.services ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.services ADD COLUMN original_id uuid REFERENCES public.services(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD CONSTRAINT services_status_check CHECK (status IN ('published','draft'));
CREATE UNIQUE INDEX services_one_draft_per_original ON public.services(original_id) WHERE original_id IS NOT NULL;

ALTER TABLE public.projects ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.projects ADD COLUMN original_id uuid REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD CONSTRAINT projects_status_check CHECK (status IN ('published','draft'));
CREATE UNIQUE INDEX projects_one_draft_per_original ON public.projects(original_id) WHERE original_id IS NOT NULL;

ALTER TABLE public.testimonials ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.testimonials ADD COLUMN original_id uuid REFERENCES public.testimonials(id) ON DELETE CASCADE;
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_status_check CHECK (status IN ('published','draft'));
CREATE UNIQUE INDEX testimonials_one_draft_per_original ON public.testimonials(original_id) WHERE original_id IS NOT NULL;

ALTER TABLE public.stats ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.stats ADD COLUMN original_id uuid REFERENCES public.stats(id) ON DELETE CASCADE;
ALTER TABLE public.stats ADD CONSTRAINT stats_status_check CHECK (status IN ('published','draft'));
CREATE UNIQUE INDEX stats_one_draft_per_original ON public.stats(original_id) WHERE original_id IS NOT NULL;
