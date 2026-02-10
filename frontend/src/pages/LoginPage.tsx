import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  useTheme,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      
      {/* Left Side - Brand/Visuals */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #000000 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Circles */}
        <Box sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0) 70%)',
          borderRadius: '50%',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" fontWeight="700" sx={{ mb: 2, letterSpacing: 1 }}>
            STUDIO<span style={{ color: theme.palette.primary.light }}>MAR</span>
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}>
            Suite di Gestione Professionale
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7, maxWidth: 480, mx: 'auto', lineHeight: 1.8 }}>
            Semplifica la gestione delle scadenze, amministra i clienti in modo efficiente e accedi a insights potenti con la nostra piattaforma di nuova generazione.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400
          }}
        >
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            bgcolor: 'primary.light', 
            color: 'white',
            mb: 2,
            boxShadow: theme.shadows[4]
          }}>
            <LockOutlinedIcon fontSize="large" />
          </Box>
          
          <Typography component="h1" variant="h4" fontWeight="600" color="text.primary" gutterBottom>
            Bentornato
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Accedi per continuare
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nome utente"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="mostra/nascondi password"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 1, 
                mb: 2, 
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: theme.shadows[4]
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
            

          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}