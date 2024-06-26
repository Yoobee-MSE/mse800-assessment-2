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
import { Car, Order, OrderStatus, User, UserRole } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { OrderDetails } from '../../database/orders.database';
import { useAppContext } from '../../context';

interface CellType {
  row: OrderDetails;
}

const RowOptions = ({ 
  row, 
  handleDelete, 
  handleUpdate }: 
  { 
    row: OrderDetails, 
    handleDelete: (row: OrderDetails) => Promise<void>, 
    handleUpdate: (row: OrderDetails) => Promise<void>  
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

  const handleDeleteClick = (row: OrderDetails) => {
    setAnchorEl(null)
    setDeleteConfirmationOpen(false)
    handleDelete(row)
  }

  const handleUpdateClick = (row: OrderDetails) => {
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
        <DialogContent>Are you sure you want to delete {row.id}?</DialogContent>
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
  userId: 0,
  carId: 0,
  quantity: 0,
  id: 0,
  status: ''
}

const schema = yup.object().shape({
  userId: yup.number().required(),
  carId: yup.number().required(),
  quantity: yup.number().required(),
  id: yup.number().notRequired(),
  status: yup.string().notRequired(),
})

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [formType, setFormType] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { state } = useAppContext();

  const columns: GridColDef[] = [
    {
      flex: 1,
      minWidth: 50,
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
      flex: 1,
      minWidth: 250,
      field: 'order.user.email',
      headerName: state.dictionary?.table?.email,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.email}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'order.car.vin',
      headerName: 'VIN',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.car.vin}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'quantity',
      headerName: state.dictionary?.table?.quantity,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.quantity}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'status',
      headerName: state.dictionary?.table?.status,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.status}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: state.dictionary?.table?.actions,
      renderCell: ({ row }: CellType) => <RowOptions row={row} handleUpdate={toggleUpdateUser} handleDelete={handleDeleteUser} />
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

  const handleAddUser = async(data: any) => {
    const body = {
      userId: data.userId,
      carId: data.carId,
      quantity: data.quantity,
    }
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST'
      });

      if (response.status < 400) {
        setMessage('Order added successfully');
        setIsOpenSnackbar(true);
      }
      getOrders()
    } catch (error) {
      setMessage('An error occurred while adding order');
      setIsOpenSnackbar(true);
    } finally {
      setIsAdding(false);
      setFormType('');
    }
  }

  const handleDeleteUser = async (row: OrderDetails) => {
    try {
      const response = await fetch(`/api/orders?id=${row.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE'
      });

      if (response.status < 400) {
        setMessage('Order deleted successfully');
        setIsOpenSnackbar(true);
      }
      getOrders()
    } catch (error) {
      setMessage('An error occurred while deleting order');
      setIsOpenSnackbar(true);
    }
  }

  const handleUpdateUser = async (row: OrderDetails) => {
    try {
      const body = {
        id: row.id, 
        quantity: row.quantity, 
        status: row.status
      }
      const response = await fetch(`/api/orders`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'PUT'
      });

      if (response.status < 400) {
        setMessage('User deleted successfully');
        setIsOpenSnackbar(true);
        getOrders()
      }
    } catch (error) {
      setMessage('An error occurred while adding user');
      setIsOpenSnackbar(true);
    } finally {  
      setFormType('');
    }
  }

  const getOrders = async () => {
    setOrders([]);
    setIsLoading(true)
    try {
      const ordersData = await fetch('/api/orders').then((res) => res.json());
      setOrders(ordersData);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }
  const getUsers = async () => {
    setOrders([]);
    setIsLoading(true)
    try {
      const ordersData = await fetch('/api/users').then((res) => res.json());
      setUsers(ordersData);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  const getCars = async () => {
    setOrders([]);
    setIsLoading(true)
    try {
      const ordersData = await fetch('/api/inventory').then((res) => res.json());
      setCars(ordersData);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUpdateUser = async (row: OrderDetails) => {
    clearErrors()
    setValue('userId', row.userId)
    setValue('carId', row.carId)
    setValue('quantity', row.quantity)
    setValue('id', row.id)
    setValue('status', row.status)
    setFormType('Update Order')
  }

  const toggleAddUser = () => {
    clearErrors()
    setValue('userId', 0)
    setValue('carId', 0)
    setValue('quantity', 0)
    setFormType('Add Order')
  }

  const handleSubmitAction = (data: any) => {
    if (formType === 'Add Order') {
      handleAddUser(data)
    } else {
      handleUpdateUser(data)
    }
  }

  useEffect(() => {
    getOrders()
    getUsers()
    getCars()
  }, [])
  return (
    <DashboardLayout>
      <Box sx={{ height: 400, width: '100%' }}>
        <Button onClick={() => toggleAddUser()} variant="contained" color="primary" sx={{ mb: 2, alignSelf: 'flex-end' }}>
          Add Order
        </Button>
        <DataGrid rows={orders} columns={columns} loading={isLoading} />
      </Box>
      <Dialog
        open={formType !== ''}
        onClose={() => setFormType('')}
      >
        <DialogTitle>{formType}</DialogTitle>
        <form onSubmit={handleSubmit(handleSubmitAction)} style={{ width: '100%', marginTop: 20 }}>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
              <Controller
                name='userId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <InputLabel id='form-layouts-separator-select-label'>User</InputLabel>
                    <Select
                      label='User'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value.toString()}
                    >
                      {users.map((user: User, index: number) => (
                        <MenuItem key={index} value={user.id}>
                          {user.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.userId && <FormHelperText sx={{ color: 'error.main' }}>{errors.userId.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
              <Controller
                name='carId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <InputLabel id='form-layouts-separator-select-label'>Cars</InputLabel>
                    <Select
                      label='User'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value.toString()}
                    >
                      {cars.map((car: Car, index: number) => (
                        <MenuItem key={index} value={car.id}>
                          {car.vin}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.carId && <FormHelperText sx={{ color: 'error.main' }}>{errors.carId.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='quantity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Quantity'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.quantity)}
                    placeholder='Quantity'
                    type='number'
                  />
                )}
              />
              {errors.quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.quantity.message}</FormHelperText>}
            </FormControl>
            {formType === 'Update Order' && (
              <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <InputLabel id='form-layouts-separator-select-label'>Order Status</InputLabel>
                    <Select
                      label='Order Status'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    >
                      {Object.values(OrderStatus).map((status: any, index: number) => (
                        <MenuItem key={index} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.status && <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>}
            </FormControl>
            )}
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

export default OrdersPage;
