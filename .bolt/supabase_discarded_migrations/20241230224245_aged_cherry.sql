/*
  # Update RLS policies for form submissions

  1. Changes
    - Drop existing policies if they exist
    - Recreate policies to allow public access for form submissions
    - Ensure both authenticated and public users can perform necessary operations

  2. Security
    - Maintain read protection for authenticated users only
    - Allow public inserts for form submissions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable public insert for submissions" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable public insert for shifts" ON holiday_shifts;
DROP POLICY IF EXISTS "Enable public insert for uniform requests" ON uniform_requests;
DROP POLICY IF EXISTS "Enable public insert for uniform items" ON uniform_items;

-- Recreate policies for holiday submissions
CREATE POLICY "Enable public insert for submissions"
ON holiday_submissions
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Enable public insert for shifts"
ON holiday_shifts
FOR INSERT TO public
WITH CHECK (true);

-- Recreate policies for uniform submissions
CREATE POLICY "Enable public insert for uniform requests"
ON uniform_requests
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Enable public insert for uniform items"
ON uniform_items
FOR INSERT TO public
WITH CHECK (true);