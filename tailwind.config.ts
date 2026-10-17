import type {Config} from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#faf9f6',
        'surface-dim': '#dbdad7',
        primary: '#505d6c',
        secondary: '#476555',
        tertiary: '#61567d',
        error: '#ba1a1a',
      },
      fontFamily: {
        literata: ['Literata', 'serif'],
        'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
