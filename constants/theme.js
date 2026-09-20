// Stitch Design System extracted tokens for Academic Nexus / NEC Faculty App
// Project ID: 2431280884270750586
import { Platform } from 'react-native';

const MONO_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const Colors = {
  // Institutional Primary Palette
  primary: '#001428',
  primaryContainer: '#0f2942',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#7991af',
  primaryFixed: '#d1e4ff',
  primaryFixedDim: '#b0c9e8',
  onPrimaryFixed: '#011d35',
  onPrimaryFixedVariant: '#314863',

  // Interactive Secondary Palette
  secondary: '#0051d5',
  secondaryAccent: '#2563eb',
  secondaryContainer: '#316bf3',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#fefcff',
  secondaryFixed: '#dbe1ff',
  secondaryFixedDim: '#b4c5ff',
  onSecondaryFixed: '#00174b',
  onSecondaryFixedVariant: '#003ea8',

  // Semantic & Lab Tertiary Palette (Teal/Emerald)
  tertiary: '#00170d',
  tertiaryContainer: '#002e1d',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#21a173',
  tertiaryFixed: '#85f8c4',
  tertiaryFixedDim: '#68dba9',
  onTertiaryFixed: '#002114',
  onTertiaryFixedVariant: '#005137',

  // Canvas & Surfaces
  background: '#f8f9ff',
  surface: '#f8f9ff',
  surfaceBright: '#f8f9ff',
  surfaceDim: '#cbdbf5',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',

  // Neutral Typography & Borders
  onSurface: '#0b1c30',
  onSurfaceVariant: '#43474d',
  outline: '#74777e',
  outlineVariant: '#c3c6ce',
  inverseSurface: '#213145',
  inverseOnSurface: '#eaf1ff',

  // Semantic Alert States
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',
  warningAmber: '#d97706',
  warningBg: '#fffbeb',
  successForest: '#16a34a',
  successBg: '#f0fdf4',

  // Course-Type Specific Styling
  taxonomy: {
    theory: {
      bg: '#eff4ff',
      text: '#001428',
      accent: '#0051d5',
      border: '#c3c6ce',
      badgeBg: '#d3e4fe',
      badgeText: '#0051d5',
    },
    lab: {
      bg: '#002e1d',
      text: '#ffffff',
      accent: '#68dba9',
      border: '#21a173',
      badgeBg: '#00170d',
      badgeText: '#85f8c4',
    },
    elective: {
      bg: '#dbe1ff',
      text: '#00174b',
      accent: '#316bf3',
      border: '#b4c5ff',
      badgeBg: '#316bf3',
      badgeText: '#fefcff',
    },
    other: {
      bg: '#e5eeff',
      text: '#43474d',
      accent: '#49607c',
      border: '#c3c6ce',
      badgeBg: '#dce9ff',
      badgeText: '#43474d',
    },
    free: {
      bg: '#eff4ff',
      text: '#74777e',
      accent: '#c3c6ce',
      border: '#e5eeff',
      badgeBg: '#e5eeff',
      badgeText: '#74777e',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  margin: 16,
  gutter: 16,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const Typography = {
  displayLg: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  headlineLg: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  titleMd: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  bodyLg: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: Colors.onSurface,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.onSurface,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
  },
  labelMd: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  labelMono: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  badgeLabel: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};
