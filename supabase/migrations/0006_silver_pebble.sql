/*
  # Fix Authentication Policies

  1. Changes
    - Remove existing policies
    - Add proper authentication policies for submissions and shifts
    - Ensure public can insert but only authenticated users can read
  
  2. Security
    - Enable RLS
    - Add specific policies for authenticated users
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Public insert access" ON holiday_submissions;
DROP POLICY IF EXISTS "Authenticated read access" ON holiday_submissions;
DROP POLICY IF EXISTS "Public insert access" ON holiday_shifts;
DROP POLICY IF EXISTS "Authenticated read access" ON holiday_shifts;

-- Create proper policies for holiday_submissions
CREATE POLICY "Anyone can insert submissions"
ON holiday_submissions FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read submissions"
ON holiday_submissions FOR SELECT
TO authenticated
USING (true);

-- Create proper policies for holiday_shifts
CREATE POLICY "Anyone can insert shifts"
ON holiday_shifts FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read shifts"
ON holiday_shifts FOR SELECT
TO authenticated
USING (true);