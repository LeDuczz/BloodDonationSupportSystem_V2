import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Button,
  Typography,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Siren, X as CloseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { createEmergencyRequest } from "../../../api/emergencyDonation";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "KHẨN CẤP", label: "Khẩn cấp" },
  { value: "RẤT KHẨN CẤP", label: "Rất khẩn cấp" },
  { value: "CỰC KÌ KHẨN CẤP", label: "Cực kì khẩn cấp" },
];


export function EmergencyRegistrationDialog({ open, onClose, onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    patient_name: "",
    patient_relatives: "",
    phonenumber: "",
    location_of_patient: "",
    blood_type: "",
    volume_ml: "",
    level_of_urgency: "",
    note: "",
    confirmChecked: false,
    registeredByStaff:user.id,
  });

  
  const [staffName, setStaffName] = useState("");

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

  useEffect(() => {
    if (user?.fullName) {
      setStaffName(user.fullName);
    }

    if (open) {
      setForm({
        patient_name: "",
        patient_relatives: "",
        phonenumber: "",
        location_of_patient: "",
        blood_type: "",
        volume_ml: "",
        level_of_urgency: "",
        note: "",
        confirmChecked: false,
      });
    }
  }, [user, open]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validateForm = () => {
    const {
      patient_name,
      patient_relatives,
      phonenumber,
      location_of_patient,
      blood_type,
      volume_ml,
      level_of_urgency,
      confirmChecked,
    } = form;

    if (
      !patient_name.trim() ||
      !patient_relatives.trim() ||
      !phonenumber.trim() ||
      !location_of_patient.trim() ||
      !blood_type ||
      !volume_ml ||
      !level_of_urgency ||
      !confirmChecked
    ) {
      showSnackbar("Vui lòng điền đầy đủ thông tin và xác nhận.", "error");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phonenumber)) {
      showSnackbar("Số điện thoại phải gồm 10-11 chữ số.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      patientName: form.patient_name,
      patientRelatives: form.patient_relatives,
      phoneNumber: form.phonenumber,
      locationOfPatient: form.location_of_patient,
      bloodType: form.blood_type,
      volumeMl: Number(form.volume_ml),
      levelOfUrgency: form.level_of_urgency,
      note: form.note,
      registeredByStaff:user.id,
    };

    try {
      await createEmergencyRequest(payload);
      showSnackbar("Tạo đơn thành công!", "success");
      if (onSubmit) onSubmit();
    } catch (err) {
      console.error(err);
      showSnackbar("Tạo đơn thất bại!", "error");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
            color: "white",
            mb: 2,
            py: 2,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Siren size={28} />
              <Typography fontWeight="bold">Đăng ký trường hợp khẩn cấp</Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={handleSubmit} id="emergency-form">
            {/* THÔNG TIN BỆNH NHÂN */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold">
                  Thông tin bệnh nhân
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6} width={410}>
                <TextField
                  fullWidth
                  label="Tên bệnh nhân"
                  value={form.patient_name}
                  onChange={handleChange("patient_name")}
                />
              </Grid>
              <Grid item xs={12} md={6} width={410}>
                <TextField
                  fullWidth
                  label="Tên người thân"
                  value={form.patient_relatives}
                  onChange={handleChange("patient_relatives")}
                />
              </Grid>
            </Grid>

            {/* THÔNG TIN LIÊN HỆ */}
            <Grid item xs={12} mt={1}>
              <Divider textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold">
                  Thông tin liên hệ
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6} width={410}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={form.phonenumber}
                  onChange={handleChange("phonenumber")}
                />
              </Grid>
              <Grid item xs={12} md={6} width={410}>
                <TextField
                  fullWidth
                  label="Địa điểm bệnh nhân"
                  value={form.location_of_patient}
                  onChange={handleChange("location_of_patient")}
                />
              </Grid>
            </Grid>

            {/* THÔNG TIN Y TẾ */}
            <Grid item xs={12} mt={1}>
              <Divider textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold">
                  Thông tin y tế
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4} width={200}>
                <FormControl fullWidth>
                  <Select
                    value={form.blood_type}
                    onChange={handleChange("blood_type")}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Chọn nhóm máu
                    </MenuItem>
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Chip label={type} size="small" />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} width={300}>
                <TextField
                  type="number"
                  fullWidth
                  label="Lượng máu (ml)"
                  value={form.volume_ml}
                  onChange={handleChange("volume_ml")}
                />
              </Grid>
              <Grid item xs={12} md={4} width={300}>
                <FormControl fullWidth>
                  <Select
                    value={form.level_of_urgency}
                    onChange={handleChange("level_of_urgency")}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Chọn mức độ khẩn cấp
                    </MenuItem>
                    {urgencyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} width={900}> 
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Ghi chú"
                  placeholder="Thông tin thêm về tình trạng bệnh nhân..."
                  value={form.note}
                  onChange={handleChange("note")}
                />
              </Grid>
            </Grid>

            {/* NHÂN VIÊN */}
            <Grid item xs={12} mt={1}>
              <Divider textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold">
                  Thông tin nhân viên
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} md={6} mt={1}>
              <TextField fullWidth disabled label="Nhân viên đăng ký" value={staffName} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.confirmChecked}
                    onChange={(e) =>
                      setForm({ ...form, confirmChecked: e.target.checked })
                    }
                  />
                }
                label="Tôi đã kiểm tra và xác nhận thông tin trên là đúng."
              />
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Tạo yêu cầu khẩn cấp
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
