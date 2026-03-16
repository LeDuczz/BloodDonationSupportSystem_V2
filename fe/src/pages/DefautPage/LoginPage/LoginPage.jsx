import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { login } from "../../../api/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { getCurrentUser } from "../../../api/userService";

import { loginGooleApi } from "../../../api/authService";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginGoogleError, setLoginGoogleError] = useState("");
  const { loadUser, user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoginError("");
    try {
      const res = await login(data);

      if (res.data != null) {
        await loadUser();
      }

      const userRes = await getCurrentUser();
      const role = userRes.data.role;

      if (role === "ROLE_MEMBER") navigate("/");
      else if (role === "ROLE_STAFF") navigate("/staff");
      else if (role === "ROLE_ADMIN") navigate("/admin");
      else navigate("/");

    } catch (error) {
      const serverMessage = error.response?.data?.message;

      if (serverMessage === "Incorrect username or password!!!") {
        setLoginError("Số điện thoại hoặc mật khẩu sai!");
      } else if (serverMessage === "Account is locked or inactive!"){
        setLoginError("Tài khoản bị khóa hoặc không hoạt động!");
      } else if (serverMessage === "PhoneNumber doesn't exist") {
        setLoginError("Số điện thoại không tồn tại!");
      }
      
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await loginGooleApi(credentialResponse);
      if (response.data.data) {
        const token = response.data.data;
        localStorage.setItem("token", token);
        await loadUser();
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setLoginError("Đăng nhập Google thất bại");
    }
  };
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "ROLE_ADMIN":
          navigate("/admin/overview");
          break;
        case "ROLE_STAFF":
          navigate("/staff/overview");
          break;
        case "ROLE_MEMBER":
        default:
          navigate("/");
          break;
      }
    }
  }, [user, navigate]);

  return (
    <Container
      component=""
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
        marginBottom: "100px",
      }}
    >
      <Paper elevation={10} sx={{ p: 4, mt: 8, borderRadius: "40px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            Chào mừng bạn quay trở lại
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Số điện thoại"
              name="phoneNumber"
              autoComplete="tel"
              autoFocus
              error={!!errors.account}
              helperText={errors.account?.message}
              {...register("phoneNumber", {
                required: "Số điện thoại là bắt buộc",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {loginError && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mt: 1 }}
              >
                {loginError}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container justifyContent="space-between">
              <Grid>
                <Link href="/reset-password" variant="body2">
                  Quên mật khẩu?
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }}>Hoặc tiếp tục với</Divider>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={(error) => {
                console.error("Google login error:", error);
                setLoginGoogleError("Đăng nhập Google thất bại");
              }}
              useOneTap
              flow="implicit"
            />
          </Box>

          {loginGoogleError && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {loginGoogleError}
            </Typography>
          )}
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid>
              <Typography variant="body2">
                Chưa có tài khoản?{" "}
                <Link href="/signup" variant="body2">
                  Đăng ký ngay
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
