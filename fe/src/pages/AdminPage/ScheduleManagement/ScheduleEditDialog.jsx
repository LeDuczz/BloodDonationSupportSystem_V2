import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  Typography,
} from "@mui/material";

import { TimeField } from "@mui/x-date-pickers/TimeField";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { formatTimeToStringFunc } from "../../../utils/dayFormat";


export default function ScheduleEditDialog({ open, onClose, onSubmit, schedule }) {
  const [formData, setFormData] = useState({
    addressHospital: "",
    amountRegistration: 0,
    startTime: null,
    endTime: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ hộp thoại xác nhận

  useEffect(() => {
    if (schedule) {
      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [hour, minute, second = 0] = timeStr.split(":").map(Number);
        return dayjs().hour(hour).minute(minute).second(second);
      };

      setFormData({
        addressHospital: schedule.addressHospital || "",
        amountRegistration: schedule.amountRegistration || 0,
        startTime: parseTime(schedule.startTime),
        endTime: parseTime(schedule.endTime),
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidateAndOpenConfirm = () => {
    if (!formData.addressHospital || !formData.startTime || !formData.endTime) {
      setError("❌ Vui lòng nhập đầy đủ thông tin.");
      setSuccess(false);
      return;
    }

    if (formData.amountRegistration <= 0) {
      setError("❌ Số lượng tối đa phải lớn hơn 0.");
      setSuccess(false);
      return;
    }

    setError("");
    setConfirmOpen(true); 
  };

  const handleConfirmUpdate = () => {
    setSuccess(true);
    setConfirmOpen(false); 
    onSubmit({
      ...schedule,
      addressHospital: formData.addressHospital,
      amountRegistration: parseInt(formData.amountRegistration),
      startTime: formatTimeToStringFunc(formData.startTime),
      endTime: formatTimeToStringFunc(formData.endTime),
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Cập nhật lịch hiến máu</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>✅ Cập nhật thành công!</Alert>}

          <TextField
            label="Địa chỉ bệnh viện"
            name="addressHospital"
            fullWidth
            margin="normal"
            value={formData.addressHospital}
            onChange={handleChange}
          />

          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TimeField
                label="Giờ bắt đầu"
                value={formData.startTime}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, startTime: value }))
                }
                format="HH:mm"
                fullWidth
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: "",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimeField
                label="Giờ kết thúc"
                value={formData.endTime}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, endTime: value }))
                }
                format="HH:mm"
                fullWidth
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: "",
                  },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Số lượng tối đa"
            name="amountRegistration"
            type="number"
            fullWidth
            margin="normal"
            value={formData.amountRegistration}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleValidateAndOpenConfirm} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Dialog xác nhận cập nhật */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận cập nhật</DialogTitle>
        <DialogContent>
          <Typography>
            🩸 Bạn có chắc chắn muốn cập nhật lịch hiến máu này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
