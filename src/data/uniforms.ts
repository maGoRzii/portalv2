import { UniformCategory } from '../types/uniform';

// Define available sizes for each item type
export const UNIFORM_SIZES = {
  'men-shirt': [
    { id: 'S', label: 'Talla S' },
    { id: 'M', label: 'Talla M' },
    { id: 'L', label: 'Talla L' },
    { id: 'XL', label: 'Talla XL' },
    { id: 'XXL', label: 'Talla XXL' }
  ],
  'men-pants': [
//    { id: '40', label: 'Talla 40' },
//    { id: '42', label: 'Talla 42' },
    { id: '44', label: 'Talla 44' },
    { id: '46', label: 'Talla 46' },
//    { id: '48', label: 'Talla 48' }
  ],
  'men-jacket': [
    { id: '48', label: 'Talla 48' },
    { id: '50', label: 'Talla 50' },
    { id: '52', label: 'Talla 52' },
    { id: '54', label: 'Talla 54' },
    { id: '56', label: 'Talla 56' }
  ],
  'men-shoes': [
    { id: '38', label: 'Talla 38' },
    { id: '39', label: 'Talla 39' },
//    { id: '40', label: 'Talla 40' },
//    { id: '41', label: 'Talla 41' },
//    { id: '42', label: 'Talla 42' },
//    { id: '43', label: 'Talla 43' },
//    { id: '44', label: 'Talla 44' },
//    { id: '45', label: 'Talla 45' }
  ],
  'women-shirt': [
    { id: 'XS', label: 'Talla XS' },
//    { id: 'S', label: 'Talla S' },
    { id: 'M', label: 'Talla M' },
    { id: 'L', label: 'Talla L' },
    { id: 'XL', label: 'Talla XL' }
  ],
  'women-sweater': [
    { id: 'XXS', label: 'Talla XXS' },
    { id: 'XS', label: 'Talla XS' },
    { id: 'S', label: 'Talla S' },
    { id: 'M', label: 'Talla M' },
    { id: 'L', label: 'Talla L' },
    { id: 'XL', label: 'Talla XL' },
    { id: 'XXL', label: 'Talla XXL' }
  ],
  'women-pants': [
//    { id: '36', label: 'Talla 36' },
//    { id: '38', label: 'Talla 38' },
    { id: '40', label: 'Talla 40' },
    { id: '42', label: 'Talla 42' },
    { id: '44', label: 'Talla 44' },
    { id: '46', label: 'Talla 46' }
  ],
  'women-jacket': [
    { id: 'XXS', label: 'Talla XXS' },
    { id: 'XS', label: 'Talla XS' },
    { id: 'S', label: 'Talla S' },
    { id: 'M', label: 'Talla M' },
    { id: 'L', label: 'Talla L' },
    { id: 'XL', label: 'Talla XL' }
  ],
  'women-shoes': [
    { id: '34', label: 'Talla 34' },
    { id: '35', label: 'Talla 35' },
    { id: '36', label: 'Talla 36' },
    { id: '37', label: 'Talla 37' },
    { id: '38', label: 'Talla 38' },
    { id: '39', label: 'Talla 39' },
    { id: '40', label: 'Talla 40' },
    { id: '41', label: 'Talla 41' },
    { id: '42', label: 'Talla 42' },
    { id: '43', label: 'Talla 43' },
    { id: '44', label: 'Talla 44' }
  ]
};

export const UNIFORM_DATA: UniformCategory[] = [
  {
    id: 'men',
    name: 'Uniforme Hombre',
    items: [
      {
        id: 'men-shirt',
        name: 'Camiseta',
      },
      {
        id: 'men-pants',
        name: 'Pantalón',
      },
      {
        id: 'men-jacket',
        name: 'Americana',
      },
      {
        id: 'men-shoes',
        name: 'Calzado',
      },
    ],
  },
  {
    id: 'women',
    name: 'Uniforme Mujer',
    items: [
      {
        id: 'women-shirt',
        name: 'Camiseta Blanca',
      },
      {
        id: 'women-sweater',
        name: 'Jersey Rayas',
      },
      {
        id: 'women-pants',
        name: 'Pantalón',
      },
      {
        id: 'women-jacket',
        name: 'Americana',
      },
      {
        id: 'women-shoes',
        name: 'Calzado',
      },
    ],
  },
];