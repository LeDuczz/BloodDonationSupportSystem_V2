import { Button, Box, List, ListItem, Paper, Stack, Typography, Dialog, DialogContent, DialogActions, DialogTitle,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";



export default function BloodDonationRequestPage() {

    // call API get donation request

    const [donationRequest, setDonationRequest] = useState([]);

    useEffect(() => {
        const getDonationRequest = async () => {
            const response = await axios.get('http://localhost:3001/bloodRequestList');
            if (response.data) {
                setDonationRequest(response.data)
            }
        }
        getDonationRequest();
    }, [])
    // handle submit 

    // handle filter 
    const [selectedStatus, setSelectedStatus] = useState('all');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    // Lọc danh sách theo status
    const filteredData = donationRequest.filter((item) => {
        if (selectedStatus === 'all') return true;
        return item.statusDonation === selectedStatus;
    });

    //handle UI open Dialog with spec Item 
    const [openDialog, setOpenDialog] = useState(false);
    const [item, setItem] = useState(null);
    const handleOpenDialog = (item) => {
        setItem(item)
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };
    return (
        <Box>
            <Stack margin={4}>
                <Typography variant="h5" textAlign={'center'}>Danh Sách Yêu Cầu Hiến Máu</Typography>
                <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={selectedStatus} onChange={handleStatusChange} label="Trạng thái">
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="Bình Thường">Bình Thường</MenuItem>
                        <MenuItem value="Khẩn Cấp">Khẩn Cấp</MenuItem>
                    </Select>
                </FormControl>
                <List >
                    {
                        filteredData.map((item, key) => (<ListItem>
                            <Paper sx={{ bgcolor: "", padding: 2, margin: 'auto' }}>
                                <Stack direction={'row'} gap={1} alignItems={"center"} marginBottom={2}>
                                    <Typography variant="h6" sx={{ textTransform: "none", color: "red" }}>{item.title}</Typography>
                                    <Paper sx={{ padding: 0.5, bgcolor: item.statusDonation === "Khẩn Cấp" ? "red" : "lightgreen" }}>{item.statusDonation}</Paper>
                                </Stack>
                                <Stack direction={'row'} gap={2} flexWrap={'wrap'} marginBottom={2}>
                                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                                        <Typography fontWeight={'bold'}>Họ Tên:</Typography>
                                        <Typography sx={{ textTransform: "none" }}>{item.name}</Typography>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                                        <Typography fontWeight={'bold'}>Địa Chỉ: </Typography>
                                        <Typography sx={{ textTransform: "none" }}>{item.address}</Typography>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                                        <Typography fontWeight={'bold'}>Nhóm Máu: </Typography>
                                        <Typography sx={{ textTransform: "none" }}>{item.bloodType}</Typography>
                                    </Stack>
                                </Stack>
                                <Button variant="outlined" sx={{ marginBottom: 2 }} onClick={() => handleOpenDialog(item)}>Xem Chi Tiết</Button>
                                <Stack direction={'row'} gap={2}>
                                    <Button variant="contained" color="success">Chấp Nhận</Button>
                                    <Button variant="outlined" color="error">Từ Chối</Button>
                                </Stack>
                            </Paper>
                        </ListItem>)
                        )
                    }
                </List>
            </Stack>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Thông tin chi tiết</DialogTitle>
                <DialogContent>
                    {item && (
                       <Box></Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}