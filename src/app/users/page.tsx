// src/app/locations/page.tsx
"use client";

import { DataGrid } from '@mui/x-data-grid';

import { Box, Button } from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';

const rows = [
  { id: 1, name: 'Europe', status: 'Active' },
  { id: 2, name: 'Australia', status: 'Active' },
  { id: 3, name: 'Fiji', status: 'Active' },
  { id: 4, name: 'Indonesia', status: 'Active' },
  { id: 5, name: 'Japan', status: 'Active' },
  { id: 6, name: 'Malaysia', status: 'Active' },
  { id: 7, name: 'Philippines', status: 'Active' },
  { id: 8, name: 'Singapore', status: 'Active' },
  { id: 9, name: 'Thailand', status: 'Active' },
  { id: 10, name: 'United Arab Emirates', status: 'Active' },
  { id: 11, name: 'Vanuatu', status: 'Active' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Location Name', width: 200 },
  { field: 'status', headerName: 'Status', width: 130 },
];

const UsersPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ height: 400, width: '100%' }}>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Export
        </Button>
        <DataGrid rows={rows} columns={columns} checkboxSelection />
      </Box>
    </DashboardLayout>
  );
};

export default UsersPage;
