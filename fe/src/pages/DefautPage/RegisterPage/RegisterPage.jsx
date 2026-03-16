import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { registerAccount } from "../../../api/authService";
import { stringifyLocalDate } from "../../../utils/dayFormat";
import vi from "date-fns/locale/vi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
    setError
  } = useForm();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const info = {
        ...data,
        dateOfBirth: JSON.parse(stringifyLocalDate(data.dateOfBirth)),
        status: "HOẠT ĐỘNG",
      };
      const response = await registerAccount(info);
      if (response.status === 200) {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      const serverMessage = err;

      if (serverMessage === "Phone number already in use") {
        setError("phoneNumber", {
          type: "server",
          message: 'Số điện thoại đã tồn tại',
        });
      } else {
        console.error(err);
      }

    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Toolbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, p: 5, boxShadow: 6, borderRadius: 4, bgcolor: "white", border: '1px solid #e0e0e0' }}>
          <Typography variant="h4" align="center" fontWeight="700" gutterBottom color="primary.main">
            Đăng ký tài khoản
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }} fontWeight="600">
              Thông tin tài khoản
            </Typography>

            <TextField
              fullWidth
              label="Số điện thoại"
              margin="dense"
              {...register("phoneNumber", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="dense"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              margin="dense"
              {...register("confirmPassword", {
                required: "Vui lòng nhập lại mật khẩu",
                validate: (value) => value === password || "Mật khẩu xác nhận không khớp",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }} fontWeight="600">
              Thông tin người dùng
            </Typography>

            <TextField
              fullWidth
              label="Họ và tên"
              margin="dense"
              {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            <FormControl fullWidth margin="dense" error={!!errors.gender}>
              <InputLabel id="gender-label">Giới tính</InputLabel>
              <Select
                labelId="gender-label"
                label="Giới tính"
                defaultValue=""
                {...register("gender", { required: "Vui lòng chọn giới tính" })}
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
              {errors.gender && (
                <Typography variant="caption" color="error">
                  {errors.gender.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name="dateOfBirth"
              control={control}
              rules={{
                required: "Vui lòng chọn ngày sinh",
                validate: (value) => {
                  if (!value) return "Vui lòng chọn ngày sinh";
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  const d = today.getDate() - birthDate.getDate();
                  const exactAge = m < 0 || (m === 0 && d < 0) ? age - 1 : age;
                  if (exactAge < 18) return "Bạn phải đủ 18 tuổi để đăng ký hiến máu";
                  if (exactAge > 60) return "Bạn phải dưới 60 tuổi để đăng ký hiến máu";
                  return true;
                },
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                    label="Ngày sinh"
                    value={field.value || null}
                    format="dd/MM/yyyy"
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        error: !!errors.dateOfBirth,
                        helperText: errors.dateOfBirth?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <TextField
              fullWidth
              label="Địa chỉ"
              margin="dense"
              {...register("address", { required: "Vui lòng nhập địa chỉ" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, fontWeight: 600, py: 1.5, fontSize: 16 }}
            >
              Đăng ký
            </Button>
          </form>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Đăng ký thành công! Đang chuyển hướng...
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RegisterPage;
