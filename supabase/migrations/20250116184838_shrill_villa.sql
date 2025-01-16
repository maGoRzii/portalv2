-- Add vacation permissions for all roles
INSERT INTO role_permissions (role, permission)
VALUES 
  ('administrative', 'vacations'),
  ('manager', 'vacations')
ON CONFLICT (role, permission) DO NOTHING;