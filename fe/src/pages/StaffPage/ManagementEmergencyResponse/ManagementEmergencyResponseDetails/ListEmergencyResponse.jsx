import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function ListEmergencyResponse() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const socket = new SockJS("http://localhost:8090/emergencies-notification");
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe("/emergency/responses", (msg) => {
          const response = JSON.parse(msg.body);
          setResponses((prev) => [response, ...prev]);

          setSnackbar({
            open: true,
            message: `📢 Member "${response.memberName}" đã phản hồi đơn khẩn cấp`,
            severity: "info",
          });
        });
        setLoading(false);
      },
    });

    stomp.activate();
    return () => stomp.deactivate();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        📥 Phản hồi đơn khẩn cấp từ người hiến máu (Real-time)
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : responses.length === 0 ? (
        <Typography align="center">Chưa có phản hồi nào.</Typography>
      ) : (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <List>
            {responses.map((res, index) => (
              <Box key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`🧑‍🦱 ${res.memberName}`}
                    secondary={
                      <>
                        <Typography>🩸 Nhóm máu: {res.bloodType}</Typography>
                        <Typography>🕒 Lúc: {res.responseTime}</Typography>
                        <Typography>🔗 Mã đơn khẩn cấp: {res.emergencyRequestId}</Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Paper>
      )}

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
