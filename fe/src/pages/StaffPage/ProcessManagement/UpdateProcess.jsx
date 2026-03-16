import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { updateDonationProcessApi } from '../../../api/donationProcess';

export default function UpdateProcess({ isOpen, onClose, donor, onSave, onDonorChange }) {
  if (!donor) return null;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); 

  const handleConfirmSave = () => {
    if (donor.processStatus === "ĐÃ HIẾN") {
      if (!donor.volumeMl || Number(donor.volumeMl) <= 0) {
        setErrorMessage('Vui lòng nhập lượng máu đã hiến (ml) hợp lệ.');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }
    }
    setOpenConfirm(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        donationProcessId: donor.donationProcessId,
        processStatus: donor.processStatus,
        volumeMl: Number(donor.volumeMl) || 0,
        donationRegistrationId: donor.donationRegistrationId,
      };

      await updateDonationProcessApi(payload);

      onSave?.();
      setErrorMessage('');
      setSnackbarType('success');
      setSnackbarOpen(true);
      setOpenConfirm(false);
    } catch (error) {
      console.error('Lỗi cập nhật tiến trình:', error);
      setErrorMessage('Đã xảy ra lỗi khi lưu thay đổi. Vui lòng điền đúng thông tin.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const isDisabledByProcess = donor.processStatus !== "ĐÃ HIẾN";

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Cập nhật thông tin hiến máu</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} width={415}>
              <Typography fontWeight="bold" fontSize={14} gutterBottom>
                Họ tên
              </Typography>
              <TextField
                value={donor.donorFullName}
                fullWidth
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} width={415}>
              <Typography fontWeight="bold" fontSize={14} gutterBottom>
                Ngày đăng ký
              </Typography>
              <TextField
                value={new Date(donor.registrationDate).toLocaleDateString('vi-VN')}
                fullWidth
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6} mt={2} width={415}>
              <Typography fontWeight="bold" fontSize={14} gutterBottom>
                Trạng thái tiến trình
              </Typography>
              <TextField
                select
                value={donor.processStatus}
                onChange={(e) => onDonorChange({ ...donor, processStatus: e.target.value })}
                fullWidth
              >
                <MenuItem value="ĐANG XỬ LÝ">Đang xử lý</MenuItem>
                <MenuItem value="ĐÃ HIẾN">Đã hiến</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} mt={2} width={415}>
              <Typography fontWeight="bold" fontSize={14} gutterBottom>
                Lượng máu hiến tặng
              </Typography>
              <TextField
                type="number"
                label="ml"
                value={donor.volumeMl}
                inputProps={{ min: 0 }}
                fullWidth
                required
                disabled={isDisabledByProcess}
                onChange={(e) => onDonorChange({ ...donor, volumeMl: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmSave} variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn lưu các thay đổi?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => {
          setSnackbarOpen(false);
          if (snackbarType === 'success') onClose();
          setErrorMessage('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
            setErrorMessage('');
          }}
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarType === 'error'
            ? errorMessage || 'Có lỗi xảy ra. Vui lòng kiểm tra lại.'
            : 'Cập nhật thành công!'}
        </Alert>
      </Snackbar>
    </>
  );
}
