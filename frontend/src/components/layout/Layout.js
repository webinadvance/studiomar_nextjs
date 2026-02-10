import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const drawerWidth = 240;
function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const drawerContent = (_jsxs(List, { children: [_jsxs(ListItem, { component: RouterLink, to: "/", children: [_jsx(ListItemIcon, { children: _jsx(DashboardIcon, {}) }), _jsx(ListItemText, { primary: "Dashboard" })] }), _jsxs(ListItem, { component: RouterLink, to: "/scadenze", children: [_jsx(ListItemIcon, { children: _jsx(EventNoteIcon, {}) }), _jsx(ListItemText, { primary: "Scadenze" })] }), _jsxs(ListItem, { component: RouterLink, to: "/utenti", children: [_jsx(ListItemIcon, { children: _jsx(PersonIcon, {}) }), _jsx(ListItemText, { primary: "Utenti" })] }), _jsxs(ListItem, { component: RouterLink, to: "/clienti", children: [_jsx(ListItemIcon, { children: _jsx(StorefrontIcon, {}) }), _jsx(ListItemText, { primary: "Clienti" })] })] }));
    return (_jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(AppBar, { position: "fixed", sx: { zIndex: (theme) => theme.zIndex.drawer + 1 }, children: _jsxs(Toolbar, { children: [isMobile && (_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2 }, children: _jsx(MenuIcon, {}) })), _jsx(Typography, { variant: "h6", noWrap: true, component: "div", sx: { flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: "Scadenze Management" })] }) }), _jsx(Drawer, { sx: {
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginTop: '64px',
                    },
                }, variant: isMobile ? 'temporary' : 'permanent', anchor: "left", open: isMobile ? mobileOpen : true, onClose: handleDrawerToggle, ModalProps: { keepMounted: true }, children: drawerContent }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
                    marginTop: '64px',
                }, children: _jsx(Container, { maxWidth: "lg", children: children }) })] }));
}
export default Layout;
