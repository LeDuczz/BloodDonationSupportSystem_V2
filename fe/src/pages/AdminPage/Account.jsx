import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material';

export default function Account() {

    const [phone, setPhone] = useState('0901234567');
    const [password, setPassword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setEditMode(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <Box sx={{ p: 2, background: '#f5f6fa', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, margin: '32px auto' }}>
                <Typography variant="h5" textAlign={'center'} fontWeight={700} mb={2}>
                    Tài Khoản Quản Trị
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        label="Số điện thoại"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                    />
                    <TextField
                        label="Mật khẩu"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        helperText={editMode ? 'Nhập mật khẩu mới nếu muốn thay đổi' : ''}
                    />
                    <Stack direction="row" spacing={2} justifyContent="center">
                        {editMode ? (
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave}>
                                    Lưu
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={() => setEditMode(true)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Stack>
                    {success && (
                        <Typography color="success.main" textAlign="center">
                            Đã lưu thay đổi!
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Box>
    )
}