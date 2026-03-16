import { useEffect, useState } from "react";
import {
  downloadCertificate,
  fetchCertificates,
} from "../../../api/certificate";
import CertificateList from "../../../pages/MemberPage/CertificatePage/CertificatePageDetails/ListCertificate";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { Toolbar } from "@mui/material";

export default function CertificatePage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const getCertificates = async () => {
    try {
      const data = await fetchCertificates();
      setCertificates(data);
    } catch (err) {
      setSnackbarMessage("Không thể tải danh sách chứng nhận.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  const handleDownload = async (certificateId) => {
    try {
      await downloadCertificate(certificateId);
      setSnackbarMessage("Tải giấy chứng nhận thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Lỗi khi tải file PDF", err);
      setSnackbarMessage("Tải giấy chứng nhận thất bại!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "1300px", mx: "auto" }}>
      <Toolbar/>
      <Typography display={{display: 'flex'}} justifyContent={{justifyContent: 'center'}} variant="h4" fontWeight={600} mb={3} color="primary">
        Chứng nhận hiến máu
      </Typography>

      <Paper
        elevation={4}
        sx={{
          padding: 3,
          borderRadius: 4,
          backgroundColor: "#fdfdfd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CertificateList
            certificates={certificates}
            onDownload={handleDownload}
          />
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
