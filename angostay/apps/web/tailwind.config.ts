import type { Config } from 'tailwindcss';

/** Tokens do Design System AngoStay — ver docs/04-design-system.md */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5FD',
          100: '#E8EEF9',
          300: '#8FB0E0',
          500: '#2757A5',
          700: '#123568',
          900: '#0A1F44',
        },
        accent: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        surface: 'rgb(var(--surface) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgb(2 6 23 / .06), 0 8px 24px rgb(2 6 23 / .06)',
        'card-hover': '0 12px 32px rgb(2 6 23 / .12)',
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
