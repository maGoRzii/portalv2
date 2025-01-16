-- Ensure vacations permission is properly set up
DO $$ 
BEGIN
  -- Update role_permissions check constraint to include vacations
  ALTER TABLE role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_permission_check;

  ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_permission_check 
  CHECK (permission IN (
    'holidays',
    'uniforms',
    'lanzadera',
    'requests',
    'tasks',
    'hours',
    'employees',
    'training',
    'roles',
    'settings',
    'vacations'
  ));

  -- Insert vacations permission for all roles if not exists
  INSERT INTO role_permissions (role, permission)
  VALUES 
    ('developer', 'vacations'),
    ('admin', 'vacations'),
    ('administrative', 'vacations'),
    ('manager', 'vacations')
  ON CONFLICT (role, permission) DO NOTHING;

END $$;