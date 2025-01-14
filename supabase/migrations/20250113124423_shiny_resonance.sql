-- Create custom_roles table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS custom_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for custom roles" ON custom_roles;
DROP POLICY IF EXISTS "Developers can manage custom roles" ON custom_roles;

-- Create policies
CREATE POLICY "Public read access for custom roles"
ON custom_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can manage custom roles"
ON custom_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

-- Create function to validate role values
DO $$ 
BEGIN
  CREATE OR REPLACE FUNCTION is_valid_role(role_value text)
  RETURNS boolean AS $func$
  BEGIN
    -- Check if it's a built-in role
    IF role_value IN ('developer', 'admin', 'administrative', 'manager') THEN
      RETURN true;
    END IF;
    
    -- Check if it's a valid UUID (custom role)
    BEGIN
      RETURN role_value::uuid IS NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      RETURN false;
    END;
  END;
  $func$ LANGUAGE plpgsql;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Modify role_permissions to use the validation function
DO $$ 
BEGIN
  ALTER TABLE role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_check;

  ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_role_check 
  CHECK (is_valid_role(role));
EXCEPTION WHEN others THEN
  NULL;
END $$;