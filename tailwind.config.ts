import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: '#faf8ff',
        foreground: '#131b2e',
        primary: {
          DEFAULT: '#4343d5',
          container: '#5d5fef',
          fixed: '#e1e0ff',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#006b5e',
          container: '#4bf8de',
          fixed: '#4ffbe1',
        },
        surface: {
          DEFAULT: '#faf8ff',
          container: '#eaedff',
          variant: '#dae2fd',
          dim: '#d2d9f4',
        },
        outline: {
          DEFAULT: '#767586',
          variant: '#c7c4d7',
        },
        muted: {
          DEFAULT: '#f2f3ff',
          foreground: '#464555',
        },
        accent: {
          DEFAULT: '#ffb68b',
          foreground: '#321200',
        },
        destructive: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
        },
        border: '#c7c4d7',
        input: '#eaedff',
        ring: '#4343d5',
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
