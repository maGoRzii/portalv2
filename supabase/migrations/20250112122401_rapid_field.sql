/*
  # Complementary Hours Management Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `group` (text, optional)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `hours_records`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references employees)
      - `week_code` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `extra_hours` (numeric)
      - `returned_hours` (numeric)
      - `balance` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  "group" text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hours_records table
CREATE TABLE IF NOT EXISTS hours_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  week_code text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  extra_hours numeric NOT NULL DEFAULT 0,
  returned_hours numeric NOT NULL DEFAULT 0,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_employees_full_name ON employees(full_name);
CREATE INDEX idx_hours_records_employee_id ON hours_records(employee_id);
CREATE INDEX idx_hours_records_week_code ON hours_records(week_code);
CREATE INDEX idx_hours_records_dates ON hours_records(start_date, end_date);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hours_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage employees"
ON employees FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage hours records"
ON hours_records FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hours_records_updated_at
  BEFORE UPDATE ON hours_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();