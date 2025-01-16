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

-- Insert default permissions for all roles
INSERT INTO role_permissions (role, permission)
SELECT role, 'vacations'
FROM unnest(ARRAY[
  'developer',
  'admin',
  'administrative',
  'manager'
]) as role
ON CONFLICT (role, permission) DO NOTHING;