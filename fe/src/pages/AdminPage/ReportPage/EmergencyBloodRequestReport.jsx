import { useState, useEffect } from 'react';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Stack, Chip, CircularProgress, Button, Card, CardContent, Avatar, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ManagementAPI } from '../../../api/ManagementAPI';
import { Emergency } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const columns = [
  { field: 'stt', headerName: 'STT', width: 70, sortable: false },
  { field: 'registrationDate', headerName: 'Ngày đăng ký', width: 150, sortable: false },
  { field: 'patientName', headerName: 'Tên bệnh nhân', width: 180, sortable: false },
  { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150, sortable: false },
  { field: 'location', headerName: 'Địa điểm', width: 200, sortable: false },
  { field: 'bloodType', headerName: 'Nhóm máu', width: 120, sortable: false },
  { field: 'needVolume', headerName: 'Lượng máu cần (ml)', width: 180, sortable: false },
  { field: 'note', headerName: 'Ghi chú', width: 200, sortable: false },
  { field: 'donorName', headerName: 'Tên người hiến', width: 180, sortable: false },
  { field: 'donorPhone', headerName: 'SĐT người hiến', width: 150, sortable: false },
  { field: 'volumeSend', headerName: 'Lượng máu gửi (ml)', width: 180, sortable: false },
];

export default function EmergencyBloodRequestReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchEmergencyBloodRequestReport = async () => {
    if (!startDate || !endDate) return;
 
    setLoading(true);
    try {
      const response = await ManagementAPI.getEmergencyBloodRequestReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
      const reportData = response.data || [];
      
      const transformedData = reportData && reportData.map((item, index) => ({
        id: index + 1,
        stt: index + 1,
        registrationDate: item.registrationDate || '',
        patientName: item.patientName || '',
        phoneNumber: item.patientPhone || '',
        location: item.locationOfPatient || '',
        bloodType: item.bloodType || '',
        needVolume: item.requestedVolume || 0,
        note: item.note || '',
        donorName: item.donorName || '',
        donorPhone: item.donorPhone || '',
        volumeSend: item.donatedVolume || 0,
      }));
      setRows(transformedData);
    } catch (error) {
      console.error('Error fetching emergency blood request report:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await ManagementAPI.exportEmergencyBloodRequestReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Error exporting emergency blood request report:', error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchEmergencyBloodRequestReport();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ p: 2, background: '#f5f6fa', minHeight: '100vh' }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: theme => `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          color: 'white',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 56,
                height: 56
              }}
            >
              <Emergency sx={{ fontSize: 32 }} />
            </Avatar>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Báo Cáo Yêu Cầu Hiến Máu Khẩn Cấp
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Lọc, xuất file và xem chi tiết các yêu cầu hiến máu khẩn cấp theo khoảng ngày.
              </Typography>
            </div>
          </Stack>
        </CardContent>
      </Card>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1400, margin: '32px auto' }}>
        <Paper elevation={1} sx={{ p: 2, mb: 3, background: '#f8fafc' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="flex-end">
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={setStartDate}
                inputFormat="dd/MM/yy"
                renderInput={(params) => <TextField {...params} size="small" />}
                maxDate={endDate}
              />
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={setEndDate}
                inputFormat="dd/MM/yy"
                renderInput={(params) => <TextField {...params} size="small" />}
                minDate={startDate}
              />
              <Button
                variant="contained"
                color="error"
                onClick={handleExport}
                disabled={loading || exporting}
                startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {exporting ? 'Đang xuất...' : 'Xuất Excel'}
              </Button>
            </Stack>
          </LocalizationProvider>
          
          {startDate && endDate && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Khoảng ngày: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
              </Typography>
            </Box>
          )}
        </Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            hideFooter
            density="compact"
            disableColumnMenu
            disableSelectionOnClick
            sx={{
              background: 'white',
              borderRadius: 2,
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#ffebee',
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
} 