-- Drop existing policies and functions
DROP POLICY IF EXISTS "Allow full access to developers" ON user_roles;
DROP POLICY IF EXISTS "Allow users to view their own role" ON user_roles;
DROP FUNCTION IF EXISTS auth.check_user_role;
DROP FUNCTION IF EXISTS auth.get_user_role;

-- Create a materialized view for caching role checks
CREATE MATERIALIZED VIEW role_cache AS
SELECT user_id, role
FROM user_roles;

-- Create index for better performance
CREATE UNIQUE INDEX role_cache_user_id_idx ON role_cache(user_id);

-- Create function to refresh role cache
CREATE OR REPLACE FUNCTION refresh_role_cache()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY role_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache
CREATE TRIGGER refresh_role_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_roles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_role_cache();

-- Create simplified policies for user_roles
CREATE POLICY "Public read access for user roles"
ON user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can manage roles"
ON user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_cache
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM role_cache
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Create secure functions for role checking
CREATE OR REPLACE FUNCTION auth.check_user_role(required_role user_role)
RETURNS boolean AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Get the user's role from cache
  SELECT role INTO user_role_val
  FROM role_cache
  WHERE user_id = auth.uid();

  -- Developers have access to everything
  IF user_role_val = 'developer' THEN
    RETURN true;
  END IF;

  -- Check specific role
  RETURN user_role_val = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM role_cache
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Do initial cache refresh
REFRESH MATERIALIZED VIEW role_cache;