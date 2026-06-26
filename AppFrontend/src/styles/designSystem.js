import { alpha } from '@mui/material/styles';
import themeTokens from './themeTokens';

// Design tokens - reference the centralized theme tokens
export const tokens = {
  spacing: themeTokens.spacing,
  borderRadius: themeTokens.borderRadius,
  shadows: themeTokens.shadows,
  animation: themeTokens.animation,
};

// Common style presets
export const stylePresets = {
  // Card presets
  card: {
    basic: (theme) => ({
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.light,
      backgroundColor: theme.palette.background.paper,
      transition: tokens.animation.default,
      '&:hover': {
        boxShadow: tokens.shadows.medium,
      },
    }),
    interactive: (theme) => ({
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.light,
      backgroundColor: theme.palette.background.paper,
      transition: tokens.animation.default,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: tokens.shadows.strong,
        transform: 'translateY(-4px)',
      },
    }),
    featured: (theme) => ({
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.medium,
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      transition: tokens.animation.default,
      '&:hover': {
        boxShadow: tokens.shadows.strong,
      },
    }),
  },
  
  // Container presets
  container: {
    page: {
      maxWidth: 1200,
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, md: 3 },
    },
    section: {
      mb: { xs: 4, md: 6 },
    },
  },
  
  // Button presets
  button: {
    primary: (theme) => ({
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      fontWeight: 600,
      borderRadius: tokens.borderRadius.md,
      textTransform: 'none',
      padding: '10px 20px',
      transition: tokens.animation.default,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: tokens.shadows.medium,
      },
    }),
    secondary: (theme) => ({
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      fontWeight: 600,
      borderRadius: tokens.borderRadius.md,
      textTransform: 'none',
      padding: '10px 20px',
      transition: tokens.animation.default,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
    outline: (theme) => ({
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      fontWeight: 600,
      borderRadius: tokens.borderRadius.md,
      textTransform: 'none',
      border: `1px solid ${theme.palette.primary.main}`,
      padding: '9px 19px',
      transition: tokens.animation.default,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      },
    }),
    text: (theme) => ({
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      fontWeight: 600,
      padding: '8px 16px',
      transition: tokens.animation.default,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      },
    }),
  },
  
  // Text presets
  text: {
    heading: {
      fontWeight: 700,
      lineHeight: 1.2,
      mb: 2,
    },
    subheading: {
      fontWeight: 600,
      lineHeight: 1.3,
      mb: 1.5,
      color: (theme) => theme.palette.text.secondary,
    },
    body: {
      lineHeight: 1.6,
      mb: 2,
    },
    caption: {
      fontSize: '0.75rem',
      color: (theme) => theme.palette.text.secondary,
      lineHeight: 1.5,
    },
  },
  
  // Layout presets
  layout: {
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flexBetween: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      display: 'grid',
      gap: { xs: 2, md: 3 },
    },
    responsive: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      gap: { xs: 2, md: 3 },
    },
  },
  
  // Form element presets
  form: {
    input: (theme) => ({
      borderRadius: tokens.borderRadius.md,
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    }),
    select: (theme) => ({
      borderRadius: tokens.borderRadius.md,
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    }),
    checkbox: (theme) => ({
      color: theme.palette.primary.main,
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
    }),
    radio: (theme) => ({
      color: theme.palette.primary.main,
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
    }),
  },
  
  // Decorative elements
  decorative: {
    divider: (theme) => ({
      borderColor: theme.palette.secondary.light,
      my: 3,
    }),
    paper: (theme) => ({
      backgroundColor: theme.palette.background.paper,
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.light,
      padding: 3,
    }),
  },
};

// Reusable composition functions
export const composeStyles = (...styles) => (theme) => {
  return styles.reduce((acc, style) => {
    const styleValue = typeof style === 'function' ? style(theme) : style;
    return { ...acc, ...styleValue };
  }, {});
};

export default { tokens, stylePresets, composeStyles }; 