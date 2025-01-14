-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for roles" ON admin_roles;
DROP POLICY IF EXISTS "Developers can manage roles" ON admin_roles;

-- Create a materialized view for caching developer status
CREATE MATERIALIZED VIEW developer_cache AS
SELECT user_id
FROM admin_roles
WHERE role = 'developer';

-- Create index for better performance
CREATE UNIQUE INDEX developer_cache_user_id_idx ON developer_cache(user_id);

-- Create function to refresh cache
CREATE OR REPLACE FUNCTION refresh_developer_cache()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY developer_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache
CREATE TRIGGER refresh_developer_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON admin_roles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_developer_cache();

-- Create simplified policies using the cache
CREATE POLICY "Read access"
ON admin_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Write access"
ON admin_roles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM developer_cache WHERE user_id = auth.uid())
);

CREATE POLICY "Update access"
ON admin_roles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developer_cache WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM developer_cache WHERE user_id = auth.uid())
);

CREATE POLICY "Delete access"
ON admin_roles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM developer_cache WHERE user_id = auth.uid())
);

-- Update admin_users_view to use the cache
DROP VIEW IF EXISTS admin_users_view;
CREATE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (SELECT 1 FROM developer_cache WHERE user_id = auth.uid()) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = r.user_id;

-- Do initial cache refresh
REFRESH MATERIALIZED VIEW developer_cache;