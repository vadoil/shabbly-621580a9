
-- Create bars table
CREATE TABLE public.bars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Москва',
  address text,
  phone text,
  website_url text,
  published boolean DEFAULT true
);

ALTER TABLE public.bars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published bars" ON public.bars
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admin full access bars" ON public.bars
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create bar_events table
CREATE TABLE public.bar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bar_id uuid NOT NULL REFERENCES public.bars(id) ON DELETE CASCADE,
  title text NOT NULL,
  date_start timestamptz NOT NULL,
  hall text,
  ticket_url text,
  source_url text UNIQUE,
  description text,
  published boolean DEFAULT true,
  last_synced_at timestamptz DEFAULT now()
);

ALTER TABLE public.bar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published bar_events" ON public.bar_events
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admin full access bar_events" ON public.bar_events
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed Rhythm & Blues Cafe
INSERT INTO public.bars (slug, name, city, address, phone, website_url)
VALUES (
  'rhythm-blues-cafe',
  'Rhythm & Blues Cafe',
  'Москва',
  'ул. Сретенка, 9, стр. 2',
  '+7 (495) 649-90-17',
  'https://rhythm-blues-cafe.ru/'
);
