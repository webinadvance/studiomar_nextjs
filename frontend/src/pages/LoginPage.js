import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Grid, useTheme, InputAdornment, IconButton } from '@mui/material';
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                navigate('/');
            }
            else {
                setError('Nome utente o password non validi');
            }
        }
        catch (err) {
            setError('Si è verificato un errore durante l\'accesso');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Grid, { container: true, component: "main", sx: { height: '100vh' }, children: [_jsxs(Grid, { item: true, xs: false, sm: 4, md: 7, sx: {
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
                }, children: [_jsx(Box, { sx: {
                            position: 'absolute',
                            top: '-10%',
                            left: '-10%',
                            width: '50%',
                            height: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '50%',
                        } }), _jsx(Box, { sx: {
                            position: 'absolute',
                            bottom: '-10%',
                            right: '-10%',
                            width: '60%',
                            height: '60%',
                            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0) 70%)',
                            borderRadius: '50%',
                        } }), _jsxs(Box, { sx: { position: 'relative', zIndex: 1, maxWidth: 600, textAlign: 'center' }, children: [_jsxs(Typography, { variant: "h2", component: "h1", fontWeight: "700", sx: { mb: 2, letterSpacing: 1 }, children: ["STUDIO", _jsx("span", { style: { color: theme.palette.primary.light }, children: "MAR" })] }), _jsx(Typography, { variant: "h5", sx: { mb: 4, fontWeight: 300, opacity: 0.9 }, children: "Suite di Gestione Professionale" }), _jsx(Typography, { variant: "body1", sx: { opacity: 0.7, maxWidth: 480, mx: 'auto', lineHeight: 1.8 }, children: "Semplifica la gestione delle scadenze, amministra i clienti in modo efficiente e accedi a insights potenti con la nostra piattaforma di nuova generazione." })] })] }), _jsx(Grid, { item: true, xs: 12, sm: 8, md: 5, component: Paper, elevation: 6, square: true, sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }, children: _jsxs(Box, { sx: {
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 400
                    }, children: [_jsx(Box, { sx: {
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                color: 'white',
                                mb: 2,
                                boxShadow: theme.shadows[4]
                            }, children: _jsx(LockOutlinedIcon, { fontSize: "large" }) }), _jsx(Typography, { component: "h1", variant: "h4", fontWeight: "600", color: "text.primary", gutterBottom: true, children: "Bentornato" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 4 }, children: "Accedi per continuare" }), error && (_jsx(Alert, { severity: "error", sx: { width: '100%', mb: 3, borderRadius: 2 }, children: error })), _jsxs(Box, { component: "form", noValidate: true, onSubmit: handleSubmit, sx: { mt: 1, width: '100%' }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "username", label: "Nome utente", name: "username", autoComplete: "username", autoFocus: true, value: username, onChange: (e) => setUsername(e.target.value), disabled: isLoading, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonOutlineIcon, { color: "action" }) })),
                                    }, sx: { mb: 2 } }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Password", type: showPassword ? 'text' : 'password', id: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockOutlinedIcon, { color: "action" }) })),
                                        endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "mostra/nascondi password", onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) }))
                                    }, sx: { mb: 3 } }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", sx: {
                                        mt: 1,
                                        mb: 2,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: theme.shadows[4]
                                    }, disabled: isLoading, children: isLoading ? 'Accesso in corso...' : 'Accedi' })] })] }) })] }));
}
