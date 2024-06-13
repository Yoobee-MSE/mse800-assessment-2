"use client";

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Container, Button, Dialog, DialogContent, DialogActions, DialogContentText, InputLabel, TextField } from '@mui/material';
import { MenuItem, DialogTitle, Snackbar, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DashboardLayout from '@/layouts/DashboardLayout';


type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Supplier Name', width: 200 },
  { field: 'contact', headerName: 'Contact', width: 130 },
  { field: 'email', headerName: 'Email', width: 130 },
  { field: 'phone', headerName: 'Phone', width: 130 },
];

const SuppliersPage= () => {
  const [open, setOpen] = useState(false);
  const [tableRows, setTableRows] = useState<Supplier[]>([])
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [dialogType, setDialogType] = useState('');
  const [newSupplierData, setNewSupplierData] = useState({
    id: 0,
    name: '',
    contact: '',
    email: '',
    phone: '',

  });
  const [openStack, setOpenStack] = React.useState(false);
	const [stackMessage, setStackMessage] = React.useState('');
	const [selectedSupplierToDelete, setSelectedSupplierToDelete] = React.useState('');
	const [supplierArrayToDeleteOrUpdate, setSupplierArrayToDeleteOrUpdate] = React.useState([]);
  const handleChange = (event: SelectChangeEvent<string>) => {
    console.log('Selected supplier', event.target.value);
    setSelectedSupplierToDelete(event.target.value);
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

  const handleAddSupplierDialog = () => {
    setDialogTitle('Add Supplier');
    setDialogContent('Please enter the details of the supplier you would like to add');
    setDialogType('add');
    setOpen(true);
  };
  
  const handleDeleteSupplierDialog = () => {
    setDialogTitle('Delete Supplier');
    setDialogContent('Please enter the details of the supplier you would like to delete');
    setDialogType('delete');
    setOpen(true);
  };
  
  const handleUpdateSupplierDialog = () => {
    setDialogTitle('Update Supplier');
    setDialogContent('Please enter the details of the supplier you would like to update');
    setDialogType('update');
    setOpen(true);
  };

  const handleCloseDialog = () => {
		setDialogTitle('');
		setDialogContent('');
		setDialogType('');
		setNewSupplierData(
			{
        id: 0,
        name: '',
        contact: '',
        email: '',
        phone: '',
			})
		setOpen(false);
	};

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('submitting form');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log("formJson", formJson);
    console.log('adding supplier');
    const response = await fetch('/api/supplier', {
        method: 'POST',
        body: JSON.stringify(formJson),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.code === 200) {
        setStackMessage('Supplier added successfully');
        setOpenStack(true);
        getSupplierResult();
    }
    handleCloseDialog();
  };


  const handleDeleteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      console.log('submitting form');
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      console.log("formJson", formJson);
      console.log('deleting supplier');
      const response = await fetch('/api/supplier', {
          method: 'DELETE',
          body: JSON.stringify(formJson),
      });
      const result = await response.json();
      if (result.code === 200) {
          setStackMessage('Supplier deleted successfully');
          setOpenStack(true);
          getSupplierResult();
      }
      handleCloseDialog();
  };
  


  const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('submitting form');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log("formJson", formJson);
    console.log('updating supplier');
    const response = await fetch('/api/supplier', {
        method: 'PUT',
        body: JSON.stringify(formJson),
    });
    const result = await response.json();
    if (result.code === 200) {
        setStackMessage('Supplier updated successfully');
        setOpenStack(true);
        getSupplierResult();
    }
    handleCloseDialog();
};


  const handleInvalidDialogType = (event: React.FormEvent<HTMLFormElement>) => {
      console.log('submitting form');
      event.preventDefault();
      console.log('invalid dialog type');
      handleCloseDialog();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    switch (dialogType) {
        case 'add':
            handleAddSubmit(event);
            break;
        case 'delete':
            handleDeleteSubmit(event);
            break;
        case 'update':
            handleUpdateSubmit(event);
            break;
        default:
            handleInvalidDialogType(event);
            break;
    }
  };

  const idUpdateFormHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('idUpdateFormHandler', event.target.value);
    if (event.target.value) {
        fetch(`/api/supplier?id=${event.target.value}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(result => {
            console.log('result', result, result.data);
            if (result) {
                setNewSupplierData(result.data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
  };

  async function convertStreamToString(readableStream: any) {
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

  const getSupplierResult = async () => {
    try {
        const response = await fetch('/api/supplier', {
            method: 'GET',
        });

        const stringData = await convertStreamToString(response.body);
        console.log('stringData', stringData);
        setTableRows(JSON.parse(stringData));
    } catch (error) {
        console.error('Error converting stream to string:', error);
    }
  };

  useEffect(() => {
      getSupplierResult();
  }, []);

  useEffect(() => {
      //@ts-ignore
      setSupplierArrayToDeleteOrUpdate(tableRows.map((row) => row.id) as any[]);
  }, [tableRows]);

  useEffect(() => {
    console.log(newSupplierData);
  }, [newSupplierData]);

  return (
    <DashboardLayout>
      <Container>
        <h1>Suppliers</h1>
        <div style={{ marginBottom: '20px' }}>
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
                id="id"
                name="id"
                label="ID"
                type="number"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="string"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="contact"
                name="contact"
                label="Contact"
                type="string"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="phone"
                name="phone"
                label="Phone"
                type="string"
                fullWidth
                variant="standard"
              />
            </div>}

            {dialogType === 'delete' && <div >
            <InputLabel id="demo-simple-select-label">ID</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={selectedSupplierToDelete}
                onChange={handleChange}
                autoFocus
                required
                margin="dense"
                id="id"
                name="id"
                label="id"
                type="number"
                fullWidth
                variant="standard"
              >
                {
                  supplierArrayToDeleteOrUpdate.map((id) => {
                    return <MenuItem value={id} key={id}>{id}</MenuItem>
                  })
                }
              </Select>
            </div>}

            {dialogType === 'update' && <div>
              <InputLabel id="demo-simple-select-label">ID</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={newSupplierData?.id  || ''}
                onChange={(event) => {
                  const selectedId = Number(event.target.value);
                  setNewSupplierData((prevState) => ({
                    ...prevState,
                    id: selectedId,
                  }));
                }}
                onBlur={idUpdateFormHandler}
                autoFocus
                required
                margin="dense"
                id="id"
                name="id"
                label="ID"
                type="number"
                fullWidth
                variant="standard"
              >
                {supplierArrayToDeleteOrUpdate.map((id) => (
                  <MenuItem value={id} key={id}>{id}</MenuItem>
                ))}
              </Select>

              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="string"
                fullWidth
                variant="standard"
                value={newSupplierData?.name}
                onChange={(event) => {
                  setNewSupplierData((prevState) => {
                    return { ...prevState, name: event.target.value }
                  });
                }}
              />
              <TextField
                required
                margin="dense"
                id="contact"
                name="contact"
                label="Contact"
                type="string"
                fullWidth
                variant="standard"
                value={newSupplierData.contact}
                onChange={(event) => {
                  setNewSupplierData((prevState) => {
                    return { ...prevState, contact: event.target.value }
                  });
                }}
              />
              <TextField
                required
                margin="dense"
                id="email"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                value={newSupplierData.email}
                onChange={(event) => {
                  setNewSupplierData((prevState) => {
                    return { ...prevState, email: event.target.value }
                  });
                }}
              />
              <TextField
                required
                margin="dense"
                id="phone"
                name="phone"
                label="Phone"
                type="string"
                fullWidth
                variant="standard"
                value={newSupplierData.phone}
                onChange={(event) => {
                  setNewSupplierData((prevState) => {
                    return { ...prevState, phone: event.target.value }
                  });
                }}
              />
            </div>
            }
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit"
              >Submit</Button>
            </DialogActions>
          </Dialog>

          <div style={{ height: 400, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, mr: 2 }}
              onClick={handleAddSupplierDialog}
            >
              Add Supplier
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, mr: 2 }}
              onClick={handleDeleteSupplierDialog}
            >
              Delete Supplier
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, mr: 2 }}
              onClick={handleUpdateSupplierDialog}
            >
              Update Supplier
            </Button>
            <DataGrid
              rows={tableRows}
              columns={columns}
              pageSizeOptions={[5]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              checkboxSelection
            />
          </div>
          <Snackbar
            open={openStack}
            autoHideDuration={6000}
            onClose={handleCloseStack}
            message={stackMessage}
            action={action}
          />
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default SuppliersPage;