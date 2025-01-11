import { UniformCategory } from '../types/uniform';

export const UNIFORM_DATA: UniformCategory[] = [
  {
    id: 'men',
    name: 'Uniforme Hombre',
    items: [
      {
        id: 'men-shirt',
        name: 'Camiseta',
        sizes: [
          { id: 'S', label: 'Talla S' },
          { id: 'M', label: 'Talla M' },
          { id: 'L', label: 'Talla L' },
          { id: 'XL', label: 'Talla XL' },
        ],
      },
      {
        id: 'men-pants',
        name: 'Pantalón',
        sizes: [
          { id: '36', label: 'Talla 36' },
          { id: '38', label: 'Talla 38' },
          { id: '40', label: 'Talla 40' },
          { id: '42', label: 'Talla 42' },
          { id: '44', label: 'Talla 44' },
          { id: '46', label: 'Talla 46' },
          { id: '48', label: 'Talla 48' },
        ],
      },
      {
        id: 'men-jacket',
        name: 'Americana',
        sizes: [
          { id: '44', label: 'Talla 44' },
          { id: '46', label: 'Talla 46' },
          { id: '48', label: 'Talla 48' },
          { id: '50', label: 'Talla 50' },
          { id: '52', label: 'Talla 52' },
          { id: '54', label: 'Talla 54' },
        ],
      },
      {
        id: 'men-shoes',
        name: 'Calzado',
        sizes: [
          { id: '39', label: 'Talla 39' },
          { id: '40', label: 'Talla 40' },
          { id: '41', label: 'Talla 41' },
          { id: '42', label: 'Talla 42' },
          { id: '43', label: 'Talla 43' },
          { id: '44', label: 'Talla 44' },
          { id: '45', label: 'Talla 45' },
          { id: '46', label: 'Talla 46' },
          { id: '47', label: 'Talla 47' },
        ],
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
        sizes: [
          { id: 'XXS', label: 'Talla XXS' },
          { id: 'XS', label: 'Talla XS' },
          { id: 'S', label: 'Talla S' },
          { id: 'M', label: 'Talla M' },
          { id: 'L', label: 'Talla L' },
          { id: 'XL', label: 'Talla XL' },
          { id: 'XXL', label: 'Talla XXL' },
        ],
      },
      {
        id: 'women-sweater',
        name: 'Jersey Rayas',
        sizes: [
          { id: 'XXS', label: 'Talla XXS' },
          { id: 'XS', label: 'Talla XS' },
          { id: 'S', label: 'Talla S' },
          { id: 'M', label: 'Talla M' },
          { id: 'L', label: 'Talla L' },
          { id: 'XL', label: 'Talla XL' },
          { id: 'XXL', label: 'Talla XXL' },
        ],
      },
      {
        id: 'women-pants',
        name: 'Pantalón',
        sizes: [
          { id: '32', label: 'Talla 32' },
          { id: '34', label: 'Talla 34' },
          { id: '36', label: 'Talla 36' },
          { id: '38', label: 'Talla 38' },
          { id: '40', label: 'Talla 40' },
          { id: '42', label: 'Talla 42' },
          { id: '44', label: 'Talla 44' },
          { id: '46', label: 'Talla 46' },
          { id: '48', label: 'Talla 48' },
        ],
      },
      {
        id: 'women-jacket',
        name: 'Americana',
        sizes: [
          { id: 'XXS', label: 'Talla XXS' },
          { id: 'XS', label: 'Talla XS' },
          { id: 'S', label: 'Talla S' },
          { id: 'M', label: 'Talla M' },
          { id: 'L', label: 'Talla L' },
          { id: 'XL', label: 'Talla XL' },
          { id: 'XXL', label: 'Talla XXL' },
        ],
      },
      {
        id: 'women-shoes',
        name: 'Calzado',
        sizes: [
          { id: '35', label: 'Talla 35' },
          { id: '36', label: 'Talla 36' },
          { id: '37', label: 'Talla 37' },
          { id: '38', label: 'Talla 38' },
          { id: '39', label: 'Talla 39' },
          { id: '40', label: 'Talla 40' },
          { id: '41', label: 'Talla 41' },
          { id: '42', label: 'Talla 42' },
        ],
      },
    ],
  },
];