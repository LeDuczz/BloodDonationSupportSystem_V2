import { useState, useEffect } from 'react';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Stack, Chip, CircularProgress, Button, Card, CardContent, Avatar, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ManagementAPI } from '../../../api/ManagementAPI';
import { LocalHospital } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const columns = [
  { field: 'stt', headerName: 'STT', width: 70, sortable: false },
  { field: 'donorName', headerName: 'Tên người hiến', width: 180, sortable: false },
  { field: 'donorPhone', headerName: 'SĐT người hiến', width: 150, sortable: false },
  { field: 'donorEmail', headerName: 'Email người hiến', width: 200, sortable: false },
  { field: 'donorAddress', headerName: 'Địa chỉ người hiến', width: 200, sortable: false },
  { field: 'bloodType', headerName: 'Nhóm máu', width: 120, sortable: false },
  { field: 'volumeMl', headerName: 'Lượng máu (ml)', width: 150, sortable: false },
  { field: 'donationDate', headerName: 'Ngày hiến máu', width: 150, sortable: false },
  { field: 'hospital', headerName: 'Nơi hiến máu', width: 150, sortable: false },

  { field: 'status', headerName: 'Trạng thái', width: 150, sortable: false },
];

export default function BloodDonationReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchBloodDonationReport = async () => {
    if (!startDate || !endDate) return;
 
    setLoading(true);
    try {
      const response = await ManagementAPI.getBloodDonationReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
      const reportData = response.data || [];
      
      const transformedData = reportData && reportData.map((item, index) => ({
        id: index + 1,
        stt: index + 1,
        donorName: item.donorName || '',
        donorPhone: item.donorPhoneNumber || '',
        donorEmail: item.donorEmail || '',
        donorAddress: item.donorAddress || '',
        bloodType: item.bloodType || '',
        volumeMl: item.sendVolume || 0,
        donationDate: item.donationDate || '',
        hospital: item.hospital || '',
        status: item.status || '',
      }));
      setRows(transformedData);
    } catch (error) {
      console.error('Error fetching blood donation report:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
     
      await ManagementAPI.exportBloodDonationReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchBloodDonationReport();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ p: 2, background: '#f5f6fa', minHeight: '100vh' }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
              <LocalHospital sx={{ fontSize: 32 }} />
            </Avatar>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Báo Cáo Hiến Máu
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Lọc, xuất file và xem chi tiết các lượt hiến máu theo khoảng ngày.
              </Typography>
            </div>
          </Stack>
        </CardContent>
      </Card>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, margin: '32px auto' }}>
        
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
                color="primary"
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
                Khoảng ngày: {format(startDate, 'yy/MM/dd')} - {format(endDate, 'yy/MM/dd')}
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
                backgroundColor: '#e3f2fd',
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
} 