import {
    Box,
    Container,
    Typography,
    Button,
    Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function ErrorPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        const role = user?.role;

        if (role === "ROLE_ADMIN") navigate("/admin");
        else if (role === "ROLE_STAFF") navigate("/staff");
        else if (role === "ROLE_MEMBER") navigate("/user");
        else navigate("/");
    };

    return (

        <Container sx={{ textAlign: 'center' }}>
            <Box sx={{
                backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '550px',
                width: '800px',
                margin: 'auto'
            }}>
            </Box>
            <Typography variant="h2" color="error">404 Not Found</Typography>
            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                <Button 
                variant="contained" 
                color="inherit" 
                sx={{ backgroundColor: '#9e9e9e', '&:hover': { backgroundColor: '#757575' } }}
                onClick={handleGoBack}>
                    Quay về trang chủ
                </Button>
            </Stack>
        </Container>
    );
}