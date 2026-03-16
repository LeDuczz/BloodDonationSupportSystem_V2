import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Select,
  MenuItem,
  Tooltip
} from "@mui/material";

import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Bloodtype as BloodIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const STATUS_OPTIONS = ["HOẠT ĐỘNG", "BỊ CẤM", "VÔ HIỆU HÓA"];

const STATUS_OPTIONS_Role = ["ROLE_STAFF", "ROLE_MEMBER"];

const STATUS_COLORS = {
  "HOẠT ĐỘNG": { color: "success", bgColor: "#e8f5e8" },
  "BỊ CẤM": { color: "error", bgColor: "#ffebee" },
  "VÔ HIỆU HÓA": { color: "warning", bgColor: "#fff3e0" },
};

const ROLE_COLORS = {
  "ROLE_ADMIN": { color: "error", label: "Quản trị viên", bgColor: "#fdecea" },
  "ROLE_STAFF": { color: "primary", label: "Nhân viên", bgColor: "#e3f2fd" },
  "ROLE_MEMBER": { color: "success", label: "Thành viên", bgColor: "#e8f5e9" },
};

const getInitials = (fullName) => {
  if (!fullName) return "?";
  const words = fullName.split(" ");
  return words.length >= 2 ? words[0][0] + words[words.length - 1][0] : fullName[0];
};

const UserDataGrid = ({ users, loading, onStatusChange }) => {
  const columns = [
    {
      field: "user",
      headerName: "Người dùng",
      flex: 0.8,
      renderCell: (params) => {
        const { fullName, phoneNumber } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            <Avatar
              sx={{ bgcolor: "primary.main", width: 40, height: 40, fontSize: "0.9rem", fontWeight: "bold" }}
            >
              {getInitials(fullName)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{fullName || "Không có tên"}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{phoneNumber || "Chưa có SĐT"}</Typography>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "personalInfo",
      headerName: "Thông tin cá nhân",
      flex: 0.6,
      renderCell: (params) => {
        const { gender, dayOfBirth, bloodType } = params.row;
        const formattedDate = dayOfBirth ? new Date(dayOfBirth).toLocaleDateString("vi-VN") : "Chưa có";
        return (
          <Box sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption">{gender || "Chưa xác định"}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption">{formattedDate}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BloodIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption">{bloodType || "Chưa có"}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 0.6,
      renderCell: (params) => {
        const {id, role} = params.row;
        const roleConfig = ROLE_COLORS[role] || { color: "default", bgColor: "#f5f5f5" };
        return (
          <Select
            value={role}
            renderValue={(value) => ROLE_COLORS[value]?.label ?? "Không xác định"}
            onChange={(e) => onStatusChange(id, null, e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              backgroundColor: roleConfig.bgColor,
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          >
            {STATUS_OPTIONS_Role.map((option) => (
              <MenuItem key={option} value={option}>
                <Chip
                  label={ROLE_COLORS[option]?.label || option}
                  color={ROLE_COLORS[option]?.color || "default"}
                  size="small"
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 2,
      renderCell: (params) => {
        const address = params.row.address;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Tooltip title={address || "Chưa có địa chỉ"}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: "700px",
                }}
              >
                {address || "Chưa có địa chỉ"}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 0.6,
      renderCell: (params) => {
        const { id, status } = params.row;
        const statusConfig = STATUS_COLORS[status] || { color: "default", bgColor: "#f5f5f5" };
        return (
          <Select
            value={STATUS_OPTIONS.includes(status) ? status : ""}
            onChange={(e) => onStatusChange(id, e.target.value, null)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              backgroundColor: statusConfig.bgColor,
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                <Chip
                  label={option}
                  color={STATUS_COLORS[option]?.color || "default"}
                  size="small"
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  return (
    <Paper
      sx={{
        width: "100%",
        overflowX: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: 3,
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        disableColumnMenu
        rowHeight={80}
        sx={{
          border: 0,
          "& .MuiTablePagination-selectLabel": {
            display: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f8fafc",
            color: "#1e293b",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderBottom: "1px solid #e2e8f0",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "#f1f5f9",
            },
            "&:nth-of-type(even)": {
              backgroundColor: "#fafbfc",
            },
            borderBottom: "1px solid #f1f5f9",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
          },
        }}
      />
    </Paper>
  );
};

export default UserDataGrid;
