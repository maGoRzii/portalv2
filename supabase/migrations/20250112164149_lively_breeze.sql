-- Drop existing policies and views
DROP POLICY IF EXISTS "Developer role management" ON user_roles;
DROP VIEW IF EXISTS auth_users_view;

-- Create secure view for auth users that includes role information
CREATE VIEW auth_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  CASE 
    WHEN auth.uid() = u.id THEN true  -- Users can always edit themselves
    WHEN EXISTS (
      SELECT 1 FROM user_roles ur2
      WHERE ur2.user_id = auth.uid() 
      AND ur2.role = 'developer'
    ) THEN true  -- Developers can edit everyone
    ELSE false
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Create base policy for viewing roles
CREATE POLICY "Base role access"
ON user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR  -- Users can see their own role
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'developer'
  )  -- Developers can see all roles
);

-- Create policy for managing roles
CREATE POLICY "Developer role management"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'developer'
  )
);

CREATE POLICY "Developer role updates"
ON user_roles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'developer'
  )
);

CREATE POLICY "Developer role deletion"
ON user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'developer'
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;