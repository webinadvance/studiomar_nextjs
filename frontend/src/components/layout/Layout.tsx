import { ReactNode, useState } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
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
    { text: 'Scadenze', icon: <EventNoteIcon />, path: '/' },
    { text: 'Utenti', icon: <PersonIcon />, path: '/utenti' },
    { text: 'Clienti', icon: <StorefrontIcon />, path: '/clienti' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)'
      }}>
        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
          S
        </Avatar>
        <Typography variant="h6" color="white" fontWeight="bold" sx={{ letterSpacing: 1 }}>
          STUDIO<span style={{ color: theme.palette.primary.light }}>MAR</span>
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      {/* Navigation Links */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              component={RouterLink}
              to={item.path}
              selected={isSelected}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ 
                color: isSelected ? theme.palette.primary.light : 'rgba(255,255,255,0.7)' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'white' : 'rgba(255,255,255,0.7)'
                }} 
              />
              {isSelected && (
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.light,
                    ml: 1
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Sidebar Footer */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1 }}>
            Need Help?
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
            Contact Support
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="text.primary" fontWeight="600">
               {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               Bentornato, {username}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={username || "User"} src="/static/images/avatar/2.jpg" sx={{ bgcolor: theme.palette.secondary.main }}>
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: theme.shadows[3],
                  width: 200
                }
              }}
            >
               <Box sx={{ px: 2, py: 1.5 }}>
                 <Typography variant="subtitle2" noWrap>
                   {username}
                 </Typography>
                 <Typography variant="body2" color="text.secondary" noWrap>
                   user@example.com
                 </Typography>
               </Box>
               <Divider />
              <MenuItem onClick={handleCloseUserMenu}>
                <ListItemIcon>
                   <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderWidth: 0, boxShadow: 3 },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Space for AppBar
          transition: 'all 0.3s ease'
        }}
      >
         {/* Breadcrumbs or Page Header could go here */}
        <Container maxWidth="xl" disableGutters>
            {children}
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;