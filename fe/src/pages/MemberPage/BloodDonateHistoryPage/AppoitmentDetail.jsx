import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Schedule,
  LocationOn,
  Bloodtype,
  CalendarToday,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../../config/axios";

export default function AppointmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const appointmentFromState = location.state?.appointment;

  const [appointment, setAppointment] = useState(appointmentFromState || null);
  const [loading, setLoading] = useState(!appointmentFromState);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!appointmentFromState) {
      const fetchAppointment = async () => {
        try {
          const res = await axios.get(`/member/donation-info/${id}`);
          if (res.data?.data) {
            setAppointment(res.data.data);
          } else {
            setAppointment(null);
          }
        } catch (error) {
          console.error("Error fetching appointment:", error);
          setAppointment(null);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointment();
    }
  }, [appointmentFromState, id]);

  const handleCancel = async () => {
    setCanceling(true);
    try {
      await axios.put(`/member/donation-info/${id}/cancel`);
      setAppointment(prev => ({ ...prev, status: 'HỦY' }));
      setCancelDialog(false);
      setSuccess('Đã hủy đơn hiến máu thành công!');
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setError('Có lỗi xảy ra khi hủy đơn. Vui lòng thử lại!');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CHƯA HIẾN':
        return 'warning';
      case 'ĐÃ HIẾN':
        return 'success';
      case 'HỦY':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDisplayValue = (value, isVolumeML = false) => {
    if (isVolumeML) {
      return value ? `${value} ml` : "0 ml";
    }
    return value || "Chưa cập nhật";
  };

  const getHospitalDisplay = (value) => {
    return value || "Trung tâm hiến máu";
  }

  const getTimeDisplay = (startTime, endTime) => {
    if (!startTime && !endTime) {
      return "Chưa cập nhật";
    }
    if (!startTime) {
      return `Chưa cập nhật - ${endTime}`;
    }
    if (!endTime) {
      return `${startTime} - Chưa cập nhật`;
    }
    return `${startTime} - ${endTime}`;
  };

  const getDateDisplay = (donationDate) => {
    if (!donationDate) {
      return "Chưa cập nhật";
    }
    try {
      return new Date(donationDate).toLocaleDateString("vi-VN", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Chưa cập nhật";
    }
  };

  const getDonationType = (emergencyId) => {
    return emergencyId ? "Hiến máu khẩn cấp" : "Hiến máu thông thường";
  };

  const canCancel = appointment?.status === "CHƯA HIẾN";
  const isEmergencyDonation = appointment?.emergencyBloodRequestId != null;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Không tìm thấy thông tin đặt hẹn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
            Chi tiết lịch hẹn hiến máu
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Trạng thái:
            </Typography>
            <Chip
              label={getDisplayValue(appointment.status)}
              color={getStatusColor(appointment.status)}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "primary.main" }}>
              Thông tin chi tiết
            </Typography>

            <Stack spacing={3}>
              {!isEmergencyDonation && (
                <>
                  <Box display="flex" alignItems="center">
                    <Schedule sx={{ color: "primary.main", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian hiến máu
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          color: (!appointment.startTime && !appointment.endTime) ? "text.secondary" : "text.primary",
                          fontStyle: (!appointment.startTime && !appointment.endTime) ? "italic" : "normal"
                        }}
                      >
                        {getTimeDisplay(appointment.startTime, appointment.endTime)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />
                </>
              )}

              <Box display="flex" alignItems="center">
                <LocationOn sx={{ color: "error.main", mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cơ sở tiếp nhận máu
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      color: "text.primary",
                      fontStyle: "normal"
                    }}
                  >
                    {getHospitalDisplay(appointment.addressHospital)}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center">
                <Bloodtype sx={{ color: "error.main", mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Lượng máu hiến
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {getDisplayValue(appointment.volumeMl, true)}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center">
                <Bloodtype sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Loại hiến máu
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {getDonationType(appointment.emergencyBloodRequestId)}
                  </Typography>
                </Box>
              </Box>

              <Divider/>

              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ color: "info.main", mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngày hiến máu
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      color:  !appointment.dateCompleteDonation ? "text.secondary" : "text.primary",
                      fontStyle: !appointment.dateCompleteDonation ? "italic" : "normal"
                    }}
                  >
                    {getDateDisplay(appointment.dateCompleteDonation)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              minWidth: 140,
              borderRadius: 2,
            }}
          >
            Quay lại
          </Button>

          {canCancel && (
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => setCancelDialog(true)}
              sx={{
                minWidth: 140,
                borderRadius: 2,
              }}
            >
              Hủy đơn
            </Button>
          )}
        </Box>
      </Container>

      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600} component="span">
            Xác nhận hủy đơn
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Bạn có chắc chắn muốn hủy đơn hiến máu này không?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setCancelDialog(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            color="error"
            disabled={canceling}
            sx={{ minWidth: 100 }}
          >
            {canceling ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}