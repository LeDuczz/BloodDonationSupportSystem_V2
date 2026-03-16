import { Box, Typography, Stack, Button } from "@mui/material";
import { People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BloodeDonationEventCard ({item}) {
   const navigate = useNavigate();
    function onBook () {
        navigate("/user/blood-donation-register", {state : {item}});
    }
    
      return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: '#f5f5f5',
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        flexWrap: 'wrap',
        marginTop: '20px'
      }}
    >
      <Box sx={{ flex: 1, minWidth: '300px' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          {item.title}
        </Typography>

        <Typography variant="body2" mt={1}>
          <strong>Địa chỉ:</strong> {item.address}
        </Typography>

        <Typography variant="body2">
          <strong>Thời gian hoạt động:</strong> {item.operatingDate}
        </Typography>

        <Typography variant="body2">
          <strong>Thời gian hiến máu:</strong> {"Từ " + item.startTime + " Đến " + item.endTime}
        </Typography>
      </Box>

      <Stack direction="column" alignItems="center" spacing={1} sx={{ minWidth: '130px' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <People fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Số lượng đăng ký
          </Typography>
        </Stack>

        <Typography variant="h6" fontWeight="bold" color="primary">
          {item.numberRegister}/{item.capacity} <Typography variant="body2" component="span">Người</Typography>
        </Typography>

        <Button variant="contained" onClick={() => onBook()}>
          Đặt lịch
        </Button>
      </Stack>
    </Box>
      );

}