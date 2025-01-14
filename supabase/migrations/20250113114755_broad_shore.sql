-- Add returned_holiday column to hours_records
ALTER TABLE hours_records
ADD COLUMN returned_holiday boolean NOT NULL DEFAULT false;

-- Create index for better performance when filtering by returned holidays
CREATE INDEX idx_hours_records_returned_holiday ON hours_records(returned_holiday) WHERE returned_holiday = true;

-- Add constraint to ensure only one holiday status can be true
ALTER TABLE hours_records
ADD CONSTRAINT check_holiday_status 
CHECK (NOT (pending_holiday AND returned_holiday));