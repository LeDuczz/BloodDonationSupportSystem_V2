import { Box, Container, Typography, Grid, Link } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';


export default function Footer() {
    return (
        <Box sx={{ bgcolor: '#2C2C2C', color: 'white', py: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#E53935' }}>
                            Trung Tâm Hiến Máu
                        </Typography>
                        <Typography variant="body2">
                            Cứu sống là niềm vui. Hãy cùng chúng tôi lan tỏa yêu thương và chia sẻ sự sống.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Link href="#" color="inherit" sx={{ mr: 1.5 }}><FacebookIcon /></Link>
                            <Link href="#" color="inherit" sx={{ mr: 1.5 }}><TwitterIcon /></Link>
                            <Link href="#" color="inherit"><InstagramIcon /></Link>
                        </Box>
                    </Grid>
                    
                      
                    
                </Grid>
                <Box mt={5} textAlign="center">
                    <Typography variant="body2" color="text.secondary" sx={{color: 'white'}}>
                        © {new Date().getFullYear()} Blood Donation Center. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}