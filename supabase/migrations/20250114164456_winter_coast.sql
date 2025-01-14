-- Add archived column to requests table
ALTER TABLE requests
ADD COLUMN archived boolean NOT NULL DEFAULT false;

-- Create index for better performance when filtering
CREATE INDEX idx_requests_archived ON requests(archived);