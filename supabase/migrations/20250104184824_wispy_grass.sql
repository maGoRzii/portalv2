/*
  # Add task groups and new users

  1. New Tables
    - `task_groups` for categorizing tasks
  2. Changes
    - Add `group_id` to tasks table
    - Add new assignable users
*/

-- Create task groups table
CREATE TABLE IF NOT EXISTS task_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_groups ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Public access for task groups"
ON task_groups FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add group_id to tasks
ALTER TABLE tasks
ADD COLUMN group_id uuid REFERENCES task_groups(id);

-- Insert predefined groups
INSERT INTO task_groups (name, color) VALUES
  ('Dirección', '#6B7280'),      -- Gris
  ('Administración', '#92400E'), -- Marrón
  ('Mujer', '#DB2777'),         -- Rosa
  ('Hombre', '#2563EB'),        -- Azul
  ('Niño', '#059669'),          -- Verde
  ('Operaciones', '#CA8A04'),   -- Amarillo
  ('Caja', '#7C3AED'),          -- Morado
  ('Sint', '#DC2626');          -- Rojo

-- Insert new users
INSERT INTO assignable_users (name, email) VALUES
  ('Kleider', 'kleider@jonquera.cat'),
  ('Cristina', 'cristina@jonquera.cat'),
  ('Jordi', 'jordi@jonquera.cat'),
  ('Jessyca', 'jessyca@jonquera.cat')
ON CONFLICT (email) DO NOTHING;

-- Update tasks view to include group information
DROP VIEW IF EXISTS tasks_with_assignee;
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  array_agg(au.email) FILTER (WHERE au.email IS NOT NULL) as assignee_emails,
  array_agg(au.name) FILTER (WHERE au.name IS NOT NULL) as assignee_names,
  tg.name as group_name,
  tg.color as group_color
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN assignable_users au ON ta.user_id = au.id
LEFT JOIN task_groups tg ON t.group_id = tg.id
GROUP BY t.id, t.title, t.status, t.created_at, t.updated_at, t.due_date, tg.name, tg.color;