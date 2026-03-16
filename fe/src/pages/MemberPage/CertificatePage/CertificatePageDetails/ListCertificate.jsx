import CertificateCard from "./CertificateCard";
import { Grid, Typography } from "@mui/material";

export default function CertificateList({ certificates, onDownload }) {
  if (!certificates || certificates.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Hiện chưa có chứng nhận hiến máu nào.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {certificates.map((cert) => (
        <Grid item xs={12} sm={6} md={4} key={cert.certificateId}>
          <CertificateCard certificate={cert} onDownload={onDownload} />
        </Grid>
      ))}
    </Grid>
  );
}
