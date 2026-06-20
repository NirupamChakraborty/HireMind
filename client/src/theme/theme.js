import { createTheme } from '@mui/material/styles';

// ── HireMind Design System ──────────────────────────────────────────────────
// A single source of truth for color, type, radius, and spacing so every
// page (landing, login, signup, app) feels like one product.

const colors = {
  bg: '#0b0d12',
  bgElevated: '#12151c',
  bgPaper: '#161a23',
  bgInput: '#1b202b',
  border: '#262c39',
  borderHover: '#37404f',
  textPrimary: '#edf1f7',
  textSecondary: '#9aa4b5',
  primary: '#5b8cff',
  primaryDark: '#3f6bdb',
  accent: '#22d3a6',
  danger: '#ff5d72',
  warning: '#ffb454',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.bg,
      paper: colors.bgPaper,
    },
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.accent,
      contrastText: '#06140f',
    },
    error: {
      main: colors.danger,
    },
    warning: {
      main: colors.warning,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.bg,
          backgroundImage:
            'radial-gradient(circle at 15% 0%, rgba(91,140,255,0.16), transparent 45%), radial-gradient(circle at 85% 20%, rgba(34,211,166,0.10), transparent 40%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 10,
          paddingBottom: 10,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          boxShadow: '0 8px 24px rgba(91,140,255,0.28)',
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            boxShadow: '0 10px 28px rgba(91,140,255,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.bgInput,
          borderRadius: 10,
          '& fieldset': {
            borderColor: colors.border,
          },
          '&:hover fieldset': {
            borderColor: colors.borderHover,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.bgPaper,
          border: `1px solid ${colors.border}`,
        },
      },
    },
  },
});

export const palette = colors;
