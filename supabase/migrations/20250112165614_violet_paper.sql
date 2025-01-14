-- Drop and recreate the view with correct JOIN
DROP VIEW IF EXISTS admin_users_view;

CREATE VIEW admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  r.role,
  EXISTS (
    SELECT 1 FROM admin_roles dev
    WHERE dev.user_id = auth.uid()
    AND dev.role = 'developer'
  ) as can_manage
FROM auth.users u
LEFT JOIN admin_roles r ON u.id = r.user_id;  -- Fix the JOIN condition

-- Re-grant permissions
GRANT SELECT ON admin_users_view TO authenticated;