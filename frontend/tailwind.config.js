/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { medical: { 50: '#effcf8', 100: '#d7f6ec', 500: '#119e77', 600: '#0b8565', 700: '#086a52' }, ocean: { 50: '#eff8ff', 500: '#2088df', 600: '#0874c9', 700: '#075ea5' } }, boxShadow: { soft: '0 14px 45px rgba(17, 58, 76, .08)' } } },
  plugins: [],
}
