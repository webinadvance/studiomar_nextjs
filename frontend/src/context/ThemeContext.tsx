import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../theme/theme';

interface ThemeContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_ACCENT_COLOR = '#2563eb';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('accentColor') || DEFAULT_ACCENT_COLOR;
  });

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const theme = getTheme(accentColor);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
