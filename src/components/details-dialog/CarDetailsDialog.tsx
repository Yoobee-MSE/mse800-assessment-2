// src/components/DetailsDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, Grid } from '@mui/material';
import { Car } from '@prisma/client';
import { CarDetails } from '../../database/inventory.database';

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  details: CarDetails;
}

const CarDetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, title, details }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar alt={details?.make} sx={{ width: 100, height: 100 }} />
          <Typography variant="h6" mt={2}>
            {details?.make} {details?.model}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {details?.year}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Price: ${details?.price}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Details</Typography>
          <Grid container spacing={2}>
            {details !== null && Object.entries(details).map(([key, value]) => (
              key !== 'imageUrl' && key !== 'make' && key !== 'model' && key !== 'year' && key !== 'price' && (
                <Grid item xs={6} key={key}>
                  <Typography variant="body2" color="textSecondary">
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                  </Typography>
                </Grid>
              )
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarDetailsDialog;
