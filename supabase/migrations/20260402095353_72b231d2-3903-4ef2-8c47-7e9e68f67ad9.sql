
-- site_sections table
CREATE TABLE public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  published boolean DEFAULT true
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published site_sections" ON public.site_sections
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admin full access site_sections" ON public.site_sections
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- band_members table
CREATE TABLE public.band_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean DEFAULT true
);

ALTER TABLE public.band_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published band_members" ON public.band_members
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admin full access band_members" ON public.band_members
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean DEFAULT true
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published partners" ON public.partners
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admin full access partners" ON public.partners
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed site_sections
INSERT INTO public.site_sections (key, title, content) VALUES
  ('hero_tagline', 'Голос внутренней свободы', 'Shabbly — это не просто музыка. Это пространство, где каждый находит свой голос.'),
  ('about_therapy', 'Искусство как терапия', 'Shabbly часто называет свои выступления «сеансами коллективной рефлексии». На сцене она растворяет границы между артистом и зрителем, превращая концерты в пространство диалога. Её аудитория — не пассивные слушатели, а соучастники, которые через её музыку находят ответы на свои вопросы. В интервью она подчеркивает: «Искусство должно бунтовать против шаблонов, даже если этот бунт тихий». Этот принцип отражается в её работе — от камерных акустических проектов до смелых коллабораций с современными визуальными художниками. Shabbly не просто поёт — она создаёт аудиовизуальные миры, где каждая деталь становится частью большого философского высказывания.'),
  ('about_band', 'Наша кавер-группа', 'Мы — команда музыкантов, объединённых любовью к живому звуку. Каждое выступление — это уникальный опыт, где кавер-версии обретают новое звучание.'),
  ('stats', 'Статистика', '40+|Музыкальные клипы\n30+|Популярные подкасты\n97k|Онлайн-слушатели'),
  ('partners_text', 'Наши партнёры', 'Мы сотрудничаем с лучшими площадками и брендами, чтобы каждое выступление стало незабываемым событием.');

-- Seed band_members
INSERT INTO public.band_members (name, role, sort_order) VALUES
  ('Светлана Яговкина', 'Вокалист', 1),
  ('Брэд Нельсон', 'Ведущий гитарист', 2),
  ('Дэвид Фаррелл', 'Басист', 3);

-- Add unique constraint for friend_events upsert
CREATE UNIQUE INDEX IF NOT EXISTS friend_events_source_source_id_idx ON public.friend_events (source, source_id);
