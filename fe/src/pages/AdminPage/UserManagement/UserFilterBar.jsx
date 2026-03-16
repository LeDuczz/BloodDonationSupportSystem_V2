import React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider
} from "@mui/material";
import { FilterList as FilterIcon, Search as SearchIcon } from "@mui/icons-material";

const UserFilterBar = ({ roleFilter, onRoleChange, searchText, onSearchChange, count }) => (
  <>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <FilterIcon sx={{ color: "primary.main" }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Bộ lọc & Tìm kiếm
      </Typography>
    </Box>
    <Divider sx={{ mb: 2 }} />
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
      }}
    >
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="role-filter-label">Loại tài khoản</InputLabel>
        <Select
          labelId="role-filter-label"
          value={roleFilter}
          label="Loại tài khoản"
          onChange={onRoleChange}
          size="small"
        >
          <MenuItem value="all">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Tất cả
            </Typography>
          </MenuItem>
          
          <MenuItem value="ROLE_MEMBER">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Thành viên
            </Typography>
          </MenuItem>

          <MenuItem value="ROLE_STAFF">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Nhân viên
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Tìm kiếm theo tên hoặc SĐT"
        variant="outlined"
        value={searchText}
        onChange={onSearchChange}
        size="small"
        sx={{ width: 350 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ ml: "auto" }}>
        <Chip
          label={`${count} người dùng`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    </Box>
  </>
);

export default UserFilterBar;