-- Add pending_holiday column to hours_records
ALTER TABLE hours_records
ADD COLUMN pending_holiday boolean NOT NULL DEFAULT false;

-- Create index for better performance when filtering by pending holidays
CREATE INDEX idx_hours_records_pending_holiday ON hours_records(pending_holiday) WHERE pending_holiday = true;