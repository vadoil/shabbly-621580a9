ALTER TABLE public.releases
  ADD COLUMN IF NOT EXISTS artist_id uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS genre text;

CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON public.releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_releases_genre ON public.releases(genre);