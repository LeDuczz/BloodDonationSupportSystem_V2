import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Avatar,
  Tooltip,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getEmergencyCases,
  respondEmergencyRequest,
} from "../../../../api/emergencyBloodRequest";
import { red, orange, yellow } from "@mui/material/colors";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const ITEMS_PER_PAGE = 4;

export default function EmergencyRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);

  const getUrgencyStyle = (level) => {
    switch (level) {
      case "CỰC KÌ KHẨN CẤP":
        return {
          label: "🔥 CỰC KÌ KHẨN CẤP",
          color: "error",
          bg: red[100],
          border: `2px solid ${red[500]}`,
        };
      case "RẤT KHẨN CẤP":
        return {
          label: "⚠️ RẤT KHẨN CẤP",
          color: "warning",
          bg: orange[100],
          border: `2px solid ${orange[400]}`,
        };
      case "KHẨN CẤP":
      default:
        return {
          label: "🚨 KHẨN CẤP",
          color: "info",
          bg: yellow[100],
          border: `2px solid ${yellow[500]}`,
        };
    }
  };

  useEffect(() => {
    // Load initial emergency list
    getEmergencyCases().then((res) => {
      setRequests(res.data.data);
      setLoading(false);
    });

    // WebSocket
    const socket = new SockJS(SOCKET_URL);
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe("/emergency/emergency-requests", (msg) => {
          const data = JSON.parse(msg.body);

          setRequests((prev) => {
            const exists = prev.some(
              (r) => r.emergencyBloodRequestId === data.emergencyBloodRequestId
            );

            // Nếu đơn đã fulfill thì loại khỏi danh sách
            if (data.isFulfill || data.fulfill === true) {
              return prev.filter(
                (r) => r.emergencyBloodRequestId !== data.emergencyBloodRequestId
              );
            }

            // Nếu là đơn mới thì thêm vào
            if (!exists) {
              return [data, ...prev];
            }

            // Nếu đã có thì cập nhật lại thông tin
            return prev.map((r) =>
              r.emergencyBloodRequestId === data.emergencyBloodRequestId ? data : r
            );
          });
        });
        setLoading(false);
      },
    });

    stomp.activate();
    return () => stomp.deactivate();
  }, []);

  const respond = async (id) => {
    try {
      var result = await respondEmergencyRequest(id);
      if (result) {
        setSnackbar({
          open: true,
          message: "✅ Bạn đã phản hồi đơn khẩn cấp thành công!",
          severity: "success",
        });
      }
    } catch (err) {
      let errorMessage = "";
      if (err.status === 403) {
        errorMessage = "Bạn không thể sử dụng chức năng này!";
      } else {
        const msg = err.response?.data?.message || "";
        if (msg === "Donor not found") errorMessage = "Bạn chưa đăng kí!";
        else if (msg === "Cannot found emergency request")
          errorMessage = "Không tìm thấy đơn yêu cầu khẩn cấp";
        else if (msg === "You already have a pending registration!")
          errorMessage = "Bạn đã có 1 đơn đăng kí chờ đợi!";
        else if (
          msg === "You have donated within the last 90 days. Please wait longer!"
        )
          errorMessage = "Bạn đã hiến máu trong 90 ngày. Hãy đợi hồi phục!";
        else if (
          msg === "Your blood type mismatch in request" ||
          msg === "Your blood type is not compatible with the emergency request"
        )
          errorMessage = "Nhóm máu của bạn không phù hợp với yêu cầu khẩn cấp!";
        else errorMessage = "Đã xảy ra lỗi.";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const visibleRequests = requests.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ px: 4, py: 5, background: "#f9f9f9", width: "100%" }}>
      <Typography variant="h4" textAlign="center" fontWeight={700} mb={4}>
        🩸 Các đơn hiến máu khẩn cấp
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Typography textAlign="center" mt={10}>
          Không có đơn khẩn cấp nào lúc này.
        </Typography>
      ) : (
        <Box display="flex" justifyContent="center">
          <Grid container spacing={3} justifyContent="center" maxWidth="lg">
            {visibleRequests.map((req) => {
              const urgency = getUrgencyStyle(req.levelOfUrgency);
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={req.emergencyBloodRequestId}
                >
                  <Card
                    elevation={5}
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s",
                      backgroundColor: urgency.bg,
                      border: urgency.border,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={urgency.color}
                        sx={{ mb: 1 }}
                      >
                        {urgency.label}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          sx={{
                            bgcolor: "#ff4d4f",
                            width: 56,
                            height: 56,
                            mr: 2,
                          }}
                        >
                          🩸
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {req.patientName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Người thân: {req.patientRelatives}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography>
                        <strong>🩸 Nhóm máu:</strong> {req.bloodType}
                      </Typography>
                      <Typography>
                        <strong>📍 Địa điểm:</strong> {req.locationOfPatient}
                      </Typography>
                      <Typography>
                        <strong>🔥 Mức độ:</strong> {req.levelOfUrgency}
                      </Typography>
                      <Typography>
                        <strong>🧪 Thể tích:</strong> {req.volumeMl} ml
                      </Typography>

                      {req.note && (
                        <Typography sx={{ mt: 1 }} color="text.secondary">
                          📝 {req.note}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions
                      sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => respond(req.emergencyBloodRequestId)}
                        sx={{ borderRadius: "20px", textTransform: "none" }}
                      >
                        Tôi muốn hiến máu
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Box
        mt={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Tooltip title="Trang trước">
          <span>
            <IconButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              <ArrowBackIos />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body1">
          Trang <strong>{page + 1}</strong> / {totalPages}
        </Typography>
        <Tooltip title="Trang kế tiếp">
          <span>
            <IconButton
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
            >
              <ArrowForwardIos />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
