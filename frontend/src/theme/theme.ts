import { createTheme, alpha } from '@mui/material/styles';

const primaryColor = '#2563eb'; // Modern vibrant blue
const secondaryColor = '#0f172a'; // Deep slate (almost black)

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryColor,
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Very light slate gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: alpha('#cbd5e1', 0.6),
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem', letterSpacing: '0.01em' },
    button: {
      fontWeight: 600,
      textTransform: 'none', // No all-caps
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px -1px rgba(0,0,0,0.05), 0px 4px 5px 0px rgba(0,0,0,0.02), 0px 1px 10px 0px rgba(0,0,0,0.02)',
    '0px 3px 5px -1px rgba(0,0,0,0.06), 0px 6px 10px 0px rgba(0,0,0,0.03), 0px 1px 18px 0px rgba(0,0,0,0.03)',
    '0px 4px 6px -1px rgba(0,0,0,0.07), 0px 8px 12px 0px rgba(0,0,0,0.04), 0px 2px 20px 0px rgba(0,0,0,0.04)',
    '0px 6px 10px -1px rgba(0,0,0,0.08), 0px 12px 18px 0px rgba(0,0,0,0.05), 0px 3px 24px 0px rgba(0,0,0,0.05)',
    '0px 8px 12px -2px rgba(0,0,0,0.09), 0px 16px 24px 2px rgba(0,0,0,0.06), 0px 4px 30px 4px rgba(0,0,0,0.06)',
    // ... fill the rest with standard shadows if needed or keep using defaults. 
    // For simplicity in this tool, we'll let MUI fill the rest, but usually you'd define all 25.
    // However, createTheme merges these with defaults, so we just override the low levels for cards.
    ...Array(20).fill('none') // Placeholder to avoid error, practically we use elevation 1-5 mostly.
  ] as any, 
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#94a3b8 #f1f5f9",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#f1f5f9",
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#94a3b8",
            minHeight: 24,
            border: "2px solid #f1f5f9",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#64748b",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#64748b",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#64748b",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#f1f5f9",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: 'none',
          padding: '8px 20px',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryColor} 0%, #1e40af 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#fff',
            '& fieldset': {
              borderColor: alpha('#cbd5e1', 0.8),
            },
            '&:hover fieldset': {
              borderColor: primaryColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryColor,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: secondaryColor,
          boxShadow: '0px 1px 10px rgba(0,0,0,0.05)',
          borderBottom: `1px solid ${alpha('#cbd5e1', 0.3)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f172a', // Dark Sidebar
          color: '#f8fafc',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(56, 189, 248, 0.15)', // Light cyan tint
            color: '#38bdf8',
            '& .MuiListItemIcon-root': {
              color: '#38bdf8',
            },
            '&:hover': {
              backgroundColor: 'rgba(56, 189, 248, 0.25)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          minWidth: '40px',
        },
      },
    },
  },
});

export default theme;