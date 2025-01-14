-- Create employee_groups table
CREATE TABLE IF NOT EXISTS employee_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employee_groups ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Public access for employee groups"
ON employee_groups FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Insert predefined groups
INSERT INTO employee_groups (name) VALUES
  ('Dirección'),
  ('Administración'),
  ('Mujer'),
  ('Hombre'),
  ('Niño'),
  ('Operaciones'),
  ('Caja'),
  ('Sint')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key to employees table
ALTER TABLE employees
DROP CONSTRAINT IF EXISTS valid_group;

ALTER TABLE employees
ADD CONSTRAINT fk_employee_group
FOREIGN KEY ("group")
REFERENCES employee_groups(name)
ON DELETE SET NULL
ON UPDATE CASCADE;