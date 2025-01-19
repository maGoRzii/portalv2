/*
  # Insertar datos de tallas de uniformes

  1. Datos
    - Inserta todas las tallas disponibles para cada artículo de uniforme
    - Incluye tallas para uniformes de hombre y mujer
    - Cada talla tiene un ID y una etiqueta descriptiva

  2. Rendimiento
    - Crea índices para optimizar las consultas
*/

-- Insertar datos de tallas
INSERT INTO uniform_sizes (category_id, item_id, size_id, size_label) VALUES
-- Uniformes de hombre
('men', 'men-shirt', 'S', 'Small'),
('men', 'men-shirt', 'M', 'Medium'),
('men', 'men-shirt', 'L', 'Large'),
('men', 'men-shirt', 'XL', 'Extra Large'),

('men', 'men-pants', '40', '40'),
('men', 'men-pants', '42', '42'),
('men', 'men-pants', '44', '44'),
('men', 'men-pants', '46', '46'),

('men', 'men-jacket', '48', '48'),
('men', 'men-jacket', '50', '50'),
('men', 'men-jacket', '52', '52'),
('men', 'men-jacket', '54', '54'),

('men', 'men-shoes', '40', '40'),
('men', 'men-shoes', '41', '41'),
('men', 'men-shoes', '42', '42'),
('men', 'men-shoes', '43', '43'),
('men', 'men-shoes', '44', '44'),

-- Uniformes de mujer
('women', 'women-shirt', 'XS', 'Extra Small'),
('women', 'women-shirt', 'S', 'Small'),
('women', 'women-shirt', 'M', 'Medium'),
('women', 'women-shirt', 'L', 'Large'),

('women', 'women-sweater', 'XS', 'Extra Small'),
('women', 'women-sweater', 'S', 'Small'),
('women', 'women-sweater', 'M', 'Medium'),
('women', 'women-sweater', 'L', 'Large'),

('women', 'women-pants', '36', '36'),
('women', 'women-pants', '38', '38'),
('women', 'women-pants', '40', '40'),
('women', 'women-pants', '42', '42'),

('women', 'women-jacket', '36', '36'),
('women', 'women-jacket', '38', '38'),
('women', 'women-jacket', '40', '40'),
('women', 'women-jacket', '42', '42'),

('women', 'women-shoes', '36', '36'),
('women', 'women-shoes', '37', '37'),
('women', 'women-shoes', '38', '38'),
('women', 'women-shoes', '39', '39'),
('women', 'women-shoes', '40', '40')
ON CONFLICT (item_id, size_id) DO UPDATE 
SET size_label = EXCLUDED.size_label;

-- Crear índice adicional para mejorar el rendimiento si no existe
CREATE INDEX IF NOT EXISTS idx_uniform_sizes_lookup 
ON uniform_sizes(category_id, item_id, size_id);