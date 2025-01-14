-- Create table for contract hours modifications
CREATE TABLE contract_hours_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  hours_change numeric NOT NULL,
  start_date date NOT NULL,
  end_date date,
  reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contract_hours_modifications ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can manage hours modifications"
ON contract_hours_modifications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_hours_mods_employee ON contract_hours_modifications(employee_id);
CREATE INDEX idx_hours_mods_dates ON contract_hours_modifications(start_date, end_date);

-- Create updated_at trigger
CREATE TRIGGER update_contract_hours_modifications_updated_at
  BEFORE UPDATE ON contract_hours_modifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();