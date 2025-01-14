-- Create role_permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('developer', 'admin', 'administrative', 'manager')),
  permission text NOT NULL CHECK (permission IN (
    'holidays',
    'uniforms',
    'lanzadera',
    'requests',
    'tasks',
    'hours',
    'employees',
    'training',
    'roles',
    'settings'
  )),
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission)
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for role permissions"
ON role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can manage role permissions"
ON role_permissions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Insert default permissions for developer role
INSERT INTO role_permissions (role, permission)
SELECT 'developer', permission
FROM unnest(ARRAY[
  'holidays',
  'uniforms',
  'lanzadera',
  'requests',
  'tasks',
  'hours',
  'employees',
  'training',
  'roles',
  'settings'
]) as permission;

-- Insert default permissions for admin role
INSERT INTO role_permissions (role, permission)
SELECT 'admin', permission
FROM unnest(ARRAY[
  'holidays',
  'uniforms',
  'lanzadera',
  'requests',
  'tasks',
  'hours',
  'employees',
  'training',
  'settings'
]) as permission;

-- Insert default permissions for administrative role
INSERT INTO role_permissions (role, permission)
SELECT 'administrative', permission
FROM unnest(ARRAY[
  'holidays',
  'uniforms',
  'requests',
  'tasks'
]) as permission;

-- Insert default permissions for manager role
INSERT INTO role_permissions (role, permission)
SELECT 'manager', permission
FROM unnest(ARRAY[
  'holidays',
  'uniforms',
  'lanzadera',
  'requests',
  'tasks',
  'employees'
]) as permission;