
import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
        'inverse-surface': '#283044',
        'inverse-on-surface': '#eef0ff',
        outline: {
          DEFAULT: '#767586',
          variant: '#c7c4d7',
        },
        'outline-variant': '#c7c4d7',
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
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        'margin-mobile': '12px',
        'margin-desktop': '60px',
        base: '6px',
        xs: '3px',
        sm: '10px',
        md: '20px',
        lg: '32px',
        xl: '48px',
        gutter: '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
