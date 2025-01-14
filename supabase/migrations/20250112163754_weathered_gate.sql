-- Create secure view for auth users
CREATE OR REPLACE VIEW auth_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM role_cache rc
      WHERE rc.user_id = auth.uid() 
      AND rc.role = 'developer'
    ) THEN true
    ELSE u.id = auth.uid()
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN role_cache ur ON u.id = ur.user_id
WHERE (
  -- Show all users to developers
  EXISTS (
    SELECT 1 FROM role_cache rc2
    WHERE rc2.user_id = auth.uid()
    AND rc2.role = 'developer'
  )
  -- Show only own user to others
  OR u.id = auth.uid()
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT ON role_cache TO authenticated;