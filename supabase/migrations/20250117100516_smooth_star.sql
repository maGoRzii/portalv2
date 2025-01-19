-- Drop existing table
DROP TABLE IF EXISTS uniform_sizes;

-- Create new table with a different name
CREATE TABLE uniform_items_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL,
  size_id text NOT NULL,
  size_label text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(item_id, size_id)
);

-- Enable RLS
ALTER TABLE uniform_items_sizes ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can manage uniform sizes"
ON uniform_items_sizes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_uniform_items_sizes_updated_at
  BEFORE UPDATE ON uniform_items_sizes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_uniform_items_sizes_item ON uniform_items_sizes(item_id);

-- Insert initial data
INSERT INTO uniform_items_sizes (item_id, size_id, size_label) VALUES
-- Uniformes de hombre
('men-shirt', 'S', 'Talla S'),
('men-shirt', 'M', 'Talla M'),
('men-shirt', 'L', 'Talla L'),
('men-shirt', 'XL', 'Talla XL'),
('men-shirt', 'XXL', 'Talla XXL'),

('men-pants', '40', 'Talla 40'),
('men-pants', '42', 'Talla 42'),
('men-pants', '44', 'Talla 44'),
('men-pants', '46', 'Talla 46'),
('men-pants', '48', 'Talla 48'),

('men-jacket', '48', 'Talla 48'),
('men-jacket', '50', 'Talla 50'),
('men-jacket', '52', 'Talla 52'),
('men-jacket', '54', 'Talla 54'),
('men-jacket', '56', 'Talla 56'),

('men-shoes', '40', 'Talla 40'),
('men-shoes', '41', 'Talla 41'),
('men-shoes', '42', 'Talla 42'),
('men-shoes', '43', 'Talla 43'),
('men-shoes', '44', 'Talla 44'),
('men-shoes', '45', 'Talla 45'),

-- Uniformes de mujer
('women-shirt', 'XS', 'Talla XS'),
('women-shirt', 'S', 'Talla S'),
('women-shirt', 'M', 'Talla M'),
('women-shirt', 'L', 'Talla L'),
('women-shirt', 'XL', 'Talla XL'),

('women-sweater', 'XS', 'Talla XS'),
('women-sweater', 'S', 'Talla S'),
('women-sweater', 'M', 'Talla M'),
('women-sweater', 'L', 'Talla L'),
('women-sweater', 'XL', 'Talla XL'),

('women-pants', '36', 'Talla 36'),
('women-pants', '38', 'Talla 38'),
('women-pants', '40', 'Talla 40'),
('women-pants', '42', 'Talla 42'),
('women-pants', '44', 'Talla 44'),

('women-jacket', '36', 'Talla 36'),
('women-jacket', '38', 'Talla 38'),
('women-jacket', '40', 'Talla 40'),
('women-jacket', '42', 'Talla 42'),
('women-jacket', '44', 'Talla 44'),

('women-shoes', '36', 'Talla 36'),
('women-shoes', '37', 'Talla 37'),
('women-shoes', '38', 'Talla 38'),
('women-shoes', '39', 'Talla 39'),
('women-shoes', '40', 'Talla 40'),
('women-shoes', '41', 'Talla 41');