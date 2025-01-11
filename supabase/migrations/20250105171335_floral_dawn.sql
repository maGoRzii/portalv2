/*
  # Training Section Schema

  1. New Tables
    - `training_groups` - For different sections (Operations, Fitting Room, etc.)
    - `training_entries` - For blog-like entries within each group
    - `training_media` - For images and videos attached to entries

  2. Security
    - Enable RLS on all tables
    - Public read access
    - Only authenticated users can write
*/

-- Create training groups table
CREATE TABLE training_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create training entries table
CREATE TABLE training_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES training_groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(group_id, slug)
);

-- Create training media table
CREATE TABLE training_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES training_entries(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE training_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_media ENABLE ROW LEVEL SECURITY;

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

-- Insert initial training groups
INSERT INTO training_groups (name, slug, description) VALUES
  ('Operaciones', 'operaciones', 'Formación sobre operaciones y procesos'),
  ('Probador', 'probador', 'Formación sobre gestión del probador'),
  ('Caja', 'caja', 'Formación sobre procesos de caja'),
  ('Mujer', 'mujer', 'Formación específica sección mujer'),
  ('Hombre', 'hombre', 'Formación específica sección hombre'),
  ('Niño', 'nino', 'Formación específica sección niño'),
  ('Showroom', 'showroom', 'Formación sobre showroom'),
  ('Sint', 'sint', 'Formación sobre Sint');

-- Add feature flag for training section
INSERT INTO feature_flags (name, enabled)
VALUES ('training_enabled', true)
ON CONFLICT (name) DO NOTHING;