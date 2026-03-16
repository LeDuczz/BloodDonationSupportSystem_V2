import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const ProfileView = ({ user, onEdit }) => {
  const theme = useTheme();

  const avatarUrl = user?.avatarUrl
    ? `${import.meta.env.VITE_AVATAR_BASE_URL}/images/uploads/${user.avatarUrl}`
    : undefined;

  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const words = fullName.split(" ");
    return words.length >= 2
      ? words[0][0] + words[words.length - 1][0]
      : fullName[0];
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Thông tin tài khoản
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              opacity: 0.9,
            }}
          >
            Quản lý thông tin cá nhân của bạn
          </Typography>
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", height: "auto", m: "auto", padding: 5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={avatarUrl}
              sx={{
                bgcolor: !user.avatarUrl ? "primary.main" : "transparent",
                width: 70,
                height: 70,
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {!user.avatarUrl && getInitials(user.fullName)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user.fullName || "Người dùng"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phoneNumber
                  ? user.phoneNumber
                  : user.email || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Typography>
            <strong>Địa chỉ:</strong>{" "}
            <Typography
              component="span"
              sx={{
                color: user.address ? "text.primary" : "text.secondary",
                fontStyle: user.address ? "normal" : "italic",
              }}
            >
              {user.address || "Chưa cập nhật địa chỉ"}
            </Typography>
          </Typography>

          <Typography>
            <strong>Giới tính:</strong>{" "}
            <Typography
              component="span"
              sx={{
                color: user.gender ? "text.primary" : "text.secondary",
                fontStyle: user.gender ? "normal" : "italic",
              }}
            >
              {user.gender || "Chưa cập nhật"}
            </Typography>
          </Typography>

          <Typography>
            <strong>Ngày sinh:</strong>{" "}
            <Typography
              component="span"
              sx={{
                color: user.dayOfBirth ? "text.primary" : "text.secondary",
                fontStyle: user.dayOfBirth ? "normal" : "italic",
              }}
            >
              {user.dayOfBirth
                ? new Date(user.dayOfBirth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </Typography>
          </Typography>

          <Typography>
            <strong>Nhóm máu:</strong>{" "}
            <Typography
              component="span"
              sx={{
                color: user.bloodType ? "text.primary" : "text.secondary",
                fontStyle: user.bloodType ? "normal" : "italic",
              }}
            >
              {user.bloodType || "Chưa cập nhật"}
            </Typography>
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
              }}
            >
              Chỉnh sửa thông tin
            </Button>
          </Box>
        </Stack>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label="Tài khoản đã xác thực"
            color="success"
            variant="outlined"
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileView;
