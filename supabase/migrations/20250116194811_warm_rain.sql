-- Verify and fix vacations permissions with detailed logging
DO $$ 
DECLARE
  v_role text;
  v_missing_roles text[];
  v_count integer;
BEGIN
  -- First verify the constraint exists and is correct
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu 
    ON cc.constraint_name = ccu.constraint_name
    WHERE cc.constraint_name = 'role_permissions_permission_check'
    AND cc.check_clause LIKE '%vacations%'
  ) THEN
    RAISE NOTICE 'Constraint check failed - recreating...';
    
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

  -- Check which built-in roles are missing the vacations permission
  v_missing_roles := ARRAY[]::text[];
  FOR v_role IN SELECT unnest(ARRAY['developer', 'admin', 'administrative', 'manager'])
  LOOP
    IF NOT EXISTS (
      SELECT 1 
      FROM role_permissions 
      WHERE role = v_role 
      AND permission = 'vacations'
    ) THEN
      v_missing_roles := array_append(v_missing_roles, v_role);
    END IF;
  END LOOP;

  -- If any roles are missing the permission, add them
  IF array_length(v_missing_roles, 1) > 0 THEN
    RAISE NOTICE 'Adding vacations permission to roles: %', v_missing_roles;
    
    INSERT INTO role_permissions (role, permission)
    SELECT unnest(v_missing_roles), 'vacations'
    ON CONFLICT (role, permission) DO NOTHING;
  END IF;

  -- Add vacations permission to any custom roles that don't have it
  INSERT INTO role_permissions (role, permission)
  SELECT id::text, 'vacations'
  FROM custom_roles cr
  WHERE NOT EXISTS (
    SELECT 1 
    FROM role_permissions rp 
    WHERE rp.role = cr.id::text 
    AND rp.permission = 'vacations'
  )
  ON CONFLICT (role, permission) DO NOTHING;

  -- Final verification
  SELECT COUNT(*) INTO v_count
  FROM role_permissions
  WHERE permission = 'vacations';

  RAISE NOTICE 'Verification complete: % roles now have vacations permission', v_count;

  -- If still no permissions exist, something is wrong
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Failed to add any vacations permissions';
  END IF;

END $$;