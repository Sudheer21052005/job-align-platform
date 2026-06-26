// src/styles/theme.js
import { createTheme } from '@mui/material/styles';
import { colors } from './themeTokens';

// Unified theme
const theme = createTheme({
  palette: colors,
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      }
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      }
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      }
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      }
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.9375rem',
      }
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': {
        fontSize: '0.8125rem',
      }
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(138, 79, 255, 0.05)',
    '0 2px 4px rgba(138, 79, 255, 0.07)',
    '0 4px 6px rgba(138, 79, 255, 0.1)',
    '0 6px 8px rgba(138, 79, 255, 0.12)',
    '0 8px 12px rgba(138, 79, 255, 0.14)',
    '0 12px 16px rgba(138, 79, 255, 0.16)',
    '0 16px 24px rgba(138, 79, 255, 0.18)',
    '0 20px 32px rgba(138, 79, 255, 0.2)',
    '0 24px 40px rgba(138, 79, 255, 0.22)',
    '0 32px 48px rgba(138, 79, 255, 0.24)',
    '0 40px 56px rgba(138, 79, 255, 0.26)',
    '0 48px 64px rgba(138, 79, 255, 0.28)',
    '0 56px 72px rgba(138, 79, 255, 0.3)',
    '0 64px 80px rgba(138, 79, 255, 0.32)',
    '0 72px 88px rgba(138, 79, 255, 0.34)',
    '0 80px 96px rgba(138, 79, 255, 0.36)',
    '0 88px 104px rgba(138, 79, 255, 0.38)',
    '0 96px 112px rgba(138, 79, 255, 0.4)',
    '0 104px 120px rgba(138, 79, 255, 0.42)',
    '0 112px 128px rgba(138, 79, 255, 0.44)',
    '0 120px 136px rgba(138, 79, 255, 0.46)',
    '0 128px 144px rgba(138, 79, 255, 0.48)',
    '0 136px 152px rgba(138, 79, 255, 0.5)',
    '0 144px 160px rgba(138, 79, 255, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px rgba(138, 79, 255, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(138, 79, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(138, 79, 255, 0.3)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.default,
          color: colors.text.primary,
          boxShadow: '0 1px 3px rgba(138, 79, 255, 0.1)',
          borderBottom: `1px solid ${colors.secondary.light}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(138, 79, 255, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(138, 79, 255, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: colors.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            backgroundColor: colors.primary.light,
            color: colors.primary.dark,
            '&:hover': {
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(138, 79, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.default,
          borderRight: `1px solid ${colors.secondary.light}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(138, 79, 255, 0.15)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(138, 79, 255, 0.15)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondary.light,
          '& .MuiTableCell-head': {
            color: colors.text.primary,
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.secondary.main}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: colors.secondary.light,
          },
          '&:hover': {
            backgroundColor: colors.secondary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.secondary.main}`,
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minWidth: 120,
          padding: '12px 16px',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;

// Export theme tokens for direct use in component styles
export const themeTokens = {
  colors,
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(138, 79, 255, 0.05)',
    md: '0 4px 6px rgba(138, 79, 255, 0.1)',
    lg: '0 10px 15px rgba(138, 79, 255, 0.15)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  transitions: {
    default: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  zIndex: {
    appBar: 1200,
    drawer: 1300,
    modal: 1400,
    snackbar: 1500,
    tooltip: 1600,
  },
};
