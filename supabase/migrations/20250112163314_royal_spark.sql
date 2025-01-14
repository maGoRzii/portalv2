-- Create roles enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('developer', 'admin', 'administrative', 'manager');
  END IF;
END $$;

-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Developers can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;

-- Create policies for user_roles
CREATE POLICY "Developers can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  )
);

CREATE POLICY "Users can view their own role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create or replace functions
CREATE OR REPLACE FUNCTION auth.check_user_role(required_role user_role)
RETURNS boolean AS $$
BEGIN
  -- Developers have access to everything
  IF EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'developer'
  ) THEN
    RETURN true;
  END IF;

  -- Check specific role
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM user_roles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT EXECUTE ON FUNCTION auth.check_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION auth.get_user_role TO authenticated;

-- Assign developer role to jdariosanz@gmail.com
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get user id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'jdariosanz@gmail.com';

  -- Insert role if user exists
  IF v_user_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'developer')
    ON CONFLICT (user_id) DO UPDATE
    SET role = 'developer';
  END IF;
END $$;