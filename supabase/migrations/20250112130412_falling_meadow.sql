/*
  # Add Leave Fields to Employees Table

  1. New Columns
    - `leave_date` (date) - Date when the employee will leave or has left
    - `leave_reason` (text) - Reason for leaving with predefined options

  2. Changes
    - Add columns without constraints
    - Add check constraint for leave reasons
    - Handle existing data safely
*/

-- First add columns without constraints
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS leave_date date,
ADD COLUMN IF NOT EXISTS leave_reason text;

-- Add check constraint for leave reasons
ALTER TABLE employees
ADD CONSTRAINT valid_leave_reason CHECK (
  leave_reason IS NULL OR
  leave_reason IN (
    'Agotamiento I.T.',
    'Cambio de Contrato',
    'Despido',
    'Excd. por cuidado de descendiente - Plan de Igualdad',
    'Excd. por cuidado de familiar - Plan de Igualdad',
    'Excedencia especial de verano',
    'Excedencia plataforma',
    'Excedencia por adopción internacional',
    'Excedencia por cuidado de familiares',
    'Excedencia por cuidado de hijo',
    'Excedencia por estudios',
    'Excedencia por fall., acc., o enfermedad de cónyuje',
    'Excedencia por motivos personales',
    'Excedencia por plan COVID19',
    'Excedencia voluntaria',
    'Excedencia voluntaria convenio',
    'Fallecimiento',
    'Fin actividad fijos - discontinuos',
    'Fin de Contrato',
    'Fusión',
    'Incomparecencia',
    'Jubilación',
    'Nunca Trabajó',
    'Pensionista',
    'Periodo de prueba',
    'Periodo de prueba a instancia del trabajador',
    'Resolución trabajador por modificación sustancial',
    'Traslado',
    'Traslado - Intransit',
    'Voluntaria'
  )
);

-- Update existing records to ensure they comply with constraints
UPDATE employees 
SET leave_date = NULL, 
    leave_reason = NULL 
WHERE status = 'active';

-- Add validation for leave date requirement
CREATE OR REPLACE FUNCTION validate_leave_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    NEW.leave_date = NULL;
    NEW.leave_reason = NULL;
  ELSIF (NEW.status = 'future_leave' OR NEW.status = 'inactive') AND 
        (NEW.leave_date IS NULL OR NEW.leave_reason IS NULL) THEN
    RAISE EXCEPTION 'Leave date and reason are required for inactive or future leave status';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_leave_fields
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_leave_fields();