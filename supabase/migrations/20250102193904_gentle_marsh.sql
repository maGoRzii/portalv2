-- Drop existing view
DROP VIEW IF EXISTS tasks_with_assignee;

-- Create users table for assignable users
CREATE TABLE IF NOT EXISTS assignable_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assignable_users ENABLE ROW LEVEL SECURITY;

-- Create policy for assignable_users
CREATE POLICY "Public read access for assignable_users"
ON assignable_users FOR SELECT
TO public
USING (true);

-- Insert predefined users
INSERT INTO assignable_users (name, email) VALUES
  ('Darío', 'dario@jonquera.cat'),
  ('Joel', 'joel@jonquera.cat'),
  ('Morad', 'morad@jonquera.cat'),
  ('Sonia', 'sonia@jonquera.cat')
ON CONFLICT (email) DO NOTHING;

-- Modify tasks table to reference assignable_users
ALTER TABLE tasks
DROP COLUMN IF EXISTS assigned_to,
ADD COLUMN assigned_to uuid REFERENCES assignable_users(id);

-- Create view for tasks with assignee information
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  au.email as assignee_email,
  au.name as assignee_name
FROM tasks t
LEFT JOIN assignable_users au ON t.assigned_to = au.id;