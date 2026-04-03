
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
