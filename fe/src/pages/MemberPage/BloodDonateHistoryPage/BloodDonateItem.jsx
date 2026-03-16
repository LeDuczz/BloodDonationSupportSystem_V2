import {
    Avatar,
    Box,
    Typography,
    Button,
} from '@mui/material';
import {
    Bloodtype,
    CheckCircle,
    ErrorOutline,
    HourglassEmpty,
    ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const getColor = (status) => {
    switch (status) {
        case 'ĐÃ HIẾN': return 'success';
        case 'CHƯA HIẾN': return 'warning';
        case 'HỦY': return 'error';
        default: return 'default';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'ĐÃ HIẾN':
            return <CheckCircle fontSize="large" />;
        case 'CHƯA HIẾN':
            return <HourglassEmpty fontSize="large" />;
        case 'HỦY':
            return <ErrorOutline fontSize="large" />;
        default:
            return <Bloodtype fontSize="large" />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'ĐÃ HIẾN':
            return '#4caf50';
        case 'CHƯA HIẾN':
            return '#ff9800';
        case 'HỦY':
            return '#f44336';
        default:
            return '#9e9e9e';
    }
};

export default function BloodDonateItem({ donation }) {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="1px solid #eee"
            py={1.5}
        >
            <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 2, bgcolor: getStatusColor(donation.status) }}>
                    {getStatusIcon(donation.status)}
                </Avatar>
                <Box>
                    <Typography fontWeight="bold">
                        {donation.emergencyBloodRequestId
                            ? (donation.dateCompleteDonation
                                ? new Date(donation.dateCompleteDonation).toLocaleDateString('vi-VN')
                                : 'Chưa cập nhật')
                            : (donation.donationDate
                                ? new Date(donation.donationDate).toLocaleDateString('vi-VN')
                                : 'Chưa cập nhật')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Địa điểm: {donation.addressHospital || 'Trung tâm hiến máu'}
                    </Typography>
                </Box>
            </Box>

            {/* <Stack direction="row" spacing={1}>
                <Chip label={donation.status} color={getColor(donation.status)} />
            </Stack> */}
            <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                }}
                onClick={() =>
                    navigate(`/user/appointment-histories/${donation.donationRegistrationId}`, {
                        state: { appointment: donation },
                    })
                }
            >
                Xem chi tiết
            </Button>
        </Box>
    );
}