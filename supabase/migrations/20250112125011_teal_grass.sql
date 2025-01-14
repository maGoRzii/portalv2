-- Add status column to employees table
ALTER TABLE employees
ADD COLUMN status text CHECK (status IN ('active', 'future_leave', 'inactive')) DEFAULT 'active';

-- Update existing employees to have 'active' status
UPDATE employees SET status = 'active' WHERE status IS NULL;

-- Make status column not nullable
ALTER TABLE employees ALTER COLUMN status SET NOT NULL;