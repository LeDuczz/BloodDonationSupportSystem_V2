import {
  Box,
  Typography,
  Container,
  Stack,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import {
  History,
} from '@mui/icons-material';
import BloodDonateTabs from './BloodDonateTabs';
import { Toolbar } from '@mui/material';

export default function BloodDonateHistory() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: 3
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 56,
                height: 56
              }}
            >
              <History sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Lịch sử hiến máu
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Theo dõi toàn bộ lịch sử hiến máu của bạn
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Content */}
        <BloodDonateTabs />
      </Container>
    </Box>
  );
}