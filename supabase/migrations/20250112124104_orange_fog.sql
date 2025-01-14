/*
  # Add employee contract details
  
  1. Changes
    - Add contract_hours column to employees table
    - Add position column to employees table with position validation
    - Add position_code column for initials display
  
  2. Data
    - Add check constraint for valid positions
    - Add trigger to automatically set position_code based on position
*/

-- Add new columns
ALTER TABLE employees
ADD COLUMN contract_hours numeric,
ADD COLUMN position text,
ADD COLUMN position_code text;

-- Add check constraint for positions
ALTER TABLE employees
ADD CONSTRAINT valid_position CHECK (
  position IN (
    'Gestor de Operaciones',
    'Cajero Central',
    'Manager de Niño',
    'Comercial Sección Señora',
    'Dependiente',
    'Director de Tienda',
    'Manager de Señora',
    'Comercial Sección Niño',
    'Adjunto de Dirección',
    'Comercial Sección Caballero',
    'Cajero de Sección',
    'Manager de Caballero',
    'Manager de Operaciones',
    'Manager Experiencia'
  )
);

-- Create function to generate position code
CREATE OR REPLACE FUNCTION generate_position_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.position_code := CASE NEW.position
    WHEN 'Gestor de Operaciones' THEN 'GO'
    WHEN 'Cajero Central' THEN 'CC'
    WHEN 'Manager de Niño' THEN 'MN'
    WHEN 'Comercial Sección Señora' THEN 'CSS'
    WHEN 'Dependiente' THEN 'DEP'
    WHEN 'Director de Tienda' THEN 'DT'
    WHEN 'Manager de Señora' THEN 'MS'
    WHEN 'Comercial Sección Niño' THEN 'CSN'
    WHEN 'Adjunto de Dirección' THEN 'AD'
    WHEN 'Comercial Sección Caballero' THEN 'CSC'
    WHEN 'Cajero de Sección' THEN 'CS'
    WHEN 'Manager de Caballero' THEN 'MC'
    WHEN 'Manager de Operaciones' THEN 'MO'
    WHEN 'Manager Experiencia' THEN 'ME'
    ELSE NULL
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update position_code
CREATE TRIGGER set_position_code
  BEFORE INSERT OR UPDATE OF position
  ON employees
  FOR EACH ROW
  EXECUTE FUNCTION generate_position_code();