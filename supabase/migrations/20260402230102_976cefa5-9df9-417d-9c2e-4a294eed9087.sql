
-- Add source_id and source columns to releases, news, gallery_items
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS source_id text UNIQUE;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.news ADD COLUMN IF NOT EXISTS source_id text UNIQUE;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS source_id text UNIQUE;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS source text;
