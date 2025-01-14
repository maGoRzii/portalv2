/*
  # Add Employee Number Field

  1. New Columns
    - `employee_number` (text) - Unique employee identifier number
*/

-- Add employee number column
ALTER TABLE employees
ADD COLUMN employee_number text;

-- Create unique index for employee number
CREATE UNIQUE INDEX idx_employee_number ON employees(employee_number) 
WHERE employee_number IS NOT NULL;