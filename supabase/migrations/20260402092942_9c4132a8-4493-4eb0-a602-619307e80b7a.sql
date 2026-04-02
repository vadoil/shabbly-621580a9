
-- Enums
CREATE TYPE public.release_type AS ENUM ('album', 'single', 'ep');
CREATE TYPE public.platform_type AS ENUM ('yandex', 'spotify', 'apple', 'youtube');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Releases
CREATE TABLE public.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type release_type NOT NULL DEFAULT 'single',
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  release_date DATE,
  description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tracks
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES public.releases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_url TEXT,
  duration_sec INT,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT false
);

-- Platform links
CREATE TABLE public.platform_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES public.releases(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  url TEXT NOT NULL
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date_start TIMESTAMPTZ NOT NULL,
  date_end TIMESTAMPTZ,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  address TEXT,
  ticket_url TEXT,
  status TEXT DEFAULT 'scheduled',
  published BOOLEAN DEFAULT false
);

-- Ticket requests
CREATE TABLE public.ticket_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  qty INT DEFAULT 1,
  comment TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now(),
  published BOOLEAN DEFAULT false
);

-- Friend events
CREATE TABLE public.friend_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date_start TIMESTAMPTZ NOT NULL,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  url TEXT NOT NULL,
  raw_json JSONB,
  last_seen_at TIMESTAMPTZ DEFAULT now()
);

-- User roles (separate table per security best practices)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: releases
CREATE POLICY "Public read published releases" ON public.releases
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access releases" ON public.releases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: tracks
CREATE POLICY "Public read published tracks" ON public.tracks
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access tracks" ON public.tracks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: platform_links (public read via join with published releases)
CREATE POLICY "Public read platform_links" ON public.platform_links
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.releases WHERE id = release_id AND published = true)
  );
CREATE POLICY "Admin full access platform_links" ON public.platform_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: events
CREATE POLICY "Public read published events" ON public.events
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access events" ON public.events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: ticket_requests
CREATE POLICY "Public insert ticket_requests" ON public.ticket_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read ticket_requests" ON public.ticket_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update ticket_requests" ON public.ticket_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete ticket_requests" ON public.ticket_requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS: news
CREATE POLICY "Public read published news" ON public.news
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access news" ON public.news
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: friend_events (public read)
CREATE POLICY "Public read friend_events" ON public.friend_events
  FOR SELECT USING (true);
CREATE POLICY "Admin full access friend_events" ON public.friend_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: user_roles
CREATE POLICY "Admin read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);

-- Storage policies
CREATE POLICY "Public read covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Admin upload covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Admin upload audio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update audio" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete audio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_releases_published ON public.releases(published, release_date DESC);
CREATE INDEX idx_tracks_release ON public.tracks(release_id, order_index);
CREATE INDEX idx_events_published ON public.events(published, date_start);
CREATE INDEX idx_news_published ON public.news(published, published_at DESC);
CREATE INDEX idx_friend_events_date ON public.friend_events(date_start);
CREATE INDEX idx_ticket_requests_status ON public.ticket_requests(status, created_at DESC);
