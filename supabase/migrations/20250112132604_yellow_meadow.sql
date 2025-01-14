-- First, delete existing groups
DELETE FROM employee_groups;

-- Insert new predefined groups
INSERT INTO employee_groups (name) VALUES
  ('Operaciones'),
  ('Caja'),
  ('Dirección'),
  ('Comercial Señora'),
  ('Comercial Caballero'),
  ('Comercial Niño'),
  ('Almacén Externo Tienda'),
  ('Almacén'),
  ('Probadores'),
  ('Grupo Sint')
ON CONFLICT (name) DO NOTHING;