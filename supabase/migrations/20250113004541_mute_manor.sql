-- Make week_code column nullable
ALTER TABLE hours_records
ALTER COLUMN week_code DROP NOT NULL;

-- Set default value for existing records
UPDATE hours_records 
SET week_code = NULL 
WHERE week_code = '';