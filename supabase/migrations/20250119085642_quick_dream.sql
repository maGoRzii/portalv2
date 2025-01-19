-- Drop existing policies and views
DROP POLICY IF EXISTS "read_access" ON admin_roles;
DROP POLICY IF EXISTS "write_access" ON admin_roles;
DROP POLICY IF EXISTS "update_access" ON admin_roles;
DROP POLICY IF EXISTS "delete_access" ON admin_roles;

-- Create a developers table to avoid recursion
CREATE TABLE IF NOT EXISTS developers (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on developers table
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

-- Create policy for developers table
CREATE POLICY "Public read access for developers"
ON developers FOR SELECT
TO authenticated
USING (true);

-- Create simplified policies for admin_roles
CREATE POLICY "Public read access"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developer write access"
ON admin_roles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
);

CREATE POLICY "Developer update access"
ON admin_roles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
);

CREATE POLICY "Developer delete access"
ON admin_roles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
);

-- Create view for user management
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid()) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = r.user_id;

-- Grant necessary permissions
GRANT SELECT ON admin_users_view TO authenticated;
GRANT SELECT ON developers TO authenticated;
GRANT ALL ON admin_roles TO authenticated;

-- Insert initial developer if not exists
INSERT INTO developers (user_id)
SELECT id FROM auth.users 
WHERE email = 'jdariosanz@gmail.com'
ON CONFLICT DO NOTHING;