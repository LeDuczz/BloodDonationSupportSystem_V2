import { useEffect, useState } from "react";
import {
  getAdminSchedules,
  deleteSchedule,
  updateSchedule,
} from "../../../api/bloodDonationSchedule";
import ScheduleEditDialog from "../../../pages/AdminPage/ScheduleManagement/ScheduleEditDialog";
import ScheduleTable from "../../StaffPage/BloodDonationSchedulePage/BloodDonationSchedulePageDetails/ScheduleTable";
import { useAuth } from "../../../context/authContext";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";

export default function ScheduleManagement() {
  const [schedule, setSchedule] = useState([]);
  const { user, loadUser } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [deleteWarningMessage, setDeleteWarningMessage] = useState("Bạn có chắc chắn muốn xóa lịch hiến máu này?");
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteClick = (id) => {
    const item = schedule.find((s) => s.bloodDonationScheduleId === id);
    if (item?.registrationMatching > 0) {
      setDeleteWarningMessage(
        `🩸 Lịch này đang có ${item.registrationMatching} đơn hiến máu đã được gán.\n\nNếu bạn xóa lịch này, toàn bộ các đơn sẽ bị hủy.\n\nBạn có chắc chắn muốn tiếp tục?`
      );
    } else {
      setDeleteWarningMessage("Bạn có chắc chắn muốn xóa lịch hiến máu này?");
    }

    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSchedule(confirmDelete.id);
      setSchedule((prev) =>
        prev.filter((s) => s.bloodDonationScheduleId !== confirmDelete.id)
      );
      await fetchSchedules();
      showSnackbar("🗑️ Xóa lịch thành công!");
    } catch (err) {
      showSnackbar(
        "❌ Không thể xóa lịch: " +
          (err.response?.data?.message || "Lỗi xảy ra"),
        "error"
      );
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleEdit = (item) => {
    setSelectedSchedule(item);
    setOpenDialog(true);
  };

  const handleDialogSubmit = async (updatedData) => {
    try {
      const res = await updateSchedule(
        updatedData.bloodDonationScheduleId,
        updatedData
      );

      setSchedule((prev) =>
        prev.map((s) =>
          s.bloodDonationScheduleId === updatedData.bloodDonationScheduleId
            ? res.data
            : s
        )
      );
      showSnackbar("✅ Cập nhật lịch thành công!");
      setOpenDialog(false);
      fetchSchedules();
    } catch (err) {
      showSnackbar(
        "❌ Cập nhật thất bại: " +
          (err.response?.data?.message || "Lỗi xảy ra"),
        "error"
      );
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await getAdminSchedules();
      const data = res.data;
      if (Array.isArray(data)) {
        setSchedule(data);
      } else if (Array.isArray(data.data)) {
        setSchedule(data.data);
      } else {
        setSchedule([]);
      }
    } catch (err) {
      showSnackbar("❌ Lỗi khi tải danh sách lịch.", err);
      setSchedule([]);
    }
  };

  useEffect(() => {
    loadUser();
    fetchSchedules();
  }, []);

  return (
    <>
      <ScheduleTable
        schedule={schedule}
        role={user.role}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <ScheduleEditDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleDialogSubmit}
          schedule={selectedSchedule}
        />
      </LocalizationProvider>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent sx={{ whiteSpace: "pre-line" }}>
          {deleteWarningMessage}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, id: null })}
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
