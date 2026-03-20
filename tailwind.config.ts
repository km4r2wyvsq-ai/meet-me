import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#7c3aed',
        'brand-soft': '#f3e8ff',
        ink: '#0f172a'
      },
      boxShadow: {
        card: '0 16px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
