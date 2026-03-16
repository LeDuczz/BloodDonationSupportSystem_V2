import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from '@mui/material';

const statusChip = (fulfilled) => {
  return fulfilled ? (
    <Chip label="Đã hoàn thành" color="success" size="small" />
  ) : (
    <Chip label="Chưa hoàn thành" color="warning" size="small" />
  );
};

export default function EmerList({ data }) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">Danh sách yêu cầu hiến máu khẩn cấp</Typography>}
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày tạo đơn</TableCell>
                <TableCell>Tên bệnh nhân</TableCell>
                <TableCell>Người thân</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Nhóm máu</TableCell>
                <TableCell>Lượng máu</TableCell>
                <TableCell>Mức độ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.emergencyBloodRequestId} hover>
                  <TableCell>{item.registrationDate}</TableCell>
                  <TableCell>{item.patientName}</TableCell>
                  <TableCell>{item.patientRelatives}</TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                  <TableCell>{item.locationOfPatient}</TableCell>
                  <TableCell>{item.bloodType}</TableCell>
                  <TableCell>{item.volumeMl}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.levelOfUrgency } 
                      color={
                        item.levelOfUrgency === "CỰC KÌ KHẨN CẤP" ? "error"
                          : item.levelOfUrgency === "RẤT KHẨN CẤP" ? "warning"
                            : item.levelOfUrgency === "KHẨN CẤP" ? "secondary"
                              : "default" 
                      }
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{item.staffName}</TableCell>
                  <TableCell>{statusChip(item.isFulfill)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
