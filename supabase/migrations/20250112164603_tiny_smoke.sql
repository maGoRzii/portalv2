-- Drop existing policies and views
DROP POLICY IF EXISTS "read_own_role" ON user_roles;
DROP POLICY IF EXISTS "developer_access" ON user_roles;
DROP MATERIALIZED VIEW IF EXISTS developer_roles;
DROP TRIGGER IF EXISTS refresh_developer_roles_trigger ON user_roles;
DROP FUNCTION IF EXISTS refresh_developer_roles;

-- Create simplified policies
CREATE POLICY "base_role_access"
ON user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "manage_roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'developer'
  )
);

-- Create view for user management
CREATE OR REPLACE VIEW user_management_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  ur.role,
  EXISTS (
    SELECT 1 
    FROM user_roles dev
    WHERE dev.user_id = auth.uid() 
    AND dev.role = 'developer'
  ) as can_manage
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Grant permissions
GRANT SELECT ON user_management_view TO authenticated;