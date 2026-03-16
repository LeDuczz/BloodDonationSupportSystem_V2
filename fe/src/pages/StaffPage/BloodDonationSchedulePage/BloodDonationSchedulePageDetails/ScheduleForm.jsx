import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { dayjsToLocalTimeObject } from "../../../../utils/dayFormat";

export default function ScheduleForm({
  selectedDate,
  form,
  setForm,
  inputCapacity,
  existingTotal,
  handleCreateSchedule,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleSubmit = async () => {
    if (!form.addressHospital || !form.startTime || !form.endTime) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập đầy đủ địa chỉ và thời gian.",
        severity: "error",
      });
      return;
    }

    if (
      form.amountRegistration <= inputCapacity ||
      form.amountRegistration <= existingTotal
    ) {
      setSnackbar({
        open: true,
        message: `Số lượng tối đa phải lớn hơn ${
          inputCapacity > existingTotal ? inputCapacity : existingTotal
        }.`,
        severity: "error",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        startTime: dayjsToLocalTimeObject(form.startTime),
        endTime: dayjsToLocalTimeObject(form.endTime),
      };
      await handleCreateSchedule(payload);

      setSnackbar({
        open: true,
        message: "Tạo lịch hiến máu thành công!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi tạo lịch." + err,
        severity: "error",
      });
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Tạo lịch hiến máu với ngày:{" "}
        {new Date(selectedDate).toLocaleDateString("vi-VN")}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        gap={2}
      >
        <TextField
          label="Địa chỉ bệnh viện"
          fullWidth
          value={form.addressHospital}
          onChange={(e) =>
            setForm({ ...form, addressHospital: e.target.value })
          }
        />

        <TimeField
          label="Giờ bắt đầu"
          value={form.startTime}
          onChange={(value) => setForm({ ...form, startTime: value })}
          format="HH:mm"
          fullWidth
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: "",
            },
          }}
        />

        <TimeField
          label="Giờ kết thúc"
          value={form.endTime}
          onChange={(value) => setForm({ ...form, endTime: value })}
          format="HH:mm"
          fullWidth
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: "",
            },
          }}
        />

        <TextField
          label="Số lượng tối đa"
          type="number"
          fullWidth
          value={form.amountRegistration < 0 ? "" : form.amountRegistration}
          onChange={(e) => {
            const val = Number(e.target.value);
            setForm({ ...form, amountRegistration: val });
          }}
        />
      </Box>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Tạo Lịch
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
