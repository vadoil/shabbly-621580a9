CREATE TABLE public.artist_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  project_name text,
  contact text NOT NULL,
  city text,
  genres text[] NOT NULL DEFAULT '{}',
  cities text[] NOT NULL DEFAULT '{}',
  music_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience text,
  about text,
  expectations text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.artist_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert artist_applications"
  ON public.artist_applications FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "Admin read artist_applications"
  ON public.artist_applications FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update artist_applications"
  ON public.artist_applications FOR UPDATE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete artist_applications"
  ON public.artist_applications FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_artist_applications_updated_at
  BEFORE UPDATE ON public.artist_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_artist_applications_status ON public.artist_applications(status);
CREATE INDEX idx_artist_applications_created ON public.artist_applications(created_at DESC);