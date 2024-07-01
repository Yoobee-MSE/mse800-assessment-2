// src/app/locations/page.tsx
"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { MouseEvent }from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Box, Button, Link, Menu, Typography } from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AppState, useAppContext } from '../../context';
import { Car } from '@prisma/client';

interface Warehouse {
	id: number;
	name: string;
	location: string;
	capacity: number;
	createdAt: string; 
	updatedAt: string; 
}

interface CellType {
  row: Car;
}

const RowOptions = ({ 
  row, 
  state,
  // handleDelete, 
  // handleUpdate 
}: 
  { 
    row: Car, 
    state: AppState,
    // handleDelete: (row: Car) => Promise<void>, 
    // handleUpdate: (row: Car) => Promise<void>  
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

  const handleDeleteClick = (row: Car) => {
    setAnchorEl(null)
    setDeleteConfirmationOpen(false)
    // handleDelete(row)
  }

  const handleUpdateClick = (row: Car) => {
    setAnchorEl(null)
    // handleUpdate(row)
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
            {state.dictionary?.buttons?.view}
          </MenuItem>
        <MenuItem onClick={() => handleUpdateClick(row)} sx={{ '& svg': { mr: 2 } }}>
          <EditIcon fontSize='small' />
            {state.dictionary?.buttons?.update}
          </MenuItem>
        <MenuItem onClick={() => setDeleteConfirmationOpen(true)} sx={{ '& svg': { mr: 2 } }}>
          <DeleteIcon fontSize='small' />
            {state.dictionary?.buttons?.delete}
          </MenuItem>
      </Menu>
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete {row.vin}?</DialogContent>
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

const InventoryPage = () => {
	const [tableRows, setTableRows] = useState<Car[]>([])
	const [open, setOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [dialogType, setDialogType] = useState('');
	const [updateFormValue, setUpdateFormValue] = useState<Car>({
		id: 0,
		vin: '',
		make: '',
		model: '',
		year: 0,
		color: '',
		price: 0,
		quantity: 0,
		supplierId: 0,
		warehouseId: 0,
	});
	const [openStack, setOpenStack] = React.useState(false);
	const [stackMessage, setStackMessage] = React.useState('');
	const [selectedCarToDelete, setSelectedCarToDelete] = React.useState('');
	const [carsArrayToDeleteOrUpdate, setCarsArrayToDeleteOrUpdate] = React.useState([]);
	const [warehouseArray, setWarehouseArray] = useState<Warehouse[]>([]);

	const { state } = useAppContext();

	const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 70,
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
      minWidth: 200,
      field: 'vin',
      headerName: 'VIN',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.vin}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'make',
      headerName: state.dictionary?.table?.make,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.make}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'model',
      headerName: state.dictionary?.table?.model,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'year',
      headerName: state.dictionary?.table?.year,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'price',
      headerName: state.dictionary?.table?.price,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
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
      renderCell: ({ row }: CellType) => <RowOptions 
				row={row} 
				state={state} 
				// handleUpdate={toggleUpdateUser} 
				// handleDelete={handleDeleteUser} 
			/>
    }
  ]
	
	const handleChange = (event: SelectChangeEvent) => {
		console.log('handleChange event.target.value', event.target.value);
		setSelectedCarToDelete(event.target.value as string);
	};

	const handleCloseStack = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setStackMessage('');
		setOpenStack(false);
	};

	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleCloseStack}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);
	const handleClickOpenAddDialog = () => {
		setDialogTitle('Add Inventory');
		setDialogContent('Please enter the details of the inventory item you would like to add');
		setDialogType('add');
		setOpen(true);
	};
	const handleClickOpenDeleteDialog = () => {
		setDialogTitle('Delete Inventory');
		setDialogContent('Please enter the details of the inventory item you would like to delete');
		setDialogType('delete');
		setOpen(true);
	}
	const handleClickOpenUpdateDialog = () => {
		setDialogTitle('Update Inventory');
		setDialogContent('Please enter the details of the inventory item you would like to update');
		setDialogType('update');
		setOpen(true);
	}
	const handleCloseDialog = () => {
		setDialogTitle('');
		setDialogContent('');
		setDialogType('');
		setUpdateFormValue(
			{
				id: 0,
				vin: '',
				make: '',
				model: '',
				year: 0,
				color: '',
				price: 0,
				quantity: 0,
				supplierId: 0,
				warehouseId: 0,

			})
		setOpen(false);
	};
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		console.log('submitting form');
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		console.log("formJson", formJson);
		switch (dialogType) {
			case 'add':
				console.log('adding inventory item');
				const response = await fetch('/api/inventory', {
					method: 'POST',
					body: JSON.stringify(formJson),
				});
				const result = await response.json();
				if (result.code === 200) {
					setStackMessage('Inventory added successfully');
					setOpenStack(true);
					getCarsResult()
				}
				break;
			case 'delete':
				console.log('deleting inventory item');
				const response2 = await fetch('/api/inventory', {
					method: 'DELETE',
					body: JSON.stringify(formJson),
				});
				const result2 = await response2.json();
				if (result2.code === 200) {
					setStackMessage('Inventory deleted successfully');
					setOpenStack(true);
					getCarsResult()
				}
				break;
			case 'update':
				console.log('updating inventory item');
				const response1 = await fetch('/api/inventory', {
					method: 'PUT',
					body: JSON.stringify(formJson),
				});
				const result1 = await response1.json();
				if (result1.code === 200) {
					setStackMessage('Inventory updated successfully');
					setOpenStack(true);
					getCarsResult()
				}
				break;
			default:
				console.log('invalid dialog type');
				break;
		}
		handleCloseDialog();
	}
	const exportData = () => {
		console.log('exporting data');
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = '.xlsx';
		const ws = XLSX.utils.json_to_sheet(tableRows);
		const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		saveAs(data, 'inventory' + fileExtension);
	}
	const vinOnBlurInUpdateFormHandler = (event: React.FocusEvent<HTMLInputElement>) => {
		console.log('vinOnBlurInUpdateFormHandler', event.target.value);
		if (event.target.value) {
			fetch(`/api/inventory?vin=${event.target.value}`, {
				method: 'GET',
			}).then(response => response.json())
				.then(result => {
					console.log('result', result, result.data);
					if (result) {
						setUpdateFormValue(result.data);
					}
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}
	}
	async function readableStreamToString(readableStream: any) {
		const reader = readableStream.getReader();
		const textDecoder = new TextDecoder();
		let result = '';
		let done = false;

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			if (value) {
				result += textDecoder.decode(value, { stream: true });
			}
		}
		result += textDecoder.decode();
		return result;
	}
	const getCarsResult = async () => {
		await fetch('/api/inventory', {
			method: 'GET',
		}).then(response => readableStreamToString(response.body))
			.then(resultString => {
				console.log('resultString', resultString);
				setTableRows(JSON.parse(resultString));
			})
			.catch(error => {
				console.error('Error converting stream to string:', error);
			});
	}

	const getWarehouseResult = async () => {
		await fetch('/api/warehouse', {
			method: 'GET',
		}).then(response => readableStreamToString(response.body))
			.then(resultString => {
				console.log('getWarehouseResult resultString', resultString);
				setWarehouseArray(JSON.parse(resultString));
			})
			.catch(error => {
				console.error('Error converting stream to string:', error);
			});
	}
	useEffect(() => {
		getCarsResult()
		getWarehouseResult()
	}, []);
	useEffect(() => {
		//@ts-ignore
		setCarsArrayToDeleteOrUpdate(tableRows.map((row) => row.vin) as any[]);
	}, [tableRows]);
	return (
		<DashboardLayout>
			<Dialog
				open={open}
				onClose={handleCloseDialog}
				PaperProps={{
					component: 'form',
					onSubmit: handleSubmit,
				}}
			>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{dialogContent}
					</DialogContentText>
					{dialogType === 'add' && <div>
						<TextField
							autoFocus
							required
							margin="dense"
							id="vin"
							name="vin"
							label="Vin"
							type="string"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="make"
							name="make"
							label="Make"
							type="string"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="model"
							name="model"
							label="Model"
							type="string"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="year"
							name="year"
							label="Year"
							type="number"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="color"
							name="color"
							label="Color"
							type="string"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="price"
							name="price"
							label="Price"
							type="number"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="quantity"
							name="quantity"
							label="Quantity"
							type="number"
							fullWidth
							variant="standard"
						/>
						<TextField
							required
							margin="dense"
							id="supplierId"
							name="supplierId"
							label="Supplier ID"
							type="number"
							fullWidth
							variant="standard"
						/>

						<InputLabel id="demo-simple-select-label">Warehouse ID</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							value={updateFormValue.warehouseId}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState: any) => {
										return { ...prevState, warehouseId: event.target.value }
									}
								)
							}}
							autoFocus
							required
							margin="dense"
							id="warehouseId"
							name="warehouseId"
							label="Warehouse ID"
							type="number"
							fullWidth
							variant="standard"
						>
							{
								warehouseArray.map((warehouse) => {
									return <MenuItem value={warehouse.id} key={warehouse.id}>{warehouse.id}</MenuItem>
								})
							}
						</Select>
					</div>}
					{dialogType === 'delete' && <div >

						<InputLabel id="demo-simple-select-label">Vin</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							value={selectedCarToDelete}
							onChange={handleChange}
							autoFocus
							required
							margin="dense"
							id="vin"
							name="vin"
							label="Vin"
							type="string"
							fullWidth
							variant="standard"
						>

							{
								carsArrayToDeleteOrUpdate.map((vin) => {
									return <MenuItem value={vin} key={vin}>{vin}</MenuItem>
								})
							}
						</Select>
					</div>}
					{dialogType === 'update' && <div>
						<InputLabel id="demo-simple-select-label">Vin</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							value={updateFormValue?.vin}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, vin: event.target.value }
									}
								)
							}}
							onBlur={vinOnBlurInUpdateFormHandler}
							autoFocus
							required
							margin="dense"
							id="vin"
							name="vin"
							label="Vin"
							type="string"
							fullWidth
							variant="standard"
						>
							{
								carsArrayToDeleteOrUpdate.map((vin) => {
									return <MenuItem value={vin} key={vin}>{vin}</MenuItem>
								})
							}
						</Select>

						<TextField
							required
							margin="dense"
							id="make"
							name="make"
							label="Make"
							type="string"
							fullWidth
							variant="standard"
							value={updateFormValue.make}
							onChange={(event) => {
								console.log('Make event.target.value', event.target.value);
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, make: event.target.value }
									}
								)
							}
							}
						/>
						<TextField
							required
							margin="dense"
							id="model"
							name="model"
							label="Model"
							type="string"
							fullWidth
							variant="standard"
							value={updateFormValue.model}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, model: event.target.value }
									}
								)
							}}
						/>
						<TextField
							required
							margin="dense"
							id="year"
							name="year"
							label="Year"
							type="number"
							fullWidth
							variant="standard"
							value={updateFormValue.year}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, year: Number(event.target.value) }
									}
								)
							}}
						/>
						<TextField
							required
							margin="dense"
							id="color"
							name="color"
							label="Color"
							type="string"
							fullWidth
							variant="standard"
							value={updateFormValue.color}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, color: event.target.value }
									}
								)
							}}
						/>
						<TextField
							required
							margin="dense"
							id="price"
							name="price"
							label="Price"
							type="number"
							fullWidth
							variant="standard"
							value={updateFormValue.price}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, price: Number(event.target.value) }
									}
								)
							}}
						/>
						<TextField
							required
							margin="dense"
							id="quantity"
							name="quantity"
							label="Quantity"
							type="number"
							fullWidth
							variant="standard"
							value={updateFormValue.quantity}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, quantity: Number(event.target.value) }
									}
								)
							}}
						/>
						<TextField
							required
							margin="dense"
							id="supplierId"
							name="supplierId"
							label="Supplier ID"
							type="number"
							fullWidth
							variant="standard"
							value={updateFormValue.supplierId}
							onChange={(event) => {
								setUpdateFormValue(
									(prevState) => {
										return { ...prevState, supplierId: Number(event.target.value) }
									}
								)
							}}
						/>

						<InputLabel id="demo-simple-select-label">Warehouse ID</InputLabel>

						<Select
							labelId="demo-simple-select-label"
							value={updateFormValue.warehouseId}
							onChange={(event) => {
								setUpdateFormValue(
									//@ts-ignore
									(prevState:any) => {
										return { ...prevState, warehouseId: event.target.value }
									}
								)
							}}
							autoFocus
							required
							margin="dense"
							id="warehouseId"
							name="warehouseId"
							label="Warehouse ID"
							type="number"
							fullWidth
							variant="standard"
						>
							{
								warehouseArray.map((warehouse) => {
									return <MenuItem value={warehouse.id} key={warehouse.id}>{warehouse.id}</MenuItem>
								})
							}
						</Select>
					</div>}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button type="submit"
					>Subscribe</Button>
				</DialogActions>
			</Dialog>
			<Box sx={{ height: 400, width: '100%' }}>
				<Button variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}
					onClick={handleClickOpenAddDialog}
				>
					Add Inventory
				</Button>
				<Button variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}
					onClick={handleClickOpenDeleteDialog}
				>
					Delete Inventory
				</Button>
				<Button variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}
					onClick={handleClickOpenUpdateDialog}
				>
					Update Inventory
				</Button>
				<Button onClick={exportData}
					variant="contained" color="primary" sx={{ mb: 2 }}>
					Export
				</Button>
				<DataGrid rows={tableRows} columns={columns} />
			</Box>
			<Snackbar
				open={openStack}
				autoHideDuration={6000}
				onClose={handleCloseStack}
				message={stackMessage}
				action={action}
			/>
		</DashboardLayout>
	);
};

export default InventoryPage;
