import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { cancelDonationRegistration } from '../../../api/donationRegistration';

export default function CancelDonor({ open, onClose, donor, onReload }) {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  if (!donor) return null;

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      await cancelDonationRegistration(donor.donationRegistrationId);
      await onReload?.();

      setSnackbarOpen(true); 
      onClose();
    } catch (error) {
      console.error('Lỗi khi hủy đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận hủy đơn đăng ký</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn hủy đơn đăng ký của <strong>{donor.donorFullName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleConfirmCancel} color="error" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận hủy'}
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Hủy đơn thành công!
        </Alert>
      </Snackbar>
       </>
  );
}
