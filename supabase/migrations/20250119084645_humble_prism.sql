-- Create function to handle user authentication with employee number
CREATE OR REPLACE FUNCTION handle_auth_email_transform()
RETURNS TRIGGER AS $$
BEGIN
  -- If email doesn't contain @, append @jonquera.cat
  IF NEW.email NOT LIKE '%@%' THEN
    NEW.email := NEW.email || '@jonquera.cat';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to transform employee number to email
DROP TRIGGER IF EXISTS auth_email_transform_trigger ON auth.users;
CREATE TRIGGER auth_email_transform_trigger
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_email_transform();

-- Create function to validate email format
CREATE OR REPLACE FUNCTION validate_auth_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow both employee numbers and valid emails
  IF NEW.email ~ '^[0-9]+$' THEN
    NEW.email := NEW.email || '@jonquera.cat';
  ELSIF NEW.email !~ '^[0-9]+@jonquera\.cat$' AND 
        NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email validation
DROP TRIGGER IF EXISTS auth_email_validation_trigger ON auth.users;
CREATE TRIGGER auth_email_validation_trigger
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_auth_email();