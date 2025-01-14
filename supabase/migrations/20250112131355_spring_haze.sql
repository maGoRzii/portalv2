-- Make employee_number column required
ALTER TABLE employees
ALTER COLUMN employee_number SET NOT NULL;

-- Add constraint to ensure employee_number is not empty
ALTER TABLE employees
ADD CONSTRAINT employee_number_not_empty 
CHECK (length(trim(employee_number)) > 0);