import { Box, Container,AppBar, Toolbar,Button, Grid, TextField, Typography, Card} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

export default function Contact() {
    return(
        <>
        
          {/* Header */}
          <AppBar position="static" sx={{ backgroundColor: '#1E3A8A' }}>
            <Toolbar>
              <img src="hca-logo.png" alt="HCA Logo" style={{ height: 50 }} />
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Button color="inherit">TRANG CHỦ</Button>
                <Button color="inherit">HỎI - ĐÁP</Button>
                <Button color="inherit">TIN TỨC</Button>
                <Button color="inherit" sx={{ fontWeight: 'bold' }}>LIÊN HỆ</Button>
              </div>
              <Button color="inherit" startIcon={<PersonIcon />}>Đăng nhập</Button>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container sx={{ marginTop: 4, paddingTop: 4, marginBottom: 4, padding: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
              {/* Contact Information - Left */}
              <Box sx={{ flex: '0 0 50%', minWidth: 0 }}>
      <Card sx={{ backgroundColor: '#3B82F6', color: 'white', borderRadius: 5, padding: 4, minHeight: '60vh'}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
          Liên hệ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <EmailIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Email
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ marginLeft: 4, marginBottom: 2 }}>
          gmv@intelin.vn
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <PhoneIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Hotline
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ marginLeft: 4 }}>
          TT Hiền Mẫu Nhân Đạo: 028 3868 5509 / 028 3868 5507
        </Typography>
        <Typography variant="body1" sx={{ marginLeft: 4 }}>
          Bệnh viện BTH: 028 39571342 / 028 39557858
        </Typography>
        <Typography variant="body1" sx={{ marginLeft: 4 }}>
          TT truyền máu Chợ Rẫy: 028 39555885
        </Typography>
      </Card>
    </Box>

              {/* Contact Form - Right */}
              <Box sx={{ flex: '0 0 50%', minWidth: 0 }}>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>Gửi lời nhắn cho chúng tôi</Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  Nếu bạn có bất kỳ thắc mắc nào liên quan đến các hoạt động hiện tại của trung tâm nguyệt, xin vui lòng liên hệ với chúng tôi qua địa chỉ email gmv@intelin.vn hoặc gửi thông tin cho chúng tôi theo mẫu bên dưới:
                </Typography>
                <div>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    placeholder="Vui lòng nhập họ và tên"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="Vui lòng nhập email"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Lời nhắn"
                    placeholder="Vui lòng nhập lời nhắn"
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ marginBottom: 2 }}
                  />
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#BFDBFE', color: '#1E40AF', borderRadius: 2 }}
                  >
                    Gửi lời nhắn
                  </Button>
                </div>
              </Box>
            </Box>
          </Container>
        </>
    )
}