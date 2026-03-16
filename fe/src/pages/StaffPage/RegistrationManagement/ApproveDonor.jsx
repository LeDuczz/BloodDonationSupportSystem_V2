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
import { approveDonationRegistration } from '../../../api/donationRegistration'; 
export default function ApproveDonor({ open, onClose, donor, onReload }) {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (!donor) return null;

  const handleConfirmApprove = async () => {
    setLoading(true);
    try {
      await approveDonationRegistration(donor.donationRegistrationId);
      await onReload?.();

      setSnackbarOpen(true);  
      setTimeout(() => {
        onClose();
      }, 1000);
                 
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  

  

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xác nhận duyệt đơn đăng ký</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn <strong>duyệt đơn</strong> của <strong>{donor.donorFullName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleConfirmApprove} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận duyệt'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Duyệt đơn thành công!
        </Alert>
      </Snackbar>
    </>
  );
}
