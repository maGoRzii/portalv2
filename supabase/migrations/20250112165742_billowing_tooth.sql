-- Drop existing objects with CASCADE to handle dependencies
DROP VIEW IF EXISTS admin_users_view CASCADE;
DROP MATERIALIZED VIEW IF EXISTS developer_cache CASCADE;
DROP TRIGGER IF EXISTS refresh_developer_cache_trigger ON admin_roles;
DROP FUNCTION IF EXISTS refresh_developer_cache;

-- Drop existing policies
DROP POLICY IF EXISTS "Read access" ON admin_roles;
DROP POLICY IF EXISTS "Write access" ON admin_roles;
DROP POLICY IF EXISTS "Update access" ON admin_roles;
DROP POLICY IF EXISTS "Delete access" ON admin_roles;

-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

-- Create policy for developers table
CREATE POLICY "Public read access for developers"
ON developers FOR SELECT
TO authenticated
USING (true);

-- Create simplified policies for admin_roles
CREATE POLICY "Read access"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Write access"
ON admin_roles FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid())
);

-- Create view for user management
CREATE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (SELECT 1 FROM developers WHERE user_id = auth.uid()) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = r.user_id;

-- Grant permissions
GRANT SELECT ON admin_users_view TO authenticated;
GRANT ALL ON admin_roles TO authenticated;
GRANT SELECT ON developers TO authenticated;

-- Insert initial developer
INSERT INTO developers (user_id)
SELECT id
FROM auth.users 
WHERE email = 'jdariosanz@gmail.com'
ON CONFLICT (user_id) DO NOTHING;