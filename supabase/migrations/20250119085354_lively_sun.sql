-- Drop existing policies and triggers
DROP POLICY IF EXISTS "Public read access for admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Developers can manage roles" ON admin_roles;
DROP POLICY IF EXISTS "Users can manage their own role" ON admin_roles;
DROP TRIGGER IF EXISTS prevent_last_developer_removal ON admin_roles;
DROP FUNCTION IF EXISTS ensure_developer_exists();

-- Create a materialized view to cache developer roles
CREATE MATERIALIZED VIEW IF NOT EXISTS developer_roles AS
SELECT user_id
FROM admin_roles
WHERE role = 'developer';

-- Create index for better performance
CREATE UNIQUE INDEX IF NOT EXISTS developer_roles_user_id_idx ON developer_roles(user_id);

-- Create function to refresh developer roles cache
CREATE OR REPLACE FUNCTION refresh_developer_roles()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY developer_roles;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache
CREATE TRIGGER refresh_developer_roles_trigger
AFTER INSERT OR UPDATE OR DELETE ON admin_roles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_developer_roles();

-- Create simplified policies using the cache
CREATE POLICY "read_roles"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "manage_roles"
ON admin_roles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM developer_roles WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "update_roles"
ON admin_roles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developer_roles WHERE user_id = auth.uid())
  OR user_id = auth.uid()
)
WITH CHECK (
  EXISTS (SELECT 1 FROM developer_roles WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "delete_roles"
ON admin_roles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developer_roles WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

-- Do initial cache refresh
REFRESH MATERIALIZED VIEW developer_roles;