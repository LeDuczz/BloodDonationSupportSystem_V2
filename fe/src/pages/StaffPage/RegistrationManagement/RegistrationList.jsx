import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { Edit, XCircle } from 'lucide-react';


export default function RegistrationList({ donors, onEditDonor, onCancelDonor }) {
    
    return (
        <Card>
            <CardHeader
                title={<Typography variant="h6">Danh sách đơn đăng ký</Typography>}
            />
            <CardContent sx={{ p: 0 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Họ tên</TableCell>
                                <TableCell>Ngày ĐK</TableCell>
                                <TableCell>Mức độ</TableCell>
                                <TableCell>Thông tin liên hệ</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Trạng thái đơn</TableCell>
                                <TableCell>Duyệt đơn</TableCell>
                                <TableCell>Hủy đơn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(donors|| []).map((donor) => (
                                <TableRow key={donor.donationRegistrationId} hover>

                                    <TableCell>
                                        <Typography fontWeight="medium">{donor.donorFullName}</Typography>
                                    </TableCell>

                                    <TableCell>{new Date(donor.registrationDate).toLocaleDateString('vi-VN')}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={donor.levelOfUrgency || "BÌNH THƯỜNG"}
                                            color={
                                                donor.levelOfUrgency === "CỰC KÌ KHẨN CẤP" ? "error"
                                                    : donor.levelOfUrgency === "RẤT KHẨN CẤP" ? "warning"
                                                        : donor.levelOfUrgency === "KHẨN CẤP" ? "secondary"
                                                            : "default"
                                            }
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {donor.donorPhonumber}
                                        {donor.donorEmail}
                                    </TableCell>

                                    <TableCell>{donor.addressHospital}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={donor.screenedByStaffId || "CHỜ DUYỆT"}
                                            color={"warning"}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Tooltip title="Duyệt đơn">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => onEditDonor(donor)}
                                            >
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell>
                                        <Tooltip title="Hủy đơn">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onCancelDonor(donor)}
                                                disabled={donor.registrationStatus === 'HUỶ'}
                                            >
                                                <XCircle size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
