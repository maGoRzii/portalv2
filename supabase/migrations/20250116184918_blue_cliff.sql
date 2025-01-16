-- Create index for better performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_vacation_records_employee'
  ) THEN
    CREATE INDEX idx_vacation_records_employee ON vacation_records(employee_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_vacation_records_year'
  ) THEN
    CREATE INDEX idx_vacation_records_year ON vacation_records(year);
  END IF;
END $$;

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_vacation_records_updated_at'
  ) THEN
    CREATE TRIGGER update_vacation_records_updated_at
      BEFORE UPDATE ON vacation_records
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;