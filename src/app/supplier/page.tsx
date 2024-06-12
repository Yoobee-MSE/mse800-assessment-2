"use client";

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { FC } from 'react';
import Link from 'next/link';
//import { Container, Box, Typography, List, ListItem, ListItemText, Divider, Button, TextField } from '@mui/material';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { createSupplier, getSupplierById, getSuppliers, updateSupplier, deleteSupplier } from './../../database/suppliers.database';
import { SupplierCreateData } from './../../database/suppliers.database';
import DashboardLayout from '@/layouts/DashboardLayout';


type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
};

type SuppliersPageProps = {
  suppliers: Supplier[];
};

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Supplier Name', width: 200 },
  { field: 'contact', headerName: 'Contact', width: 130 },
  { field: 'email', headerName: 'Email', width: 130 },
  { field: 'phone', headerName: 'Phone', width: 130 },
];

const SuppliersPage: FC<SuppliersPageProps> = ({ suppliers: initialSuppliers }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [open, setOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [newSupplierData, setNewSupplierData] = useState<SupplierCreateData>({
    name: '',
    contact: '',
    email: '',
    phone: '',
  });
  
  const handleEdit = (supplier: Supplier) => {
    setEditSupplier(supplier);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      await deleteSupplier(id);
      window.location.reload();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editSupplier) {
      await updateSupplier(editSupplier.id, newSupplierData);
    } else {
      await createSupplier(newSupplierData);
    }
    window.location.reload();
  };

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const data = await fetch('/api/supplier').then((res) => res.json());
        console.log("🚀 ~ fetchSuppliers ~ data:", data)
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    }
  
    fetchSuppliers();
  }, []);

  return (
    <DashboardLayout>
      <Container>
      <h1>Suppliers</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={suppliers}
          columns={columns}
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } }
          }}
          checkboxSelection
        />
      </div>
    </Container>
    </DashboardLayout>
  );
};

export default SuppliersPage;