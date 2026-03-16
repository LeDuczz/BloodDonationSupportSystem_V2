import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import {
  Box,
  Slider,
  Button,
  Typography,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { searchDonorsApi, sendInviteApi ,sendInviteSmSApi} from "../../../api/staffService";
import { useForm } from "react-hook-form";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const bloodTypes = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];
const vietnameseText = {
  columnMenuSortAsc: "Sắp xếp tăng dần",
  columnMenuSortDesc: "Sắp xếp giảm dần",
  columnMenuFilter: "Lọc",
  columnMenuHideColumn: "Ẩn cột",
  columnMenuManageColumns: "Quản lý cột",
  noRowsLabel: "Bắt đầu tìm kiếm - Tìm kiếm trên nhóm máu và khoảng cách",
  loadingOverlayLabel: "Đang tải...",
  toolbarColumns: "Cột",
  toolbarFilters: "Bộ lọc",
  toolbarExport: "Xuất",
};


const DistanceSearchWithDataGrid = () => {
  const [filters, setFilters] = useState({ distance: 10, bloodTypes: [] });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customError, setCustomError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleInviteDonation = async (donorName,bloodType ,contact) => {
    try {
    
      const res = await sendInviteApi(donorName,bloodType ,contact);
      if (res.data.data.includes("successfully")) {
        showSnackbar(`Đã gửi lời mời đến ${donorName}`, "success");
      }
    } catch (error) {
      showSnackbar("Có lỗi khi gửi lời mời.", "error");
    }
  };
  const handleInviteDonationSms = async (bloodType, contact) => {
    try {
      const res = await sendInviteSmSApi(bloodType, contact);
      if (res.data.message.includes("successfully")) {
        showSnackbar(`Đã gửi lời mời đến ${contact}`, "success");
      }
    } catch (error) {
      showSnackbar("Có lỗi khi gửi lời mời.", "error");
    }
  };


  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    setCustomError("");

    if (filters.bloodTypes.length === 0) {
      setCustomError("Vui lòng chọn ít nhất một nhóm máu.");
      return;
    }

    setLoading(true);
    try {
      const response = await searchDonorsApi(filters);

      const dataWithIds = response.data.data.map((item, index) => ({
        id: index + 1,
        stt: index + 1,
        ...item,
      }));

      setResults(dataWithIds);
    } catch (error) {
      showSnackbar("Không thể tìm kiếm. Vui lòng thử lại sau." + error,"error");
    } finally {
      setLoading(true);
    }
  };

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "donorName",
      headerName: "Họ tên",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    { field: "bloodType", headerName: "Nhóm máu", flex: 1,   sortable:false,
    disableColumnMenu: true,  },
    { field: "lastDonationDate", headerName: "Lần hiến gần nhất", flex: 1,   sortable:false,
    disableColumnMenu: true, renderCell: (params) => {
      const getDate = params.value;
      const date = new Date(getDate);
      return date.toLocaleDateString("vi-VN");
      },
    },
    {
      field: "contact",
      headerName: "Thông tin liên hệ",
      flex: 1.25,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "Gửi lời mời",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const isEmail = params.row.contact.includes("@");
        const contact = params.row.contact;
        const bloodType= params.row.bloodType;
        const donorName = params.row.donorName;
        return (
          <Box sx={{ width: "100%" }}>
            {isEmail ? (
              <Button
                variant="contained"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleInviteDonation(donorName,bloodType, contact);
                }}
                sx={{
                  backgroundColor: "#f9a825",
                  color: "#fff",
                  minWidth: 100,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f57f17",
                  },
                }}
              >
                Gửi Email
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleInviteDonationSms(bloodType, contact);
                }}
                sx={{
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  minWidth: 100,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#1b5e20",
                  },
                }}
              >
                Gửi SMS
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ width:"100%", mx: "auto", background: "white" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ border: "1px solid #ccc", borderRadius: 2, p: 3 }}
      >
        <Typography variant="h6" sx={{mb:1}}><LocationOnIcon sx={{color: "#4949ff"}}/>Tìm kiếm người  hiến máu theo khoảng cách</Typography>
     
        <Typography gutterBottom>Khoảng cách tìm kiếm (km)</Typography>
        <Slider
          value={filters.distance}
          onChange={(e, val) => setFilters({ ...filters, distance: val })}
          min={1}
          max={50}
          step={1}
          valueLabelDisplay="auto"
          marks={[
            { value: 1, label: "1km" },
            { value: 25, label: "25km" },
            { value: 50, label: "50km" },
          ]}
        />

      

        <Typography gutterBottom sx={{ mt: 1 }}>
          Nhóm máu cần tìm kiếm
        </Typography>
        <ToggleButtonGroup
          value={filters.bloodTypes}
          onChange={(e, newTypes) =>
            setFilters({ ...filters, bloodTypes: newTypes })
          }
          aria-label="blood types"
          color="white"
          sx={{ flexWrap: "no-wrap" }}
        >
          {bloodTypes.map((type) => (
            <ToggleButton
              key={type.value}
              value={type.value}
              sx={{
                m: 0.5,
                width: 115,
                height: 36,
                color: "black",
                flex:1,
                backgroundColor: filters.bloodTypes.includes(type.value)
                  ? "#ccc"
                  : "white",
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#fa0001",
                },
                "&:hover": {
                  color: "white",
                  backgroundColor: "#fa0001",
                },
              }}
            >
              {type.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {customError && (
          <FormHelperText sx={{ color: "red", ml: 1.5 }}>
            {customError}
          </FormHelperText>
        )}

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
          Tìm kiếm Ngay
        </Button>
      </Box>

      {loading && results.length == 0 && (
        <Typography sx={{ mt: 2 }}>
          Không tìm thấy người trong phạm vi.
        </Typography>
      )}
      {loading == true && results.length > 0 && (
        <Typography sx={{ mt: 2 }}>Kết quả {results.length}</Typography>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              sx={{
                ".MuiDataGrid-columnHeader": {
                  background: "#1976d3",
                  color: "white",
                },
              }}
              rows={results}
              columns={columns}
              localeText={vietnameseText}
              pagination
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 9 } },
              }}
            />
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default DistanceSearchWithDataGrid;
