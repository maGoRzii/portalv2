-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS auth_email_transform_trigger ON auth.users;
DROP TRIGGER IF EXISTS auth_email_validation_trigger ON auth.users;
DROP FUNCTION IF EXISTS handle_auth_email_transform();
DROP FUNCTION IF EXISTS validate_auth_email();

-- Create updated function to handle user authentication with employee number
CREATE OR REPLACE FUNCTION handle_auth_email_transform()
RETURNS TRIGGER AS $$
BEGIN
  -- If email doesn't contain @, append @jonquera16549.es
  IF NEW.email NOT LIKE '%@%' THEN
    NEW.email := NEW.email || '@jonquera16549.es';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated function to validate email format
CREATE OR REPLACE FUNCTION validate_auth_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow both employee numbers and valid emails
  IF NEW.email ~ '^[0-9]+$' THEN
    NEW.email := NEW.email || '@jonquera16549.es';
  ELSIF NEW.email !~ '^[0-9]+@jonquera16549\.es$' AND 
        NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new triggers with updated functions
CREATE TRIGGER auth_email_transform_trigger
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_email_transform();

CREATE TRIGGER auth_email_validation_trigger
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_auth_email();

-- Update existing users with old domain
UPDATE auth.users
SET email = regexp_replace(email, '@jonquera\.cat$', '@jonquera16549.es')
WHERE email LIKE '%@jonquera.cat';

-- Update sync_user_metadata function to use new domain
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- If employee_number changes, update user email
  IF TG_OP = 'UPDATE' AND OLD.employee_number != NEW.employee_number THEN
    -- Find user with old employee number
    UPDATE auth.users
    SET email = NEW.employee_number || '@jonquera16549.es',
        raw_user_meta_data = jsonb_set(
          COALESCE(raw_user_meta_data, '{}'::jsonb),
          '{name}',
          to_jsonb(NEW.full_name)
        )
    WHERE raw_user_meta_data->>'employee_id' = NEW.id;
  END IF;

  -- If full_name changes, update user metadata
  IF TG_OP = 'UPDATE' AND OLD.full_name != NEW.full_name THEN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{name}',
      to_jsonb(NEW.full_name)
    )
    WHERE raw_user_meta_data->>'employee_id' = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;