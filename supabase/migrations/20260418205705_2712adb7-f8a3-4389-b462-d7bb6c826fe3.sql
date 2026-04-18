
-- ============ ARTISTS ============
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  photo_url TEXT,
  short_description TEXT,
  bio TEXT,
  genres TEXT[] NOT NULL DEFAULT '{}',
  formats TEXT[] NOT NULL DEFAULT '{}',
  cities TEXT[] NOT NULL DEFAULT '{}',
  price_min INTEGER,
  price_max INTEGER,
  rider TEXT,
  popularity INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published artists" ON public.artists
  FOR SELECT USING (published = true);

CREATE POLICY "Admin full access artists" ON public.artists
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_artists_featured ON public.artists(featured) WHERE featured = true;
CREATE INDEX idx_artists_genres ON public.artists USING GIN(genres);
CREATE INDEX idx_artists_formats ON public.artists USING GIN(formats);

-- ============ ARTIST MEDIA ============
CREATE TABLE public.artist_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo','video','audio')),
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artist_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read artist_media" ON public.artist_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.artists WHERE artists.id = artist_media.artist_id AND artists.published = true)
  );

CREATE POLICY "Admin full access artist_media" ON public.artist_media
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_artist_media_artist ON public.artist_media(artist_id);

-- ============ SERVICES ============
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  packages JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published services" ON public.services
  FOR SELECT USING (published = true);

CREATE POLICY "Admin full access services" ON public.services
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ CASES ============
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cover_url TEXT,
  format TEXT,
  event_date DATE,
  client TEXT,
  city TEXT,
  description TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published cases" ON public.cases
  FOR SELECT USING (published = true);

CREATE POLICY "Admin full access cases" ON public.cases
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_cases_slug ON public.cases(slug);

-- ============ CASE_ARTISTS (M2M) ============
CREATE TABLE public.case_artists (
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, artist_id)
);

ALTER TABLE public.case_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read case_artists" ON public.case_artists
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_artists.case_id AND cases.published = true)
  );

CREATE POLICY "Admin full access case_artists" ON public.case_artists
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ EVENT INQUIRIES ============
CREATE TABLE public.event_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  company TEXT,
  event_date DATE,
  format TEXT,
  budget TEXT,
  city TEXT,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert event_inquiries" ON public.event_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read event_inquiries" ON public.event_inquiries
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update event_inquiries" ON public.event_inquiries
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete event_inquiries" ON public.event_inquiries
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEED: SHABBLY as first artist ============
INSERT INTO public.artists (slug, name, short_description, bio, genres, formats, cities, popularity, featured, sort_order)
VALUES (
  'shabbly',
  'SHABBLY',
  'Современная поп-исполнительница с дерзким сценическим образом',
  'SHABBLY — флагманский артист агентства. Яркая сценическая подача, авторский материал, опыт сольных концертов и корпоративных выступлений.',
  ARRAY['pop','indie','electronic'],
  ARRAY['concert','corporate','private','club'],
  ARRAY['Москва','Санкт-Петербург'],
  100,
  true,
  0
) ON CONFLICT (slug) DO NOTHING;

-- ============ SEED: starter services ============
INSERT INTO public.services (slug, title, description, icon, sort_order, packages) VALUES
  ('artist-booking', 'Букинг артистов', 'Подбор и бронирование исполнителей под формат вашего мероприятия — от клубного выступления до корпоратива.', 'Mic2', 1, '[]'::jsonb),
  ('event-production', 'Полный продакшн мероприятий', 'От концепции до реализации: площадка, техника, сценарий, артисты, координация.', 'Sparkles', 2, '[]'::jsonb),
  ('artist-management', 'Менеджмент артистов', 'Развитие карьеры исполнителей: гастроли, релизы, бренд-коммуникации.', 'TrendingUp', 3, '[]'::jsonb),
  ('private-events', 'Закрытые мероприятия', 'Свадьбы, дни рождения, частные вечера с премиальной артистической программой.', 'Crown', 4, '[]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
