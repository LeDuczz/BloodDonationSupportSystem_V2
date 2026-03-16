import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

const tips = {
  shouldDo: {
    title: 'Nên làm trước & sau khi hiến máu',
    items: [
      'Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.',
      'Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ.',
      'Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu',
      'Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.',
      'Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.',
    ],
    author: 'Bác sĩ Ngô Văn Tân\nTrưởng khoa Tiếp nhận hiến máu - Bệnh viện Truyền máu Huyết học',
  },
  shouldNotDo: {
    title: 'Không nên làm',
    items: [
      'Uống sữa, rượu bia trước khi hiến máu.',
      'Không lao động nặng ngay sau khi hiến máu.',
    ],
    author: 'Bác sĩ Ngô Văn Tân\nTrưởng khoa Tiếp nhận hiến máu - Bệnh viện Truyền máu Huyết học',
  },
  caution: {
    title: 'Lưu ý',
    items: [
      'Nếu cảm thấy chóng mặt, hãy nằm nghỉ và kê chân cao.',
      'Báo nhân viên y tế nếu có triệu chứng bất thường.',
    ],
    author: 'Bác sĩ Ngô Văn Tân\nTrưởng khoa Tiếp nhận hiến máu - Bệnh viện Truyền máu Huyết học',
  },
};

const TipCard = ({ title, items, author }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon>
              <CheckCircleOutline color="primary" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>

    {author && (
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}
        >
          {author}
        </Typography>
      </Box>
    )}
  </Paper>
);

const DonationTip = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Những lời khuyên trước và sau khi hiến máu
        </Typography>

        <Grid container spacing={4} justifyContent={'center'}>

          <Grid item xs={12} md={6}>
            <TipCard {...tips.shouldDo} />
          </Grid>


          <Grid item xs={12} md={6}>
            <Grid container spacing={4} direction="column">
              <Grid item>
                <TipCard {...tips.shouldNotDo} />
              </Grid>
              <Grid item>
                <TipCard {...tips.caution} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};


export default DonationTip;
