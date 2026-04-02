
-- Gallery
CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  cover_url text,
  description text,
  published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published gallery_albums" ON public.gallery_albums FOR SELECT TO public USING (published = true);
CREATE POLICY "Admin full access gallery_albums" ON public.gallery_albums FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published gallery_items" ON public.gallery_items FOR SELECT TO public USING (published = true);
CREATE POLICY "Admin full access gallery_items" ON public.gallery_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Merch
CREATE TABLE public.merch_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  price_text text,
  cover_url text,
  category text DEFAULT 'other',
  published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.merch_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published merch_products" ON public.merch_products FOR SELECT TO public USING (published = true);
CREATE POLICY "Admin full access merch_products" ON public.merch_products FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.merch_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.merch_products(id) ON DELETE CASCADE NOT NULL,
  size text,
  color text,
  sku text,
  in_stock boolean DEFAULT true
);
ALTER TABLE public.merch_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read merch_variants" ON public.merch_variants FOR SELECT TO public USING (EXISTS (SELECT 1 FROM merch_products WHERE merch_products.id = merch_variants.product_id AND merch_products.published = true));
CREATE POLICY "Admin full access merch_variants" ON public.merch_variants FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.merch_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.merch_products(id) ON DELETE SET NULL,
  name text NOT NULL,
  contact text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);
ALTER TABLE public.merch_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert merch_requests" ON public.merch_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin read merch_requests" ON public.merch_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update merch_requests" ON public.merch_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete merch_requests" ON public.merch_requests FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Team members (separate from band_members for flexibility)
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text DEFAULT '',
  bio text,
  photo_url text,
  order_index integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published team_members" ON public.team_members FOR SELECT TO public USING (published = true);
CREATE POLICY "Admin full access team_members" ON public.team_members FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Track-level links
CREATE TABLE public.track_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  url text NOT NULL
);
ALTER TABLE public.track_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read track_links" ON public.track_links FOR SELECT TO public USING (EXISTS (SELECT 1 FROM tracks WHERE tracks.id = track_links.track_id AND tracks.published = true));
CREATE POLICY "Admin full access track_links" ON public.track_links FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
