-- Drop all existing policies
DROP POLICY IF EXISTS "Base role access" ON user_roles;
DROP POLICY IF EXISTS "Developer role management" ON user_roles;
DROP POLICY IF EXISTS "Developer role updates" ON user_roles;
DROP POLICY IF EXISTS "Developer role deletion" ON user_roles;

-- Create a single, simple policy for all operations
CREATE POLICY "role_access_policy"
ON user_roles
FOR ALL
TO authenticated
USING (
  -- Users can see their own role
  user_id = auth.uid() OR
  -- Or the user is a developer (checked directly against their ID)
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'developer'
  )
)
WITH CHECK (
  -- Same conditions for write operations
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'developer'
  )
);