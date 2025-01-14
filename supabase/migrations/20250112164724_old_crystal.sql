-- Drop all existing policies
DROP POLICY IF EXISTS "base_role_access" ON user_roles;
DROP POLICY IF EXISTS "manage_roles" ON user_roles;
DROP VIEW IF EXISTS user_management_view;

-- Create a single, simple policy for all operations
CREATE POLICY "role_policy"
ON user_roles
FOR ALL
TO authenticated
USING (
  -- Allow users to see all roles (needed for permission checks)
  -- And allow developers to manage roles
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
  )
  OR
  -- Always allow users to see their own role
  user_id = auth.uid()
);

-- Create simple view for user management
CREATE VIEW user_management_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Grant permissions
GRANT SELECT ON user_management_view TO authenticated;