-- Drop existing policies and views
DROP POLICY IF EXISTS "role_policy" ON user_roles;
DROP VIEW IF EXISTS user_management_view;

-- Create separate policies for read and write operations
-- 1. Read policy - Everyone can read all roles (needed for permission checks)
CREATE POLICY "read_roles"
ON user_roles
FOR SELECT
TO authenticated
USING (true);

-- 2. Insert policy - Only developers can add roles
CREATE POLICY "insert_roles"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
  )
);

-- 3. Update policy - Only developers can modify roles
CREATE POLICY "update_roles"
ON user_roles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
  )
);

-- 4. Delete policy - Only developers can delete roles
CREATE POLICY "delete_roles"
ON user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'developer'
  )
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