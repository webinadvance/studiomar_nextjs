import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { itIT } from '@mui/x-date-pickers/locales';
import { itIT as itITCore } from '@mui/material/locale';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import App from './App';

// Merge Italian locales with custom theme
const italianTheme = createTheme(theme, itITCore, itIT);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={italianTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
