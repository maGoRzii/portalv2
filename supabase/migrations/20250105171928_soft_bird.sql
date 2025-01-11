-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for training groups" ON training_groups;
DROP POLICY IF EXISTS "Public read access for training entries" ON training_entries;
DROP POLICY IF EXISTS "Public read access for training media" ON training_media;
DROP POLICY IF EXISTS "Authenticated users can manage training groups" ON training_groups;
DROP POLICY IF EXISTS "Authenticated users can manage training entries" ON training_entries;
DROP POLICY IF EXISTS "Authenticated users can manage training media" ON training_media;

-- Create policies
CREATE POLICY "Public read access for training groups"
ON training_groups FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for training entries"
ON training_entries FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for training media"
ON training_media FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage training groups"
ON training_groups FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage training entries"
ON training_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage training media"
ON training_media FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial training groups if they don't exist
INSERT INTO training_groups (name, slug, description)
SELECT name, slug, description
FROM (VALUES
  ('Operaciones', 'operaciones', 'Formación sobre operaciones y procesos'),
  ('Probador', 'probador', 'Formación sobre gestión del probador'),
  ('Caja', 'caja', 'Formación sobre procesos de caja'),
  ('Mujer', 'mujer', 'Formación específica sección mujer'),
  ('Hombre', 'hombre', 'Formación específica sección hombre'),
  ('Niño', 'nino', 'Formación específica sección niño'),
  ('Showroom', 'showroom', 'Formación sobre showroom'),
  ('Sint', 'sint', 'Formación sobre Sint')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM training_groups WHERE slug = v.slug
);

-- Add feature flag for training section if it doesn't exist
INSERT INTO feature_flags (name, enabled)
VALUES ('training_enabled', true)
ON CONFLICT (name) DO NOTHING;