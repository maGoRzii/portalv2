-- Drop existing policies and views
DROP POLICY IF EXISTS "read_roles" ON admin_roles;
DROP POLICY IF EXISTS "manage_roles" ON admin_roles;
DROP POLICY IF EXISTS "update_roles" ON admin_roles;
DROP POLICY IF EXISTS "delete_roles" ON admin_roles;
DROP MATERIALIZED VIEW IF EXISTS developer_roles;
DROP TRIGGER IF EXISTS refresh_developer_roles_trigger ON admin_roles;
DROP FUNCTION IF EXISTS refresh_developer_roles();

-- Create simplified policies for admin_roles
CREATE POLICY "read_access"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "write_access"
ON admin_roles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'developer'
  )
  OR user_id = auth.uid()
);

CREATE POLICY "update_access"
ON admin_roles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'developer'
  )
  OR user_id = auth.uid()
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'developer'
  )
  OR user_id = auth.uid()
);

CREATE POLICY "delete_access"
ON admin_roles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'developer'
  )
  OR user_id = auth.uid()
);

-- Create function to prevent removing last developer
CREATE OR REPLACE FUNCTION prevent_last_developer_removal()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role = 'developer' AND NOT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE role = 'developer' 
    AND user_id != OLD.user_id
  ) THEN
    RAISE EXCEPTION 'Cannot remove the last developer role';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last developer protection
CREATE TRIGGER last_developer_protection
BEFORE DELETE ON admin_roles
FOR EACH ROW
EXECUTE FUNCTION prevent_last_developer_removal();

-- Create view for user management
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'developer'
  ) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = r.user_id;

-- Grant necessary permissions
GRANT SELECT ON admin_users_view TO authenticated;