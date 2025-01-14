-- Drop existing policies
DROP POLICY IF EXISTS "read_own_role" ON user_roles;
DROP POLICY IF EXISTS "developer_read_all" ON user_roles;
DROP POLICY IF EXISTS "developer_manage_roles" ON user_roles;

-- Create materialized view for caching developer roles
CREATE MATERIALIZED VIEW developer_roles AS
SELECT user_id
FROM user_roles
WHERE role = 'developer';

-- Create index for better performance
CREATE UNIQUE INDEX developer_roles_user_id_idx ON developer_roles(user_id);

-- Create function to refresh developer roles cache
CREATE OR REPLACE FUNCTION refresh_developer_roles()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY developer_roles;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache when roles change
CREATE TRIGGER refresh_developer_roles_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_roles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_developer_roles();

-- Create simplified policies using the cache
CREATE POLICY "read_own_role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "developer_access"
ON user_roles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM developer_roles)
)
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM developer_roles)
);

-- Do initial cache refresh
REFRESH MATERIALIZED VIEW developer_roles;