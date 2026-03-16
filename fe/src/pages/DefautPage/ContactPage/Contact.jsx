import { Box, Container, AppBar, Toolbar, Button, Typography, Card, useTheme } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Contact() {
    const theme = useTheme();
    return(
        <>
        <Toolbar/>

          <Container sx={{ marginTop: 4, marginBottom: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                padding: 6, 
                maxWidth: 700,
                width: '100%',
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
              }}>

                <Typography variant="h3" sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  marginBottom: 4,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Thông tin liên hệ
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 3
                  }}>
                    <EmailIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      duclhmse182642@fpt.edu.vn
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 3
                  }}>
                    <PhoneIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      Hotline
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                      <strong>Trung tâm hiến máu:</strong> 0388459378
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 3
                  }}>
                    <AccessTimeIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      Giờ làm việc
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                      Thứ 2 - Thứ 7: 7h30 – 17h00
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                      Chủ nhật: Có thể hoạt động nếu có chiến dịch đặc biệt
                    </Typography>
                  </Box>
                </Box>


                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 3
                  }}>
                    <LocationOnIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                      Trung Tâm Hiến Máu
                    </Typography>
                    <Typography variant="body1">
                      Thành phố Hồ Chí Minh
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  marginTop: 4,
                  padding: 4,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 4,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="body1" sx={{ 
                    fontStyle: 'italic',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    lineHeight: 1.6,
                    marginBottom: 1
                  }}>
                    Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    Nếu bạn cần hỗ trợ vui lòng liên hệ qua hotline hoặc email
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Container>
        </>
    )
}