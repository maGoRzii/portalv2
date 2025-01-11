-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users
CREATE POLICY "Public read access for admin_users"
ON admin_users FOR SELECT
TO public
USING (true);

-- Modify tasks table to reference admin_users
ALTER TABLE tasks
DROP COLUMN IF EXISTS assigned_to,
ADD COLUMN assigned_to uuid REFERENCES admin_users(id);

-- Update tasks select query
CREATE OR REPLACE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  au.email as assignee_email
FROM tasks t
LEFT JOIN admin_users au ON t.assigned_to = au.id;