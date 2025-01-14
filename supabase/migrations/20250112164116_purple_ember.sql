-- Drop existing policies and views
DROP POLICY IF EXISTS "Developer full access" ON user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
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
      AND ur2.user_id != u.id  -- Prevent recursion
    ) THEN true
    ELSE u.id = auth.uid()
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Create policy for developers to manage roles
CREATE POLICY "Developer role management"
ON user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
    AND ur.user_id != user_id  -- Prevent recursion
  )
  OR user_id = auth.uid()  -- Allow users to see their own role
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;