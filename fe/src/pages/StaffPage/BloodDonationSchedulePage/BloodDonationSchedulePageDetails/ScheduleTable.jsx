import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function ScheduleTable({ schedule, onDelete, onEdit, role }) {
  const isAdmin = role === "ROLE_ADMIN";

  

  return (
    <Box mt={6}>
      <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
        Danh sách lịch hiến máu đã tạo
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>STT</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Địa chỉ</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ngày</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Thời gian</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Đơn đã gán</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Giới hạn</TableCell>
              {isAdmin && (onEdit || onDelete) && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center" colSpan={2}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {schedule.map((item, index) => (
              <TableRow key={item.bloodDonationScheduleId || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.addressHospital}</TableCell>
                <TableCell>{new Date(item.donationDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{`Từ ${item.startTime} đến ${item.endTime}`}</TableCell>
                <TableCell>{item.registrationMatching}</TableCell>
                <TableCell>{item.amountRegistration}</TableCell>
                {isAdmin && (onEdit || onDelete) && (
                  <>
                    <TableCell align="center">
                      {onDelete && (
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          startIcon={<Delete />}
                          onClick={() => onDelete(item.bloodDonationScheduleId)}
                        >
                          Xóa
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {onEdit && (
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => onEdit(item)}
                        >
                          Sửa
                        </Button>
                      )}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
