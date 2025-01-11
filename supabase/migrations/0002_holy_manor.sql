/*
  # Update Holiday Submissions Security Policies

  1. Security Updates
    - Drop existing policies to avoid conflicts
    - Recreate policies with proper permissions for:
      - Anonymous submissions
      - Authenticated reading access
  
  2. Changes
    - Added IF NOT EXISTS for table creation
    - Added DROP POLICY IF EXISTS for clean policy recreation
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON holiday_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON holiday_shifts;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON holiday_shifts;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS holiday_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS holiday_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES holiday_submissions(id) ON DELETE CASCADE,
  holiday_date date NOT NULL,
  compensation_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE holiday_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_shifts ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable insert for anonymous users" 
ON holiday_submissions FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
ON holiday_submissions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for anonymous users" 
ON holiday_shifts FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
ON holiday_shifts FOR SELECT 
TO authenticated 
USING (true);