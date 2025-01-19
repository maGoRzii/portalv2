-- Drop existing policies
DROP POLICY IF EXISTS "Developer full access" ON admin_roles;
DROP POLICY IF EXISTS "Users can view own role" ON admin_roles;

-- Create new policies for admin_roles
CREATE POLICY "Public read access for admin roles"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can manage roles"
ON admin_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
)
WITH CHECK (true);

-- Create policy for users to manage their own role
CREATE POLICY "Users can manage their own role"
ON admin_roles FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create function to ensure at least one developer exists
CREATE OR REPLACE FUNCTION ensure_developer_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE role = 'developer'
    AND user_id != OLD.user_id
  ) THEN
    RAISE EXCEPTION 'Cannot remove the last developer role';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent removing last developer
CREATE TRIGGER prevent_last_developer_removal
  BEFORE DELETE ON admin_roles
  FOR EACH ROW
  WHEN (OLD.role = 'developer')
  EXECUTE FUNCTION ensure_developer_exists();