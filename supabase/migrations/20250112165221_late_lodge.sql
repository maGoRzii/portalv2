-- Drop existing policies and views
DROP POLICY IF EXISTS "read_all_roles" ON user_roles;
DROP POLICY IF EXISTS "developers_manage_roles" ON user_roles;
DROP VIEW IF EXISTS user_management_view;

-- Create policies for user_roles
CREATE POLICY "read_all_roles"
ON user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "insert_roles"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM developer_list
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "update_roles"
ON user_roles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM developer_list
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM developer_list
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "delete_roles"
ON user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM developer_list
    WHERE user_id = auth.uid()
  )
);

-- Create policy for developer_list
CREATE POLICY "read_developer_list"
ON developer_list
FOR SELECT
TO authenticated
USING (true);

-- Create view for user management
CREATE VIEW user_management_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  ur.role,
  EXISTS (
    SELECT 1 FROM developer_list dl
    WHERE dl.user_id = auth.uid()
  ) as is_developer
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Grant permissions
GRANT SELECT ON user_management_view TO authenticated;
GRANT SELECT ON developer_list TO authenticated;
GRANT ALL ON user_roles TO authenticated;