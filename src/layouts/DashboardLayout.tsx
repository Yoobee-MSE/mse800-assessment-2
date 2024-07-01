"use client";

import { ReactNode, useState, MouseEvent } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, AppBar, Toolbar, Typography, Box, CssBaseline, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Dashboard, People, Widgets, Logout, Inventory, List as ListIcon, Warehouse } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { APP_ACTION, useAppContext } from '../context';

const drawerWidth = 240;

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { dispatch, state } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    dispatch({ type: APP_ACTION.SET_IS_AUTHENTICATED, payload: false });
    dispatch({ type: APP_ACTION.SET_USER, payload: null })
    router.push('/login');
  }

  const handleChangeLanguage = () => {
    dispatch({ type: APP_ACTION.SET_APP_LANGUAGE, payload: state.language === 'en' ? 'mi' : 'en' });
  }

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Add your app title or logo here */}
          </Typography>
          <IconButton color="inherit" onClick={handleChangeLanguage}>
            {state.language === 'en' ? 'EN' : 'MI'}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleMenu}
          >
            <Avatar alt={state.user?.fullName} src="/path/to/user/avatar.jpg" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar alt={state.user?.fullName} src="/path/to/user/avatar.jpg" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1">{state.user?.fullName}</Typography>
                <Typography variant="body2" color="textSecondary">{state.user?.email}</Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleNavigation('/profile')}>My Profile</MenuItem>
            <MenuItem onClick={() => handleNavigation('/settings')}>Settings</MenuItem>
            <MenuItem onClick={() => handleNavigation('/pricing')}>Pricing</MenuItem>
            <MenuItem onClick={() => handleNavigation('/faq')}>FAQ</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            CarDepot
          </Typography>
        </Toolbar>
        <List>
          <ListItem button onClick={() => handleNavigation('/dashboard')}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.dashboard} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/users')}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.users} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/inventory')}>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.inventory} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/supplier')}>
            <ListItemIcon>
              <Widgets />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.suppliers} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/orders')}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.orders} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/warehouses')}>
            <ListItemIcon>
              <Warehouse />
            </ListItemIcon>
            <ListItemText primary={state.dictionary?.menu?.warehouse} />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          mt: 8, // Adjust this value based on your AppBar height
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
