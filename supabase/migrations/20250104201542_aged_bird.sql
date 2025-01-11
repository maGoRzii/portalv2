/*
  # Add status to requests

  1. Changes
    - Add status column to requests table with default 'pending'
    - Add check constraint for valid status values
*/

ALTER TABLE requests
ADD COLUMN status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'done'));

-- Update existing requests to have status 'pending'
UPDATE requests SET status = 'pending' WHERE status IS NULL;