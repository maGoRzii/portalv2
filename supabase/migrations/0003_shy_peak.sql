/*
  # Fix RLS Policies for Anonymous Submissions

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions for:
      - Public read/write access for submissions
      - Public read/write access for shifts
    
  2. Security
    - Allows anonymous submissions while maintaining data integrity
    - Keeps referential integrity with CASCADE delete
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_shifts;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON holiday_shifts;

-- Create new policies for holiday_submissions
CREATE POLICY "Enable public access"
ON holiday_submissions
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new policies for holiday_shifts
CREATE POLICY "Enable public access"
ON holiday_shifts
FOR ALL
TO public
USING (true)
WITH CHECK (true);