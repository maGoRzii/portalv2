-- Create function to sync user metadata with employee data
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- If employee_number changes, update user email
  IF TG_OP = 'UPDATE' AND OLD.employee_number != NEW.employee_number THEN
    -- Find user with old employee number
    UPDATE auth.users
    SET email = NEW.employee_number || '@jonquera.cat',
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

-- Create trigger for employee updates
DROP TRIGGER IF EXISTS employee_sync_trigger ON employees;
CREATE TRIGGER employee_sync_trigger
  AFTER UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_metadata();

-- Create function to validate employee number format
CREATE OR REPLACE FUNCTION validate_employee_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if employee_number is in valid format (only numbers)
  IF NEW.employee_number !~ '^[0-9]+$' THEN
    RAISE EXCEPTION 'Employee number must contain only numbers';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for employee number validation
DROP TRIGGER IF EXISTS employee_number_validation_trigger ON employees;
CREATE TRIGGER employee_number_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee_number();