-- Drop existing policies first
DROP POLICY IF EXISTS "Developers can manage roles" ON user_roles;

-- Drop materialized view with CASCADE to handle dependencies
DROP MATERIALIZED VIEW IF EXISTS role_cache CASCADE;

-- Create role cache as a regular view for simplicity and better maintainability
CREATE VIEW role_cache AS
SELECT user_id, role
FROM user_roles;

-- Create secure view for auth users
CREATE VIEW auth_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM role_cache rc
      WHERE rc.user_id = auth.uid() 
      AND rc.role = 'developer'
    ) THEN true
    ELSE u.id = auth.uid()
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN role_cache ur ON u.id = ur.user_id
WHERE (
  -- Show all users to developers
  EXISTS (
    SELECT 1 FROM role_cache rc2
    WHERE rc2.user_id = auth.uid()
    AND rc2.role = 'developer'
  )
  -- Show only own user to others
  OR u.id = auth.uid()
);

-- Create new policy for user roles
CREATE POLICY "Developers can manage roles"
ON user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_cache
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM role_cache
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT ON role_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;