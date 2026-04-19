-- Add media_type to gallery_items so we can store videos alongside images
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';