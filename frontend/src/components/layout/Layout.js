import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, ListItemIcon, IconButton, Avatar, Menu, MenuItem, Tooltip, Divider, useTheme, useMediaQuery, alpha } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
const drawerWidth = 260;
function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout, username } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = async () => {
        handleCloseUserMenu();
        await logout();
        navigate('/login');
    };
    const menuItems = [
        { text: 'Scadenze', icon: _jsx(EventNoteIcon, {}), path: '/' },
        { text: 'Utenti', icon: _jsx(PersonIcon, {}), path: '/utenti' },
        { text: 'Clienti', icon: _jsx(StorefrontIcon, {}), path: '/clienti' },
    ];
    const drawerContent = (_jsxs(Box, { sx: { height: '100%', display: 'flex', flexDirection: 'column' }, children: [_jsxs(Box, { sx: {
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)'
                }, children: [_jsx(Avatar, { sx: { mr: 2, bgcolor: theme.palette.primary.main, width: 40, height: 40 }, children: "S" }), _jsxs(Typography, { variant: "h6", color: "white", fontWeight: "bold", sx: { letterSpacing: 1 }, children: ["STUDIO", _jsx("span", { style: { color: theme.palette.primary.light }, children: "MAR" })] })] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)', mb: 2 } }), _jsx(List, { sx: { px: 2, flexGrow: 1 }, children: menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (_jsxs(ListItemButton, { component: RouterLink, to: item.path, selected: isSelected, onClick: () => isMobile && setMobileOpen(false), sx: {
                            mb: 1,
                        }, children: [_jsx(ListItemIcon, { sx: {
                                    color: isSelected ? theme.palette.primary.light : 'rgba(255,255,255,0.7)'
                                }, children: item.icon }), _jsx(ListItemText, { primary: item.text, primaryTypographyProps: {
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? 'white' : 'rgba(255,255,255,0.7)'
                                } }), isSelected && (_jsx(Box, { sx: {
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.primary.light,
                                    ml: 1
                                } }))] }, item.text));
                }) }), _jsx(Box, { sx: { p: 2 }, children: _jsxs(Box, { sx: {
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }, children: [_jsx(Typography, { variant: "caption", sx: { color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1 }, children: "Hai bisogno di aiuto?" }), _jsx(Typography, { variant: "body2", sx: { color: 'white', fontWeight: 500 }, children: "Contatta il supporto" })] }) })] }));
    return (_jsxs(Box, { sx: { display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }, children: [_jsx(AppBar, { position: "fixed", elevation: 0, sx: {
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { md: 'none' }, color: 'text.primary' }, children: _jsx(MenuIcon, {}) }), _jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h6", color: "text.primary", fontWeight: "600", children: menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard' }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Bentornato, ", username] })] }), _jsxs(Box, { sx: { flexGrow: 0 }, children: [_jsx(Tooltip, { title: "Impostazioni", children: _jsx(IconButton, { onClick: handleOpenUserMenu, sx: { p: 0 }, children: _jsx(Avatar, { alt: username || "User", src: "/static/images/avatar/2.jpg", sx: { bgcolor: theme.palette.secondary.main }, children: username ? username.charAt(0).toUpperCase() : 'U' }) }) }), _jsxs(Menu, { sx: { mt: '45px' }, id: "menu-appbar", anchorEl: anchorElUser, anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }, keepMounted: true, transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }, open: Boolean(anchorElUser), onClose: handleCloseUserMenu, PaperProps: {
                                        sx: {
                                            mt: 1.5,
                                            boxShadow: theme.shadows[3],
                                            width: 200
                                        }
                                    }, children: [_jsxs(Box, { sx: { px: 2, py: 1.5 }, children: [_jsx(Typography, { variant: "subtitle2", noWrap: true, children: username }), _jsx(Typography, { variant: "body2", color: "text.secondary", noWrap: true, children: "user@example.com" })] }), _jsx(Divider, {}), _jsxs(MenuItem, { onClick: handleCloseUserMenu, children: [_jsx(ListItemIcon, { children: _jsx(PersonIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Profilo" })] }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: 'error.main' }, children: [_jsx(ListItemIcon, { children: _jsx(LogoutIcon, { fontSize: "small", color: "error" }) }), _jsx(ListItemText, { children: "Esci" })] })] })] })] }) }), _jsxs(Box, { component: "nav", sx: { width: { md: drawerWidth }, flexShrink: { md: 0 } }, "aria-label": "mailbox folders", children: [_jsx(Drawer, { variant: "temporary", open: mobileOpen, onClose: handleDrawerToggle, ModalProps: { keepMounted: true }, sx: {
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }, children: drawerContent }), _jsx(Drawer, { variant: "permanent", sx: {
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderWidth: 0, boxShadow: 3 },
                        }, open: true, children: drawerContent })] }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8, // Space for AppBar
                    transition: 'all 0.3s ease'
                }, children: _jsx(Container, { maxWidth: "xl", disableGutters: true, children: children }) })] }));
}
export default Layout;
