// src/app/layouts/DashboardLayout.tsx
"use client";

import { ReactNode } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, AppBar, Toolbar, Typography, Box, CssBaseline, IconButton } from '@mui/material';
import { Dashboard, People, LocationOn, Category, RoomService, Group, Apartment, Settings,Inventory } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
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
            
          </Typography>
          <IconButton color="inherit">
            <Avatar>SA</Avatar>
          </IconButton>
          <IconButton color="inherit" onClick={() => handleNavigation('/settings')}>
            <Settings />
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
            Invetory Management
          </Typography>
        </Toolbar>
        <List>
          <ListItem onClick={() => handleNavigation('/inventory')}>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/dashboard')}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/users')}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/locations')}>
            <ListItemIcon>
              <LocationOn />
            </ListItemIcon>
            <ListItemText primary="Locations" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/categories')}>
            <ListItemIcon>
              <Category />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/concierge')}>
            <ListItemIcon>
              <RoomService />
            </ListItemIcon>
            <ListItemText primary="Concierge" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/partners')}>
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Partners" />
          </ListItem>
          <ListItem onClick={() => handleNavigation('/facilities')}>
            <ListItemIcon>
              <Apartment />
            </ListItemIcon>
            <ListItemText primary="Facilities" />
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
