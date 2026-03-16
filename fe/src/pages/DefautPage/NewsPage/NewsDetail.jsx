import { useParams, useLocation } from "react-router-dom";
import { Box, Container, Typography, Paper } from "@mui/material";

export default function NewsDetail() {
  const { id } = useParams();
  const location = useLocation();
  const newsData = location.state?.newsData;

  if (!newsData) {
    return (
      <Container>
        <Box sx={{ marginTop: { xs: 12, md: 15 }, textAlign: "center", px: 1 }}>
          <Typography variant="h4" color="error">
            Không tìm thấy dữ liệu tin tức!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Vui lòng quay lại trang tin tức để chọn bài viết.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ marginTop: { xs: 12, md: 15 }, textAlign: "center", px: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: "#2563eb",
            fontWeight: 700,
            lineHeight: 1.1,
            wordBreak: "break-word",
            whiteSpace: "normal",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            display: "block"
          }}
        >
          {newsData.title}
        </Typography>
      </Box>
      <Paper elevation={2} sx={{ marginTop: 3, padding: 3, background: "#fff" }}>
        {newsData.imageUrl && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src={`${import.meta.env.VITE_ARTICLE_BASE_URL}/${newsData.imageUrl}`}
              alt={newsData.title}
              style={{
                maxWidth: "100%",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                margin: "0 auto",
                display: "block"
              }}
            />
          </Box>
        )}
        
        <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2, textAlign: "justify", whiteSpace: "pre-line" }}>
          {newsData.content}
        </Typography>
      </Paper>
    </Container>
  );
}