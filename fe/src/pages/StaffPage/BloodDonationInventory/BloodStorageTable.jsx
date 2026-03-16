import * as React from "react";
import { useState, useEffect } from "react";
import {
  bloodCheckProcessListApi,
  updateProcessIsPassedApi,
  updateBloodVolumeApi,
} from "../../../api/staffService";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
export default function BloodStorageTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
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

  const fetchData = async () => {
    try {
      const res = await bloodCheckProcessListApi();
      return res.data.data;
    } catch (err) {
      showSnackbar("Lỗi khi tải dữ liệu hiến máu:", "error");
      return [];
    }
  };
  const handleReloadBloodBagList = async () => {
    await loadAndSetData();
  };
  const loadAndSetData = async () => {
    const data = await fetchData();
    setRows(data.map((row) => ({ ...row, processId: row.processId })));
  };

  useEffect(() => {
    loadAndSetData();
  }, []);

  const processRowUpdate = async (newRow) => {
    const {
      processId,
      donationRegisId,
      bloodTest,
      status,
      bloodTypeId,
      volumeMl,
    } = newRow;
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    if (bloodTest === "ĐÃ ĐẠT" && !validBloodTypes.includes(bloodTypeId)) {
      throw new Error("Bạn phải chọn nhóm máu khi đã kiểm tra!");
    }
    if (bloodTest === "KHÔNG ĐẠT" && !validBloodTypes.includes(bloodTypeId)) {
      throw new Error("Bạn phải chọn nhóm máu khi đã kiểm tra dù không đạt!");
    }

    try {
      const data = {
        bloodTest,
        bloodTypeId,
      };

      await updateProcessIsPassedApi(processId, data);

      if (newRow.bloodTest === "ĐÃ ĐẠT" && newRow.bloodTypeId) {
        const dataInventory = { donationRegisId, processId, volumeMl };

        const responseInventory = await updateBloodVolumeApi(
          bloodTypeId,
          dataInventory
        );

        if (
          responseInventory.data.message ===
          "Update blood volume successfully for emergency request"
        ) {
          showSnackbar(
            "Máu đã kiểm tra cho trường hợp khẩn cấp " +
              responseInventory.data.data.patientName +
              " ,Phòng " +
              responseInventory.data.data.locationOfPatient,
            "success"
          );
        }

        if (
          responseInventory.data.message ===
            "Update blood volume successfully. User has been updated with blood type from process" ||
          responseInventory.data.message ===
            "Update blood volume successfully. User already has a blood type set, no update needed"
        ) {
          showSnackbar(
            "Đã thêm vào kho máu và cập nhật máu cho hồ sơ người hiến máu!",
            "success"
          );
        }
      } else if (newRow.bloodTest === "KHÔNG ĐẠT") {
        showSnackbar("Cập nhật trạng thái thành công", "success");
      }
      await loadAndSetData();
      return { ...newRow };
    } catch (err) {
      showSnackbar("Lỗi cập nhật", "error");
      throw err;
    }
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newModel) => {
    setRowModesModel(newModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const columns = [
    {
      field: "processId",
      headerName: "Mã hồ sơ xử lí",
      width: 220,
      filterable: false,
    },
    {
      field: "donationRegisId",
      headerName: "Mã đăng kí hiến máu",
      width: 220,
      filterable: false,
      renderCell: (params) => <span>{params.value || "-"}</span>,
    },
    {
      field: "volumeMl",
      headerName: "Dung tích (ml)",
      width: 150,
      filterable: false,
    },
    ,
    {
      field: "status",
      headerName: "Trạng thái hiến",
      width: 150,
      filterable: false,
    },
    {
      field: "bloodTest",
      headerName: "Kiểm tra",
      width: 150,
      editable: true,
      filterable: false,
      renderEditCell: (params) => {
        const { id, field, value, api } = params;

        const handleChange = (event) => {
          api.setEditCellValue({ id, field, value: event.target.value });
        };

        return (
          <Select
            key={id}
            value={value || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={{ height: 50 }}
          >
            {["CHƯA KIỂM TRA", "ĐÃ ĐẠT", "KHÔNG ĐẠT"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },

    {
      field: "bloodTypeId",
      headerName: "Nhóm máu",
      width: 150,
      editable: true,
      filterable: false,
      valueFormatter: (params) => {
        return params ?? "-";
      },

      renderEditCell: (params) => {
        const { id, field, value, api } = params;

        const handleChange = (event) => {
          const selectedValue = event.target.value;
          api.setEditCellValue({
            id,
            field,
            value: selectedValue === "null" ? null : selectedValue,
          });
        };

        return (
          <Select
            key={id}
            value={value ?? "null"}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={{ height: 50 }}
          >
            <MenuItem value="null">-</MenuItem>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      filterable: false,
      width: 150,
      getActions: ({ id }) => {
        const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isEditing
          ? [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Lưu"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Huỷ"
                onClick={handleCancelClick(id)}
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Sửa"
                onClick={handleEditClick(id)}
              />,
            ];
      },
    },
  ];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Kho máu</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={(event) => {
              event.stopPropagation();
              handleReloadBloodBagList();
            }}
          >
            Danh sách kiểm tra máu
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.processId}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(err) => showSnackbar(err.message, "error")}
          localeText={vietnameseText}
          disableColumnSelector
          pagination
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
    </Box>
  );
}
