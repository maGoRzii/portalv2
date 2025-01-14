-- Update all existing users to have admin role
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || 
  jsonb_build_object(
    'claims_admin', true
  );

-- Create policy to allow admin access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'auth' 
    AND tablename = 'users' 
    AND policyname = 'Allow full access for admin users'
  ) THEN
    CREATE POLICY "Allow full access for admin users"
    ON auth.users
    FOR ALL 
    TO authenticated
    USING (
      auth.jwt() ->> 'email' = email AND 
      (auth.jwt() -> 'app_metadata' ->> 'claims_admin')::boolean = true
    )
    WITH CHECK (
      auth.jwt() ->> 'email' = email AND 
      (auth.jwt() -> 'app_metadata' ->> 'claims_admin')::boolean = true
    );
  END IF;
END $$;