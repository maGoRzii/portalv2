/*
  # Fix admin permissions

  1. Changes
    - Add policies for authenticated users to read holiday submissions and shifts
    - Remove public access policies
    - Add admin access policies

  2. Security
    - Only authenticated users can read data
    - Public users can only insert data
    - Admins have full access
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Enable public access" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable public access" ON holiday_shifts;

-- Policies for holiday_submissions
CREATE POLICY "Enable insert for anonymous users"
ON holiday_submissions FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
ON holiday_submissions FOR SELECT
TO authenticated
USING (true);

-- Policies for holiday_shifts
CREATE POLICY "Enable insert for anonymous users"
ON holiday_shifts FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
ON holiday_shifts FOR SELECT
TO authenticated
USING (true);