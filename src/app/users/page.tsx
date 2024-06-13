// src/app/locations/page.tsx
"use client";

import { useEffect, useState, MouseEvent } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Icon, IconButton, InputAdornment, InputLabel, Link, Menu, MenuItem, OutlinedInput, Select, Snackbar, TextField, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '../../layouts/DashboardLayout';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { User, UserRole } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface CellType {
  row: User;
}

const RowOptions = ({ id, row }: { id: number | string; row: User }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false)
  const [approveConfirmationOpen, setApproveConfirmationOpen] = useState<boolean>(false)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }


  const handleDelete = async (row: User) => {
    console.log("🚀 ~ handleDelete ~ row:", row)
    
  }

  const handleApprove = async (row: User) => {
    console.log("🚀 ~ handleApprove ~ row:", row)
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
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href={`/apps/users/${id}`}>
          <VisibilityIcon fontSize='small' />
          View
        </MenuItem>
        <MenuItem onClick={() => setApproveConfirmationOpen(true)} sx={{ '& svg': { mr: 2 } }}>
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
        <DialogContent>Are you sure you want to delete {row.email}?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => handleDelete(row)} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'id',
    headerName: 'ID',
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
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'role',
    headerName: 'Role',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.role}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} row={row} />
  }
]

const defaultValues = {
  email: '',
  password: '',
  role: '',
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5, 'Password must be at least 5 characters').required(),
  role: yup.string().required()
})

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleAddUser = async(data: any) => {
    const body = {
      email: data.email,
      password: data.password,
      role: data.role,
    }
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), 
        method: 'POST'
      });

      if (response.status < 400) {
        setMessage('User added successfully');
        setIsOpenSnackbar(true);
      }
      // getUsers()
    } catch (error) {
      setMessage('An error occurred while adding user');
      setIsOpenSnackbar(true);
    } finally {
      setIsAdding(false);
      setOpenAddUser(false);
    }
  }

  const getUsers = async () => {
    setUsers([]);
    const usersData = await fetch('/api/users').then((res) => res.json());
    setUsers(usersData);
  }

  useEffect(() => {
    if(users.length < 1) {
      getUsers()
    }
  }, [users])
  return (
    <DashboardLayout>
      <Box sx={{ height: 400, width: '100%' }}>
        <Button onClick={() => setOpenAddUser(true)} variant="contained" color="primary" sx={{ mb: 2 }}>
          Add User
        </Button>
        <DataGrid rows={users} columns={columns} />
      </Box>
      <Dialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
      >
        <DialogTitle>Add User</DialogTitle>
        <form onSubmit={handleSubmit(handleAddUser)} style={{ width: '100%', marginTop: 20 }}>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='Email'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <RemoveRedEyeIcon fontSize='medium'/> : <RemoveRedEyeOutlinedIcon fontSize='medium' />}
                          
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
              <Controller
                name='role'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <InputLabel id='form-layouts-separator-select-label'>Role</InputLabel>
                    <Select
                      label='Role'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    >
                      {Object.values(UserRole).map((role: any, index: number) => (
                        <MenuItem key={index} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddUser(false)}>Cancel</Button>
            <Button disabled={!isValid} type="submit">{isAdding ? <CircularProgress />: 'Add User'}</Button>
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

export default UsersPage;
