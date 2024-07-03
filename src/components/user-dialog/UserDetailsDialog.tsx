// src/components/DetailsDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, Grid } from '@mui/material';
import { CarDetails } from '../../database/inventory.database';
import { formatPrice } from '../../utils/price-format';
import { useAppContext } from '../../context';
import { User } from '@prisma/client';

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  details: User;
}

const UserDetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, details }) => {
  const { state } = useAppContext();
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{state.dictionary?.forms?.my_profile}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar alt={details?.fullName} sx={{ width: 100, height: 100 }} />
          <Typography variant="h6" mt={2}>
            {details?.fullName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {details?.email}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {details.role}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {state.dictionary?.buttons?.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;
