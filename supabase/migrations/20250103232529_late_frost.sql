/*
  # Add request type support
  
  1. Changes
    - Add type column to requests table
    - Add date column for date-specific requests
    - Add clock_card_option for clock card requests
    
  2. Data Migration
    - Set default type as 'personal' for existing records
*/

-- Add new columns to requests table
ALTER TABLE requests
ADD COLUMN type text NOT NULL DEFAULT 'personal',
ADD COLUMN date date,
ADD COLUMN clock_card_option text;

-- Add check constraint for request types
ALTER TABLE requests
ADD CONSTRAINT valid_request_type CHECK (
  type IN (
    'schedule_change',
    'hours_return',
    'holiday_return',
    'personal',
    'medical',
    'clock_card',
    'talks'
  )
);

-- Add check constraint for clock card options
ALTER TABLE requests
ADD CONSTRAINT valid_clock_card_option CHECK (
  clock_card_option IS NULL OR
  clock_card_option IN ('never_had', 'lost_damaged')
);