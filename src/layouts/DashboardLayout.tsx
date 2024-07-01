"use client";

import { ReactNode } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, AppBar, Toolbar, Typography, Box, CssBaseline, IconButton } from '@mui/material';
import { Dashboard, People, Widgets, Logout, Inventory, List as ListIcon, Warehouse } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { APP_ACTION, useAppContext } from '../context';

const drawerWidth = 240;

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { dispatch, state } = useAppContext();

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

  return (
    // <Layout>
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
              
            </Typography>
            <IconButton color="inherit">
              Kia Ora, {state.user?.email}
            </IconButton>
            <IconButton color="inherit" onClick={() => handleChangeLanguage()}>
              {state.language === 'en' ? 'EN' : 'MI'}
            </IconButton>
            <IconButton color="inherit" onClick={() => handleLogout()}>
              <Logout />
            </IconButton>
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
            <ListItem onClick={() => handleNavigation('/dashboard')}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary={state.dictionary?.menu?.dashboard} />
            </ListItem>
            <ListItem onClick={() => handleNavigation('/users')}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary={state.dictionary?.menu?.users} />
            </ListItem>
            <ListItem onClick={() => handleNavigation('/inventory')}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary={state.dictionary?.menu?.inventory} />
            </ListItem>
            <ListItem onClick={() => handleNavigation('/supplier')}>
              <ListItemIcon>
                <Widgets />
              </ListItemIcon>
              <ListItemText primary={state.dictionary?.menu?.suppliers} />
            </ListItem>
            <ListItem onClick={() => handleNavigation('/orders')}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={state.dictionary?.menu?.orders} />
            </ListItem>
            <ListItem onClick={() => handleNavigation('/warehouses')}>
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
    // </Layout>
  );
};

export default DashboardLayout;
