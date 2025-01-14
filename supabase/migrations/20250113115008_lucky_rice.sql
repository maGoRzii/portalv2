-- Create function to calculate holiday balance
CREATE OR REPLACE FUNCTION get_employee_holiday_balance(employee_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT 
      COALESCE(SUM(CASE 
        WHEN pending_holiday THEN 1
        WHEN returned_holiday THEN -1
        ELSE 0
      END), 0)
    FROM hours_records
    WHERE hours_records.employee_id = $1
  );
END;
$$ LANGUAGE plpgsql;