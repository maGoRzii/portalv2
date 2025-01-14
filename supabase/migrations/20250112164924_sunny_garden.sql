-- Drop existing policies and views
DROP POLICY IF EXISTS "read_roles" ON user_roles;
DROP POLICY IF EXISTS "insert_roles" ON user_roles;
DROP POLICY IF EXISTS "update_roles" ON user_roles;
DROP POLICY IF EXISTS "delete_roles" ON user_roles;
DROP VIEW IF EXISTS user_management_view;

-- Create a table to store developer IDs directly
CREATE TABLE IF NOT EXISTS developer_list (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on developer_list
ALTER TABLE developer_list ENABLE ROW LEVEL SECURITY;

-- Insert initial developer
INSERT INTO developer_list (user_id)
SELECT id FROM auth.users WHERE email = 'jdariosanz@gmail.com'
ON CONFLICT DO NOTHING;

-- Create policies using developer_list instead of recursive checks
CREATE POLICY "read_all_roles"
ON user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "developers_manage_roles"
ON user_roles
FOR ALL
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