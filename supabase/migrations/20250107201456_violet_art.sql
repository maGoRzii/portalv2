/*
  # Holiday Management

  1. New Tables
    - `holidays`
      - `date` (date, primary key)
      - `name` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `holidays` table
    - Add policies for public read access
    - Add policies for authenticated users to manage holidays
*/

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  date date PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for holidays"
ON holidays FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage holidays"
ON holidays FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_holidays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON holidays
  FOR EACH ROW
  EXECUTE FUNCTION update_holidays_updated_at();

-- Insert initial holidays
INSERT INTO holidays (date, name) VALUES
  ('2025-04-18', 'Viernes Santo'),
  ('2025-04-21', 'Lunes de Pascua'),
  ('2025-05-01', 'Día del Trabajo'),
  ('2025-06-24', 'San Juan'),
  ('2025-08-15', 'Asunción de la Virgen'),
  ('2025-09-08', 'Fiesta mayor de La Jonquera'),
  ('2025-09-11', 'Diada de Cataluña'),
  ('2025-11-01', 'Todos los Santos'),
  ('2025-12-06', 'Día de la Constitución'),
  ('2025-12-08', 'Inmaculada Concepción'),
  ('2025-12-26', 'San Esteban')
ON CONFLICT (date) DO UPDATE SET name = EXCLUDED.name;