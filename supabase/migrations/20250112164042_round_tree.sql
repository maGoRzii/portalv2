-- Drop existing policies first
DROP POLICY IF EXISTS "Public read access for user roles" ON user_roles;
DROP POLICY IF EXISTS "Developers can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Developers can update roles" ON user_roles;
DROP POLICY IF EXISTS "Developers can delete roles" ON user_roles;
DROP VIEW IF EXISTS auth_users_view;

-- Create secure view for auth users that includes role information
CREATE VIEW auth_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_roles ur2
      WHERE ur2.user_id = auth.uid() 
      AND ur2.role = 'developer'
    ) THEN true
    ELSE u.id = auth.uid()
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Create single policy for developers to manage roles
CREATE POLICY "Developer full access"
ON user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Create policy for users to view their own role
CREATE POLICY "Users can view own role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;