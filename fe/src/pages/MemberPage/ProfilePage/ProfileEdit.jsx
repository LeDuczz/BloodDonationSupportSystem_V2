import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const genders = ["Nam", "Nữ", "Khác"];

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...user,
    gender: user.gender || "NAM",
  });
  const [errors, setErrors] = useState({});
  const [dateError, setDateError] = useState("");
  const [tempDateValue, setTempDateValue] = useState(
    getValidDate(user.dayOfBirth)
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatarUrl
      ? `${import.meta.env.VITE_AVATAR_BASE_URL}/images/uploads/${
          user.avatarUrl
        }`
      : undefined
  );

  function getValidDate(dateStr) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (newDate) => {
    setTempDateValue(newDate);

    if (!newDate || isNaN(newDate.getTime())) {
      setFormData((prev) => ({ ...prev, dayOfBirth: "" }));
      setDateError("Ngày sinh không hợp lệ");
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newDate > today) {
      setDateError("Ngày sinh không được lớn hơn ngày hiện tại");
      return;
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 150);

    if (newDate < minDate) {
      setDateError("Ngày sinh không hợp lệ");
      return;
    }

    const age = today.getFullYear() - newDate.getFullYear();
    const m = today.getMonth() - newDate.getMonth();
    const d = today.getDate() - newDate.getDate();
    const exactAge = m < 0 || (m === 0 && d < 0) ? age - 1 : age;

    if (exactAge < 18) {
      setDateError("Bạn phải đủ 18 tuổi để đăng ký hiến máu");
      return;
    }

    if (exactAge > 60) {
      setDateError("Bạn phải dưới 60 tuổi để đăng ký hiến máu");
      return;
    }

    setDateError("");
    setFormData((prev) => ({
      ...prev,
      dayOfBirth: newDate.toISOString().split("T")[0],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!formData.dayOfBirth || formData.dayOfBirth.trim() === "") {
      newErrors.dayOfBirth = "Ngày sinh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !dateError;
  };

  const handleSave = () => {
    if (validate()) {
      // Trả cả profile + file về ProfilePage
      onSave(formData, file);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700}>
            Chỉnh sửa thông tin cá nhân
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Quản lý thông tin cá nhân của bạn
          </Typography>
        </Box>
      </Paper>

      {/* Body */}
      <Paper sx={{ p: 5 }}>
        <Stack spacing={2}>
          {/* Avatar upload */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={preview}
              sx={{ width: 100, height: 100, border: "2px solid #ccc" }}
            />
            <label htmlFor="avatar-upload">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
              />
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          {/* Full name */}
          <TextField
            fullWidth
            label="Họ và tên"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          {/* Phone or email */}
          {formData.phoneNumber ? (
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              InputProps={{ readOnly: true }}
            />
          ) : (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || ""}
              InputProps={{ readOnly: true }}
            />
          )}

          {/* Address */}
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />

          {/* Gender */}
          <TextField
            select
            fullWidth
            label="Giới tính"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
          >
            {genders.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>

          {/* Date of birth */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Ngày sinh"
              value={tempDateValue}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!dateError || !!errors.dayOfBirth,
                  helperText: dateError || errors.dayOfBirth,
                },
              }}
            />
          </LocalizationProvider>

          {/* Blood type */}
          <TextField
            fullWidth
            label="Nhóm máu"
            name="bloodType"
            value={formData.bloodType || "Chưa cập nhật"}
            InputProps={{ readOnly: true }}
          />

          {/* Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button variant="outlined" size="large" onClick={onCancel}>
              Hủy
            </Button>
            <Button variant="contained" size="large" onClick={handleSave}>
              Lưu
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;
