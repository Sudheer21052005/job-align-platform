/**
 * Centralized theme tokens for white and light purple theme
 * This file contains all color values, spacing, and other design tokens
 * used across the application.
 */

// Color palette - White and Light Purple Theme
export const colors = {
  primary: {
    main: '#8A4FFF',    // Medium purple
    light: '#B794F6',   // Light purple
    dark: '#6B33FF',    // Dark purple
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F0E6FF',    // Very light purple
    light: '#F8F2FF',   // Lighter purple tint
    dark: '#E0D1FF',    // Darker light purple
    contrastText: '#3A2A6D',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FCFAFF',
  },
  text: {
    primary: '#2D2747',
    secondary: '#584D7E',
  },
  success: {
    main: '#10B981',
    light: '#D1FAE5',
    dark: '#065F46',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#FEE2E2',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#92400E',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#6366F1',
    light: '#E0E7FF',
    dark: '#4338CA',
    contrastText: '#FFFFFF',
  },
};

// Spacing tokens
export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
};

// Border radius tokens
export const borderRadius = {
  xs: 4,     // 4px
  sm: 8,     // 8px
  md: 12,    // 12px
  lg: 16,    // 16px
  xl: 24,    // 24px
  circle: '50%',
};

// Shadow tokens with the primary color influence
export const shadows = {
  light: '0 2px 4px rgba(138, 79, 255, 0.06)',
  medium: '0 4px 8px rgba(138, 79, 255, 0.1)',
  strong: '0 8px 16px rgba(138, 79, 255, 0.12)',
  intense: '0 12px 24px rgba(138, 79, 255, 0.16)',
};

// Animation tokens
export const animation = {
  fast: '0.15s ease-in-out',
  default: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',
};

// Font weights
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Z-index values
export const zIndex = {
  appBar: 1100,
  drawer: 1200,
  dropdown: 1300,
  modal: 1400,
  tooltip: 1500,
};

// Breakpoints (matching MUI defaults)
export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// CSS Variables for use in stylesheets
export const cssVariables = {
  // Colors
  'color-primary': colors.primary.main,
  'color-primary-light': colors.primary.light,
  'color-primary-dark': colors.primary.dark,
  
  'color-secondary': colors.secondary.main,
  'color-secondary-light': colors.secondary.light,
  'color-secondary-dark': colors.secondary.dark,
  
  'color-text-primary': colors.text.primary,
  'color-text-secondary': colors.text.secondary,
  
  'color-bg-default': colors.background.default,
  'color-bg-paper': colors.background.paper,
  
  'color-success': colors.success.main,
  'color-error': colors.error.main,
  'color-warning': colors.warning.main,
  'color-info': colors.info.main,
  
  // Shadows
  'shadow-sm': shadows.light,
  'shadow-md': shadows.medium,
  'shadow-lg': shadows.strong,
  
  // Border radius
  'radius-sm': `${borderRadius.xs}px`,
  'radius-md': `${borderRadius.sm}px`,
  'radius-lg': `${borderRadius.md}px`,
  'radius-xl': `${borderRadius.lg}px`,
  
  // Spacing
  'space-1': '0.25rem',
  'space-2': '0.5rem',
  'space-3': '1rem',
  'space-4': '1.5rem',
  'space-5': '2rem',
  'space-6': '3rem',
};

// Export all theme tokens
export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  animation,
  fontWeights,
  zIndex,
  breakpoints,
  cssVariables,
}; 