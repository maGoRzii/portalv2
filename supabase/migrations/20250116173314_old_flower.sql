-- Create vacation_records table
CREATE TABLE IF NOT EXISTS vacation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  year integer NOT NULL,
  days_taken integer NOT NULL DEFAULT 0,
  days_remaining integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vacation_records ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can manage vacation records"
ON vacation_records FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_vacation_records_employee ON vacation_records(employee_id);
CREATE INDEX idx_vacation_records_year ON vacation_records(year);

-- Create updated_at trigger
CREATE TRIGGER update_vacation_records_updated_at
  BEFORE UPDATE ON vacation_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add vacations permission to role_permissions check constraint
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

-- Insert default permissions for admin role
INSERT INTO role_permissions (role, permission)
SELECT 'admin', 'vacations'
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions 
  WHERE role = 'admin' AND permission = 'vacations'
);

-- Insert default permissions for developer role
INSERT INTO role_permissions (role, permission)
SELECT 'developer', 'vacations'
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions 
  WHERE role = 'developer' AND permission = 'vacations'
);