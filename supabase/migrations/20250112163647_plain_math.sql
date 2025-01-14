-- Create secure view for auth users
CREATE OR REPLACE VIEW auth_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_roles ur2
      WHERE ur2.user_id = auth.uid() 
      AND ur2.role = 'developer'
    ) THEN true
    ELSE u.id = auth.uid()
  END as can_edit,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE (
  -- Show all users to developers
  EXISTS (
    SELECT 1 FROM user_roles ur3
    WHERE ur3.user_id = auth.uid()
    AND ur3.role = 'developer'
  )
  -- Show only own user to others
  OR u.id = auth.uid()
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth_users_view TO authenticated;