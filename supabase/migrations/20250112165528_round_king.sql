-- Create a new simplified roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('developer', 'admin', 'administrative', 'manager')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Public read access for roles"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can manage roles"
ON admin_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Create view for user management
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (
    SELECT 1 FROM admin_roles dev
    WHERE dev.user_id = auth.uid()
    AND dev.role = 'developer'
  ) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = u.id;

-- Grant necessary permissions
GRANT SELECT ON admin_users_view TO authenticated;
GRANT ALL ON admin_roles TO authenticated;

-- Insert initial developer
INSERT INTO admin_roles (user_id, role)
SELECT id, 'developer'
FROM auth.users 
WHERE email = 'jdariosanz@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'developer';