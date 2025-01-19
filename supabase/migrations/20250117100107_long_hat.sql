-- Limpiar datos existentes
TRUNCATE TABLE uniform_sizes;

-- Insertar datos corregidos
INSERT INTO uniform_sizes (category_id, item_id, size_id, size_label) VALUES
-- Uniformes de hombre
('men', 'men-shirt', 'S', 'Talla S'),
('men', 'men-shirt', 'M', 'Talla M'),
('men', 'men-shirt', 'L', 'Talla L'),
('men', 'men-shirt', 'XL', 'Talla XL'),
('men', 'men-shirt', 'XXL', 'Talla XXL'),

('men', 'men-pants', '40', 'Talla 40'),
('men', 'men-pants', '42', 'Talla 42'),
('men', 'men-pants', '44', 'Talla 44'),
('men', 'men-pants', '46', 'Talla 46'),
('men', 'men-pants', '48', 'Talla 48'),

('men', 'men-jacket', '48', 'Talla 48'),
('men', 'men-jacket', '50', 'Talla 50'),
('men', 'men-jacket', '52', 'Talla 52'),
('men', 'men-jacket', '54', 'Talla 54'),
('men', 'men-jacket', '56', 'Talla 56'),

('men', 'men-shoes', '40', 'Talla 40'),
('men', 'men-shoes', '41', 'Talla 41'),
('men', 'men-shoes', '42', 'Talla 42'),
('men', 'men-shoes', '43', 'Talla 43'),
('men', 'men-shoes', '44', 'Talla 44'),
('men', 'men-shoes', '45', 'Talla 45'),

-- Uniformes de mujer
('women', 'women-shirt', 'XS', 'Talla XS'),
('women', 'women-shirt', 'S', 'Talla S'),
('women', 'women-shirt', 'M', 'Talla M'),
('women', 'women-shirt', 'L', 'Talla L'),
('women', 'women-shirt', 'XL', 'Talla XL'),

('women', 'women-sweater', 'XS', 'Talla XS'),
('women', 'women-sweater', 'S', 'Talla S'),
('women', 'women-sweater', 'M', 'Talla M'),
('women', 'women-sweater', 'L', 'Talla L'),
('women', 'women-sweater', 'XL', 'Talla XL'),

('women', 'women-pants', '36', 'Talla 36'),
('women', 'women-pants', '38', 'Talla 38'),
('women', 'women-pants', '40', 'Talla 40'),
('women', 'women-pants', '42', 'Talla 42'),
('women', 'women-pants', '44', 'Talla 44'),

('women', 'women-jacket', '36', 'Talla 36'),
('women', 'women-jacket', '38', 'Talla 38'),
('women', 'women-jacket', '40', 'Talla 40'),
('women', 'women-jacket', '42', 'Talla 42'),
('women', 'women-jacket', '44', 'Talla 44'),

('women', 'women-shoes', '36', 'Talla 36'),
('women', 'women-shoes', '37', 'Talla 37'),
('women', 'women-shoes', '38', 'Talla 38'),
('women', 'women-shoes', '39', 'Talla 39'),
('women', 'women-shoes', '40', 'Talla 40'),
('women', 'women-shoes', '41', 'Talla 41');

-- Verificar que los datos se insertaron correctamente
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM uniform_sizes WHERE category_id = 'men' LIMIT 1
  ) THEN
    RAISE EXCEPTION 'No se encontraron tallas para uniformes de hombre';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM uniform_sizes WHERE category_id = 'women' LIMIT 1
  ) THEN
    RAISE EXCEPTION 'No se encontraron tallas para uniformes de mujer';
  END IF;
END $$;