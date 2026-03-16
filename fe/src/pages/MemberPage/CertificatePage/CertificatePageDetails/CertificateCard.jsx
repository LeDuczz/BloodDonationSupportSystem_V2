import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Favorite, Download } from "@mui/icons-material";
import dayjs from "dayjs";

export default function CertificateCard({ certificate, onDownload }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        backgroundColor: "#ffffff",
        transition: "0.3s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Favorite color="error" />
          <Typography variant="h6" fontWeight={600} color="primary">
            {certificate.typeCertificate}
          </Typography>
        </Stack>

        <InfoRow label="Ngày hiến máu" value={dayjs(certificate.registrationDate).format("DD/MM/YYYY")} />
        <InfoRow label="Địa điểm" value={certificate.hospital} />
        <InfoRow label="Ngày cấp" value={dayjs(certificate.issuedAt).format("DD/MM/YYYY")} />
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={() => onDownload(certificate.certificateId)}
        >
          Tải PDF
        </Button>
      </Box>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box mb={1}>
      <Typography variant="body2" fontWeight={600}>
        {label}:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Box>
  );
}
