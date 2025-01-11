/*
  # Holiday Submissions Schema

  1. New Tables
    - `holiday_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `comments` (text)
      - `created_at` (timestamp)
    - `holiday_shifts`
      - `id` (uuid, primary key)
      - `submission_id` (uuid, foreign key)
      - `holiday_date` (date)
      - `compensation_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for inserting and viewing data
*/

-- Create holiday submissions table
CREATE TABLE holiday_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Create holiday shifts table
CREATE TABLE holiday_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES holiday_submissions(id) ON DELETE CASCADE,
  holiday_date date NOT NULL,
  compensation_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE holiday_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_shifts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow insert for all users" ON holiday_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow insert for all users" ON holiday_shifts
  FOR INSERT TO anon
  WITH CHECK (true);