-- Ensure vacations permission is properly set up
DO $$ 
BEGIN
  -- First, make sure the permission exists in the check constraint
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

  -- Delete any existing vacations permissions to avoid conflicts
  DELETE FROM role_permissions WHERE permission = 'vacations';

  -- Re-insert vacations permission for all roles
  INSERT INTO role_permissions (role, permission)
  VALUES 
    ('developer', 'vacations'),
    ('admin', 'vacations'),
    ('administrative', 'vacations'),
    ('manager', 'vacations');

  -- Update any custom roles to include vacations permission
  INSERT INTO role_permissions (role, permission)
  SELECT id::text, 'vacations'
  FROM custom_roles
  ON CONFLICT (role, permission) DO NOTHING;

END $$;