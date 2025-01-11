/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-subtle': 'linear-gradient(to bottom, rgb(23, 23, 23), rgb(38, 38, 38))',
        'gradient-subtle-hover': 'linear-gradient(to bottom, rgb(38, 38, 38), rgb(64, 64, 64))',
      },
    },
  },
  plugins: [],
};