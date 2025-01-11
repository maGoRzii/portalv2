-- Add header_image column to training_entries table
ALTER TABLE training_entries 
ADD COLUMN IF NOT EXISTS header_image text;

-- Update existing entries to have null header_image
UPDATE training_entries 
SET header_image = null 
WHERE header_image IS NULL;