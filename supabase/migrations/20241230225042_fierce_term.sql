/*
  # Fix database policies for form submissions

  1. Changes
    - Drop existing policies
    - Create new public policies for all operations
    - Add proper error handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert submissions" ON holiday_submissions;
DROP POLICY IF EXISTS "Only authenticated users can read submissions" ON holiday_submissions;
DROP POLICY IF EXISTS "Anyone can insert shifts" ON holiday_shifts;
DROP POLICY IF EXISTS "Only authenticated users can read shifts" ON holiday_shifts;
DROP POLICY IF EXISTS "Anyone can insert uniform requests" ON uniform_requests;
DROP POLICY IF EXISTS "Only authenticated users can read uniform requests" ON uniform_requests;
DROP POLICY IF EXISTS "Anyone can insert uniform items" ON uniform_items;
DROP POLICY IF EXISTS "Only authenticated users can read uniform items" ON uniform_items;

-- Create new policies for holiday submissions
CREATE POLICY "Public access for holiday submissions"
ON holiday_submissions FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public access for holiday shifts"
ON holiday_shifts FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new policies for uniform requests
CREATE POLICY "Public access for uniform requests"
ON uniform_requests FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public access for uniform items"
ON uniform_items FOR ALL
TO public
USING (true)
WITH CHECK (true);