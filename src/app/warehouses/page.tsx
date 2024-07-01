"use client";

import { useEffect, useState, MouseEvent } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { 
  Box, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormHelperText, 
  IconButton, 
  InputLabel, 
  Link, 
  Menu, 
  MenuItem, 
  Select, 
  Snackbar, 
  TextField, 
  Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Warehouse } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppContext } from '../../context';

interface CellType {
  row: Warehouse;
}

const RowOptions = ({ 
  row, 
  handleDelete, 
  handleUpdate }: 
  { 
    row: Warehouse, 
    handleDelete: (row: Warehouse) => Promise<void>, 
    handleUpdate: (row: Warehouse) => Promise<void>  
  }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = (row: Warehouse) => {
    setAnchorEl(null)
    setDeleteConfirmationOpen(false)
    handleDelete(row)
  }

  const handleUpdateClick = (row: Warehouse) => {
    setAnchorEl(null)
    handleUpdate(row)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }}>
          <VisibilityIcon fontSize='small' />
          View
        </MenuItem>
        <MenuItem onClick={() => handleUpdateClick(row)} sx={{ '& svg': { mr: 2 } }}>
          <EditIcon fontSize='small' />
          Update
        </MenuItem>
        <MenuItem onClick={() => setDeleteConfirmationOpen(true)} sx={{ '& svg': { mr: 2 } }}>
          <DeleteIcon fontSize='small' />
          Delete
        </MenuItem>
      </Menu>
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete {row.name}?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => handleDeleteClick(row)} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const defaultValues = {
  name: '',
  location: '',
  capacity: 0,
  id: 0,
}

const schema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  capacity: yup.number().required(),
  id: yup.number().notRequired(),
})

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formType, setFormType] = useState('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { state } = useAppContext();

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'id',
      headerName: state.dictionary?.table?.id,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap variant='caption'>
                {row.id}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'name',
      headerName: state.dictionary?.table?.warehouse,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'location',
      headerName: state.dictionary?.table?.location,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.location}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'capacity',
      headerName: state.dictionary?.table?.capacity,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.capacity}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: state.dictionary?.table?.actions,
      renderCell: ({ row }: CellType) => <RowOptions row={row} handleUpdate={toggleUpdateWarehouse} handleDelete={handleDeleteWarehouse} />
    }
  ]

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleAddWarehouse = async(data: any) => {
    const body = {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
    }
    try {
      const response = await fetch('/api/warehouse', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST'
      });

      if (response.status < 400) {
        setMessage('Warehouse added successfully');
        setIsOpenSnackbar(true);
      }
      getWarehouse()
    } catch (error) {
      setMessage('An error occurred while adding warehouse');
      setIsOpenSnackbar(true);
    } finally {
      setIsAdding(false);
      setFormType('');
    }
  }

  const handleDeleteWarehouse = async (row: Warehouse) => {
    try {
      const response = await fetch(`/api/warehouse?id=${row.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE'
      });

      if (response.status < 400) {
        setMessage('Warhouse deleted successfully');
        setIsOpenSnackbar(true);
      }
      getWarehouse()
    } catch (error) {
      setMessage('An error occurred while deleting Warhouse');
      setIsOpenSnackbar(true);
    }
  }

  const handleUpdateWarehouse = async (row: Warehouse) => {
    try {
      const body = {
        id: row.id, 
        name: row.name,
        location: row.location,
        capacity: row.capacity,
      }
      const response = await fetch(`/api/warehouse`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'PUT'
      });

      if (response.status < 400) {
        setMessage('Warehouse deleted successfully');
        setIsOpenSnackbar(true);
        getWarehouse()
      }
    } catch (error) {
      setMessage('An error occurred while updating warehouse');
      setIsOpenSnackbar(true);
    } finally {  
      setFormType('');
    }
  }

  const getWarehouse = async () => {
    setWarehouses([]);
    setIsLoading(true)
    try {
      const warehouseData = await fetch('/api/warehouse').then((res) => res.json());
      setWarehouses(warehouseData);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUpdateWarehouse = async (row: Warehouse) => {
    clearErrors()
    setValue('name', row.name)
    setValue('location', row.location)
    setValue('capacity', row.capacity)
    setValue('id', row.id)
    setFormType('Update Warehouse')
  }

  const toggleAddWarehouse = () => {
    clearErrors()
    setValue('name', '')
    setValue('location', '')
    setValue('capacity', 0)
    setFormType('Add Warehouse')
  }

  const handleSubmitAction = (data: any) => {
    if (formType === 'Add Warehouse') {
      handleAddWarehouse(data)
    } else {
      handleUpdateWarehouse(data)
    }
  }

  useEffect(() => {
    getWarehouse()
  }, [])
  return (
    <DashboardLayout>
      <Box sx={{ height: 400, width: '100%' }}>
        <Button onClick={() => toggleAddWarehouse()} variant="contained" color="primary" sx={{ mb: 2, alignSelf: 'flex-end' }}>
          Add Warehouse
        </Button>
        <DataGrid rows={warehouses} columns={columns} loading={isLoading} />
      </Box>
      <Dialog
        open={formType !== ''}
        onClose={() => setFormType('')}
      >
        <DialogTitle>{formType}</DialogTitle>
        <form onSubmit={handleSubmit(handleSubmitAction)} style={{ width: '100%', marginTop: 20 }}>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Warehouse Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    placeholder='Warehouse Name'
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='location'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Warehouse Location'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.location)}
                    placeholder='Warehouse Location'
                  />
                )}
              />
              {errors.location && <FormHelperText sx={{ color: 'error.main' }}>{errors.location.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='capacity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Warehouse Capacity'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.capacity)}
                    placeholder='Warehouse Capacity'
                    type='number'
                  />
                )}
              />
              {errors.capacity && <FormHelperText sx={{ color: 'error.main' }}>{errors.capacity.message}</FormHelperText>}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormType('')}>Cancel</Button>
            <Button disabled={!isValid} type="submit">{isAdding ? <CircularProgress /> : formType}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        message={message}
      />
    </DashboardLayout>
  );
};

export default WarehousePage;
