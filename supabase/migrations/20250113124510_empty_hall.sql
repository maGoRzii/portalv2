-- Drop existing role check constraint
ALTER TABLE admin_roles
DROP CONSTRAINT IF EXISTS admin_roles_role_check;

-- Add new role check constraint that allows both built-in and custom roles
ALTER TABLE admin_roles
ADD CONSTRAINT admin_roles_role_check 
CHECK (
  role IN ('developer', 'admin', 'administrative', 'manager') OR
  role ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);

-- Update role_permissions check constraint to match
ALTER TABLE role_permissions
DROP CONSTRAINT IF EXISTS role_permissions_role_check;

ALTER TABLE role_permissions
ADD CONSTRAINT role_permissions_role_check 
CHECK (
  role IN ('developer', 'admin', 'administrative', 'manager') OR
  role ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);