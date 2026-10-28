/**
 * Stitch Design System Tokens — TNPSC Aspire
 * Source: Google Stitch Project 1469633910251393858
 */

export const THEME_COLORS = {
  // Surface / Canvas (OLED Navy & Slate)
  surface: '#051424',
  surfaceDim: '#051424',
  surfaceBright: '#2c3a4c',
  surfaceVariant: '#273647',
  surfaceContainerLowest: '#010f1f',
  surfaceContainerLow: '#0d1c2d',
  surfaceContainer: '#122131',
  surfaceContainerHigh: '#1c2b3c',
  surfaceContainerHighest: '#273647',

  // Text & Typography Contrast
  onSurface: '#d4e4fa',
  onSurfaceVariant: '#c6c6cd',
  onBackground: '#d4e4fa',
  inverseSurface: '#d4e4fa',
  inverseOnSurface: '#233143',

  // Primary Accent (Muted Slate / Avatar)
  primary: '#bec6e0',
  onPrimary: '#283044',
  primaryContainer: '#0f172a',
  onPrimaryContainer: '#798098',
  primaryFixed: '#dae2fd',
  primaryFixedDim: '#bec6e0',
  onPrimaryFixed: '#131b2e',
  onPrimaryFixedVariant: '#3f465c',
  inversePrimary: '#565e74',

  // Secondary Accent (Saffron Gold)
  secondary: '#ffb77d',
  secondaryContainer: '#d97707',
  onSecondary: '#4d2600',
  onSecondaryContainer: '#432100',
  secondaryFixed: '#ffdcc3',
  secondaryFixedDim: '#ffb77d',
  onSecondaryFixed: '#2f1500',
  onSecondaryFixedVariant: '#6e3900',

  // Tertiary Accent (Emerald Green / Streak)
  tertiary: '#4edea3',
  tertiaryContainer: '#001c10',
  onTertiary: '#003824',
  onTertiaryContainer: '#009365',
  tertiaryFixed: '#6ffbbe',
  tertiaryFixedDim: '#4edea3',
  onTertiaryFixed: '#002113',
  onTertiaryFixedVariant: '#005236',

  // Error & Alert
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',

  // Borders & Dividers
  outline: '#909097',
  outlineVariant: '#45464d',
} as const;

export const TYPOGRAPHY = {
  headlineFont: '"Plus Jakarta Sans", sans-serif',
  bodyFont: '"Be Vietnam Pro", "Noto Sans Tamil", sans-serif',
  tamilFont: '"Noto Sans Tamil", "Be Vietnam Pro", sans-serif',
} as const;

export const GLASS_STYLES = {
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBorder: '1px solid rgba(255, 255, 255, 0.12)',
  cardBlur: '16px',
} as const;
