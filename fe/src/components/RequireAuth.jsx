import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const RequireAuth = ({ role, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!user) return <Navigate to="/" replace />;

    if (role && user.role !== role) {
        return <Navigate to="/404" replace />;
    }

    return children;
};

export default RequireAuth;