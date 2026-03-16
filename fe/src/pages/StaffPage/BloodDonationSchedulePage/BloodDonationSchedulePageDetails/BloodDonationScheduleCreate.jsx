import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import { 
  isBefore, 
  isAfter, 
  addDays, 
  startOfToday,
  isSameDay
 } from "date-fns";
import { createSchedule } from "../../../../api/bloodDonationSchedule";
import dayjs from "dayjs";

const BloodDonationScheduleCreate = ( {onClose} ) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
  } = useForm();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const addSchedule = async (data) => {

    try {
      const res = await createSchedule(data);
      if (res.status === 200) {
        setSnackbar({
          open: true,
          message: "Tạo lịch thành công",
          severity: "success",
        });
        reset();
        if (onClose) onClose();

      }
    } catch (err) {
      console.log("Data submitted:", err.response?.data.message);
      if (
        err.response?.status === 404 &&
        err.response?.data.message === "Schedule already exists"
      ) {
        setSnackbar({
          open: true,
          message: "Lịch đã tồn tại",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Đã xảy ra lỗi khi tạo lịch. Vui lòng thử lại sau.",
          severity: "error",
        });
      }
    }
  };

  const onSubmit = (data) => {
    const today = startOfToday();
    const maxAllowedDate = addDays(today, 90);
    const date = data.operatingDate;
    const now = new Date();

    // validate ngày hoạt động
    if (!date) {
      setError("operatingDate", {
        type: "manual",
        message: "Ngày hoạt động là bắt buộc",
      });
      return;
    }

    if (isBefore(date, today)) {
      setError("operatingDate", {
        type: "manual",
        message: "Ngày hoạt động không được là ngày trong quá khứ",
      });
      return;
    }

    if (isAfter(date, maxAllowedDate)) {
      setError("operatingDate", {
        type: "manual",
        message: "Ngày hoạt động không được quá 90 ngày kể từ hôm nay",
      });
      return;
    }

    if (!data.startTime) {
      setError("startTime", {
        type: "manual",
        message: "Giờ bắt đầu là bắt buộc",
      });
      return;
    }

    if (!data.endTime) {
      setError("endTime", {
        type: "manual",
        message: "Giờ kết thúc là bắt buộc",
      });
      return;
    }

    const startTime = dayjs(data.startTime);
    const endTime = dayjs(data.endTime);

    if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
      setError("endTime", {
        type: "manual",
        message: "Giờ kết thúc phải sau giờ bắt đầu",
      });
      return;
    }

    if (isSameDay(date, now)) {
      const currentTime = dayjs();
      
      if (startTime.isBefore(currentTime)) {
        setError("startTime", {
          type: "manual",
          message: "Giờ bắt đầu không được là thời gian trong quá khứ",
        });
        return;
      }

      if (endTime.isBefore(currentTime)) {
        setError("endTime", {
          type: "manual",
          message: "Giờ kết thúc không được là thời gian trong quá khứ",
        });
        return;
      }
    }

    if (data.capcity <= 0) {
      setError("capcity", {
        type: "manual",
        message: "Số lượng phải lớn hơn 0",
      });
      return;
    }
    const parseTime = (timeObj) => {
      if (!timeObj) return null;
      return dayjs(timeObj).format("HH:mm:ss");
    };

    const formattedData = {
      addressHospital: data.address,
      donationDate: dayjs(data.operatingDate).format('YYYY-MM-DD'),
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
      amountRegistration: parseInt(data.capcity),
    };

    addSchedule(formattedData);

  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Tạo Sự Kiện Hiến Máu
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Địa chỉ bệnh viện"
              fullWidth
              margin="normal"
              {...register("address", { required: "Địa chỉ là bắt buộc" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Controller
              name="operatingDate"
              control={control}
              defaultValue={null}
              rules={{ required: "Ngày hoạt động là bắt buộc" }}
              render={({ field }) => (
                <DatePicker
                  label="Ngày hoạt động"
                  value={field.value}
                  onChange={field.onChange}
                  shouldDisableDate={(date) =>
                    isBefore(date, startOfToday()) ||
                    isAfter(date, addDays(startOfToday(), 90))
                  }
                  sx={{ marginTop: "10px" }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      error: !!errors.operatingDate,
                      helperText: errors.operatingDate?.message,
                    },
                  }}
                />
              )}
            />

            <Box display="flex" gap={2} marginTop={2}>
              <Controller
                name="startTime"
                control={control}
                defaultValue={null}
                rules={{ required: "Giờ bắt đầu là bắt buộc" }}
                render={({ field }) => (
                  <TimeField
                    label="Giờ bắt đầu"
                    value={field.value}
                    onChange={field.onChange}
                    format="HH:mm"
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                )}
              />

              <Controller
                name="endTime"
                control={control}
                defaultValue={null}
                rules={{ required: "Giờ kết thúc là bắt buộc" }}
                render={({ field }) => (
                  <TimeField
                    label="Giờ kết thúc"
                    value={field.value}
                    onChange={field.onChange}
                    format="HH:mm"
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                )}
              />
            </Box>

            <TextField
              label="Số lượng tối đa"
              fullWidth
              type="number"
              margin="normal"
              {...register("capcity", {
                required: "Bắt buộc",
                min: {
                  value: 1,
                  message: "Phải lớn hơn 0",
                },
              })}
              error={!!errors.capcity}
              helperText={errors.capcity?.message}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Tạo Sự Kiện
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default BloodDonationScheduleCreate;
