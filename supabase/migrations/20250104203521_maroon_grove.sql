-- Make message column nullable
ALTER TABLE requests 
ALTER COLUMN message DROP NOT NULL;

-- Drop existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'valid_clock_card_option'
  ) THEN
    ALTER TABLE requests DROP CONSTRAINT valid_clock_card_option;
  END IF;
END $$;

-- Add updated check constraint for clock card options
ALTER TABLE requests
ADD CONSTRAINT valid_clock_card_option CHECK (
  (type = 'clock_card' AND clock_card_option IN ('never_had', 'lost_damaged')) OR
  (type != 'clock_card' AND clock_card_option IS NULL)
);