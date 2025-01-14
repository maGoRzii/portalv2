-- Drop existing policy
DROP POLICY IF EXISTS "role_access_policy" ON user_roles;

-- Create separate policies for different operations
-- 1. Everyone can read their own role
CREATE POLICY "read_own_role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. Developers can read all roles (using a subquery to avoid recursion)
CREATE POLICY "developer_read_all"
ON user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role = 'developer'
  )
);

-- 3. Developers can manage roles (using the same subquery pattern)
CREATE POLICY "developer_manage_roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role = 'developer'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role = 'developer'
  )
);