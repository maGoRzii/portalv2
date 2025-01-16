-- Ensure vacations permission is properly set up with verification
DO $$ 
DECLARE
  v_count integer;
BEGIN
  -- First verify if the permission is in the constraint
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu 
    ON cc.constraint_name = ccu.constraint_name
    WHERE cc.constraint_name = 'role_permissions_permission_check'
    AND cc.check_clause LIKE '%vacations%'
  ) THEN
    -- Recreate the constraint to include vacations
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
  END IF;

  -- Count existing vacations permissions
  SELECT COUNT(*) INTO v_count
  FROM role_permissions
  WHERE permission = 'vacations';

  -- If no vacations permissions exist, insert them
  IF v_count = 0 THEN
    -- Insert for built-in roles
    INSERT INTO role_permissions (role, permission)
    VALUES 
      ('developer', 'vacations'),
      ('admin', 'vacations'),
      ('administrative', 'vacations'),
      ('manager', 'vacations')
    ON CONFLICT (role, permission) DO NOTHING;

    -- Insert for custom roles
    INSERT INTO role_permissions (role, permission)
    SELECT id::text, 'vacations'
    FROM custom_roles
    ON CONFLICT (role, permission) DO NOTHING;
  END IF;

  -- Verify the permissions were added correctly
  IF NOT EXISTS (
    SELECT 1 FROM role_permissions 
    WHERE permission = 'vacations' 
    AND role IN ('developer', 'admin', 'administrative', 'manager')
  ) THEN
    RAISE EXCEPTION 'Failed to add vacations permissions';
  END IF;

END $$;