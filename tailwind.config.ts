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
          'fixed-dim': '#c1c1ff',
        },
        secondary: {
          DEFAULT: '#006b5e',
          container: '#4bf8de',
          fixed: '#4ffbe1',
          'fixed-dim': '#1adec5',
        },
        tertiary: {
          DEFAULT: '#914300',
          container: '#b75600',
          fixed: '#ffdbc8',
          'fixed-dim': '#ffb68b',
        },
        surface: {
          DEFAULT: '#faf8ff',
          container: '#eaedff',
          variant: '#dae2fd',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          'container-low': '#f2f3ff',
          'container-high': '#e2e7ff',
          'container-lowest': '#ffffff',
        },
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-tertiary': '#ffffff',
        'on-surface': '#131b2e',
        'on-surface-variant': '#464555',
        'on-primary-container': '#faf7ff',
        'on-secondary-container': '#006f62',
        'on-tertiary-container': '#fff6f3',
        outline: {
          DEFAULT: '#767586',
          variant: '#c7c4d7',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        border: '#c7c4d7',
        input: '#eaedff',
        ring: '#4343d5',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        full: '9999px',
      },
      spacing: {
        'margin-mobile': '16px',
        'margin-desktop': '80px',
        base: '8px',
        xs: '4px',
        sm: '12px',
        md: '24px',
        lg: '40px',
        xl: '64px',
        gutter: '16px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
