/*
  # Add Paid Hours to Hours Records

  1. Changes
    - Add paid_hours column to hours_records table
    - Update balance calculation to include paid hours
    - Add index for performance

  2. Notes
    - Balance will now be: extra_hours - returned_hours - paid_hours
*/

-- Add paid_hours column
ALTER TABLE hours_records
ADD COLUMN paid_hours numeric NOT NULL DEFAULT 0;

-- Add index for performance
CREATE INDEX idx_hours_records_paid_hours ON hours_records(paid_hours);

-- Update balance calculation
CREATE OR REPLACE FUNCTION update_hours_balance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.balance = NEW.extra_hours - NEW.returned_hours - NEW.paid_hours;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_hours_balance_trigger'
  ) THEN
    CREATE TRIGGER update_hours_balance_trigger
    BEFORE INSERT OR UPDATE ON hours_records
    FOR EACH ROW
    EXECUTE FUNCTION update_hours_balance();
  END IF;
END $$;