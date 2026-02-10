import { createTheme, alpha, Theme } from '@mui/material/styles';
import { itIT } from '@mui/x-date-pickers/locales';
import { itIT as itITCore } from '@mui/material/locale';

export const getTheme = (accentColor: string): Theme => {
  const secondaryColor = '#0f172a'; // Deep slate (almost black)

  return createTheme({
    palette: {
      primary: {
        main: accentColor,
        light: alpha(accentColor, 0.7),
        dark: alpha(accentColor, 1.2),
        contrastText: '#ffffff',
      },
      // ... rest of palette
      secondary: {
        main: secondaryColor,
        light: '#334155',
        dark: '#020617',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
      divider: alpha('#cbd5e1', 0.6),
    },
    // ... rest of theme configuration
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
        textTransform: 'none',
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
      ...Array(19).fill('none') 
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
            background: `linear-gradient(135deg, ${accentColor} 0%, ${alpha(accentColor, 0.8)} 100%)`,
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
                borderColor: accentColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: accentColor,
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
            backgroundColor: '#0f172a',
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
              backgroundColor: alpha(accentColor, 0.15),
              color: accentColor,
              '& .MuiListItemIcon-root': {
                color: accentColor,
              },
              '&:hover': {
                backgroundColor: alpha(accentColor, 0.25),
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
  }, itITCore, itIT);
};

export default getTheme('#2563eb');