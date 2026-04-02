
-- venues_external table
CREATE TABLE public.venues_external (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  address text,
  metro text,
  last_seen_at timestamptz DEFAULT now(),
  UNIQUE(source, source_id)
);

ALTER TABLE public.venues_external ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read venues_external" ON public.venues_external
  FOR SELECT TO public USING (true);

CREATE POLICY "Admin full access venues_external" ON public.venues_external
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- bar_events_external table
CREATE TABLE public.bar_events_external (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id text NOT NULL,
  venue_id uuid REFERENCES public.venues_external(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  date_start timestamptz NOT NULL,
  date_text_raw text,
  url text NOT NULL,
  city text NOT NULL DEFAULT 'Москва',
  last_seen_at timestamptz DEFAULT now(),
  UNIQUE(source, source_id)
);

ALTER TABLE public.bar_events_external ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read bar_events_external" ON public.bar_events_external
  FOR SELECT TO public USING (true);

CREATE POLICY "Admin full access bar_events_external" ON public.bar_events_external
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Enable pg_cron and pg_net for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
