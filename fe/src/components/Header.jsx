import { AppBar, Container, Toolbar, Box, Avatar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Header = ({openLogin, setIsOpenLogin}) => {
    const navigate = useNavigate();
  
  const handleClickSignin = () => {
    navigate('/signin')
  };
  const handleClickSignup = () => {
    navigate('/signup')
  };
    return (
        <>
            <Box sx={{ flexGrow: 1  }} >
                <AppBar position="static" sx={{ backgroundColor: 'white' }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>                          
                            <Typography variant="h6" component="div" >
                                Giọt máu vàng
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            color="black"
                            variant="outlined"
                            onClick={handleClickSignin}
                            sx={{
                                borderColor: 'black',
                                '&:hover': {
                                    borderColor: 'black',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <Typography sx={{color: 'black'}}>Đăng nhập</Typography>
                        </Button>
                        <Box sx={{ width: 16 }} />
                        <Button
                            color="black"
                            variant="outlined"
                            onClick={handleClickSignup}
                            sx={{
                                borderColor: 'black',
                                '&:hover': {
                                    borderColor: 'black',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <Typography sx={{color: 'black'}}>Đăng ký</Typography>
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};

export default Header;