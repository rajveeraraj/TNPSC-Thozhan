import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep Slate Surface Canvas (OLED Black / Midnight Navy)
        surface: '#051424',
        'surface-dim': '#051424',
        'surface-bright': '#2c3a4c',
        'surface-variant': '#273647',
        'surface-container-lowest': '#010f1f',
        'surface-container-low': '#0d1c2d',
        'surface-container': '#122131',
        'surface-container-high': '#1c2b3c',
        'surface-container-highest': '#273647',
        
        // Text & Contrast Colors
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#c6c6cd',
        'on-background': '#d4e4fa',
        'inverse-surface': '#d4e4fa',
        'inverse-on-surface': '#233143',

        // Primary Accents
        primary: '#bec6e0',
        'on-primary': '#283044',
        'primary-container': '#0f172a',
        'on-primary-container': '#798098',
        'primary-fixed': '#dae2fd',
        'primary-fixed-dim': '#bec6e0',
        'on-primary-fixed': '#131b2e',
        'on-primary-fixed-variant': '#3f465c',
        'inverse-primary': '#565e74',

        // Secondary Accents (Saffron Gold)
        secondary: '#ffb77d',
        'secondary-container': '#d97707',
        'on-secondary': '#4d2600',
        'on-secondary-container': '#432100',
        'secondary-fixed': '#ffdcc3',
        'secondary-fixed-dim': '#ffb77d',
        'on-secondary-fixed': '#2f1500',
        'on-secondary-fixed-variant': '#6e3900',

        // Tertiary Accents (Emerald Green / Streak)
        tertiary: '#4edea3',
        'tertiary-container': '#001c10',
        'on-tertiary': '#003824',
        'on-tertiary-container': '#009365',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',

        // Error States
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        // Outlines & Borders
        outline: '#909097',
        'outline-variant': '#45464d',
      },
      spacing: {
        'space-xs': '0.25rem', // 4px
        'space-sm': '0.5rem',  // 8px
        'space-md': '1rem',    // 16px
        'space-lg': '1.5rem',  // 24px
        'space-xl': '2rem',    // 32px
        gutter: '1rem',
        margin: '1rem',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Be Vietnam Pro"', '"Noto Sans Tamil"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Be Vietnam Pro"', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
