/*
  # Fix RLS policies for form submissions

  1. Changes
    - Simplify RLS policies
    - Allow anonymous submissions
    - Maintain read security for authenticated users

  2. Security
    - Anonymous users can submit forms
    - Only authenticated users can read submissions
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_shifts;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON holiday_shifts;

-- Create simplified policies for holiday_submissions
CREATE POLICY "Public insert access"
ON holiday_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated read access"
ON holiday_submissions
FOR SELECT
TO authenticated
USING (true);

-- Create simplified policies for holiday_shifts
CREATE POLICY "Public insert access"
ON holiday_shifts
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated read access"
ON holiday_shifts
FOR SELECT
TO authenticated
USING (true);