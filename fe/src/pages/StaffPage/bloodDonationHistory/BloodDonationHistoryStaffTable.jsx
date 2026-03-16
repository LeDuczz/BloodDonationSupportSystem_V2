import React, { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import { getAllHistoryForStaffApi } from "../../../api/staffService";
function BloodDonationHistoryStaffTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [donationTypeFilter, setDonationTypeFilter] = useState("Tất cả");
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewDetail = (id) => {
    const record = rows.find((row) => row.donationRegistrationId === id);
    setSelectedRow(record);
  };

  const fetchData = async () => {
    try {
      const res = await getAllHistoryForStaffApi();
      return res.data.data;
    } catch (err) {
      showSnackbar("Lỗi khi tải dữ liệu lịch sử hiến máu", "error");
      return [];
    }
  };

  const loadAndSetData = async () => {
    const data = await fetchData();
    const mapped = data
      .map((row) => ({
        ...row,
        id: row.donationRegistrationId,
      }))
      .filter((row) => row.status === "ĐÃ HIẾN" || row.status === "HỦY");
    setRows(mapped);
    setFilteredRows(mapped);
  };

  useEffect(() => {
    loadAndSetData();
  }, []);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const inputMatch =
        row.phoneNumber?.includes(searchInput) ||
        row.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
        row.fullName?.toLowerCase().includes(searchInput.toLowerCase());

      const statusMatch =
        statusFilter === "Tất cả" ? true : row.status === statusFilter;

      const typeMatch =
        donationTypeFilter === "Tất cả"
          ? true
          : row.donationType === donationTypeFilter;

      return inputMatch && statusMatch && typeMatch;
    });

    setFilteredRows(filtered);
  }, [searchInput, statusFilter, donationTypeFilter, rows]);

  const columns = [
    {
      field: 'stt',
      headerName: 'STT',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const api = params.api;
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        const page = api.state.pagination.paginationModel.page;
        const pageSize = api.state.pagination.paginationModel.pageSize;
        return page * pageSize + rowIndex + 1;
      },
    },
    { field: "fullName", headerName: "Tên người hiến", width: 200,editable:false, filterable: false, },
    {
      field: "phoneNumber",
      headerName: "SĐT / Email",
      editable: false,
      filterable: false,
      width: 200,
      renderCell: (params) => params.row.email || params.row.phoneNumber || "",
    },
    {
      field: "dateCompleteDonation",
      headerName: "Ngày hiến",
      editable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => {
        const raw = params.row.donationDate;
        if (!raw || raw === "null") return "Chưa có";
        const date = new Date(raw);
        return isNaN(date.getTime())
          ? "Chưa có"
          : date.toLocaleDateString("vi-VN");
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      editable: false,
      filterable: false,
    },
    {
      field: "volumeMl",
      headerName: "Lượng máu (ml)",
      width: 130,
      editable: false,
      filterable: false,
    },
    {
      field: "addressHospital",
      headerName: "Địa điểm hiến",
      width: 180,
      editable: false,
      filterable: false,
      renderCell: () => "Trung tâm hiến máu",
    },
    {
      field: "donationType",
      headerName: "Loại hiến",
      width: 150,
      editable: false,
      filterable: false,
    },
    {
      field: "donationRegistrationId",
      headerName: "Chi tiết",
      width: 120,
      editable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            handleViewDetail(params.value);
          }}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#1976d2",
              opacity: 0.5,
            },
          }}
        >
          Xem thêm
        </Button>
      ),
    },
  ];

  const vietnameseText = {
    columnMenuSortAsc: "Sắp xếp tăng dần",
    columnMenuSortDesc: "Sắp xếp giảm dần",
    columnMenuFilter: "Lọc",
    columnMenuHideColumn: "Ẩn cột",
    columnMenuManageColumns: "Quản lý cột",
    noRowsLabel: "Không có dữ liệu",
    loadingOverlayLabel: "Đang tải...",
    toolbarColumns: "Cột",
    toolbarFilters: "Bộ lọc",
    toolbarExport: "Xuất",
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Lịch sử hiến máu</Typography>
        </Toolbar>
      </AppBar>

      <Paper sx={{ p: 2, m: 2 }} elevation={2}>
        <Grid container spacing={2}>
          <Grid item md={6} lg={4}>
            <Typography variant="subtitle2">Tìm kiếm thông tin</Typography>
            <TextField
              placeholder="Tìm theo sđt,email,tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="small"
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid item md={6} lg={3}>
            <Typography variant="subtitle2">Trạng thái</Typography>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="ĐÃ HIẾN">Đã hiến</MenuItem>
              <MenuItem value="HỦY">Đã hủy</MenuItem>
            </Select>
          </Grid>

          <Grid item md={6} lg={3}>
            <Typography variant="subtitle2">Loại hiến</Typography>
            <Select
              fullWidth
              size="small"
              value={donationTypeFilter}
              onChange={(e) => setDonationTypeFilter(e.target.value)}
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="BÌNH THƯỜNG">Bình thường</MenuItem>
              <MenuItem value="KHẨN CẤP">Khẩn cấp</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ width: "100%", px: 2 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          localeText={vietnameseText}
          pagination
          disableColumnSelector
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 9 } },
          }}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>

      {selectedRow && (
        <Dialog
          open={true}
          onClose={() => setSelectedRow(null)}
          sx={{ "& .MuiDialog-paper": { width: "500px" } }}
        >
          <DialogTitle>Chi tiết hiến máu</DialogTitle>
          <DialogContent dividers>
            <Typography>
              <strong>Tên:</strong> {selectedRow.fullName}
            </Typography>
            <Typography>
              <strong>SĐT:</strong> {selectedRow.phoneNumber}
            </Typography>
            <Typography>
              <strong>Ngày đăng ký:</strong>{" "}
              {selectedRow.registrationDate
                ? new Date(selectedRow.registrationDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa có"}
            </Typography>
            <Typography>
              <strong>Ngày hiến:</strong>{" "}
              {selectedRow.donationDate
                ? new Date(selectedRow.donationDate).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </Typography>
            <Typography>
              <strong>Địa điểm:</strong> Trung tâm hiến máu
            </Typography>
            {selectedRow.donationType !== "KHẨN CẤP" && (
              <>
                <Typography>
                  <strong>Giờ bắt đầu:</strong>{" "}
                  {selectedRow.scheduleStartTime || "Chưa có"}
                </Typography>
                <Typography>
                  <strong>Giờ kết thúc:</strong>{" "}
                  {selectedRow.scheduleEndTime || "Chưa có"}
                </Typography>
              </>
            )}
            <Typography>
              <strong>Lượng máu (ml):</strong>{" "}
              {selectedRow.volumeMl || "Chưa có"}
            </Typography>
            <Typography>
              <strong>Loại hiến:</strong> {selectedRow.donationType}
            </Typography>
            <Typography>
              <strong>Trạng thái:</strong> {selectedRow.status}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRow(null)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default BloodDonationHistoryStaffTable;
