import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  CircularProgress, 
  Button, 
  Card, 
  CardContent, 
  Avatar,
  TextField,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ManagementAPI } from '../../../api/ManagementAPI';
import { People } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';


const donationColumns = [
  { field: 'stt', headerName: 'STT', width: 70, sortable: false },
  { field: 'staffName', headerName: 'Tên nhân viên', width: 180, sortable: false },
  { field: 'staffPhone', headerName: 'SĐT nhân viên', width: 150, sortable: false },
  { field: 'donorName', headerName: 'Tên người hiến', width: 180, sortable: false },
  { field: 'donorPhone', headerName: 'SĐT người hiến', width: 150, sortable: false },
  { field: 'donorMail', headerName: 'Email người hiến', width: 200, sortable: false },
  { field: 'donationDate', headerName: 'Ngày hiến máu', width: 150, sortable: false },
  { field: 'status', headerName: 'Trạng thái', width: 150, sortable: false },
];


const emergencyColumns = [
  { field: 'stt', headerName: 'STT', width: 70, sortable: false },
  { field: 'staffName', headerName: 'Tên nhân viên', width: 180, sortable: false },
  { field: 'staffPhone', headerName: 'SĐT nhân viên', width: 150, sortable: false },
  { field: 'patientName', headerName: 'Tên bệnh nhân', width: 180, sortable: false },
  { field: 'patientPhone', headerName: 'SĐT bệnh nhân', width: 150, sortable: false },
  { field: 'note', headerName: 'Ghi chú', width: 180, sortable: false },
  { field: 'donorName', headerName: 'Tên người hiến', width: 180, sortable: false },
  { field: 'donorPhone', headerName: 'SĐT người hiến', width: 150, sortable: false },
  { field: 'donorMail', headerName: 'Email người hiến', width: 200, sortable: false },
  { field: 'donationDate', headerName: 'Ngày hiến máu', width: 200, sortable: false },
  { field: 'status', headerName: 'Trạng thái', width: 150, sortable: false },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-report-tabpanel-${index}`}
      aria-labelledby={`staff-report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StaffReport() {
  const [donationRows, setDonationRows] = useState([]);
  const [emergencyRows, setEmergencyRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchStaffReports = async () => {
    if (!startDate || !endDate) return;
 
    setLoading(true);
    try {
      
      
      const [donationResponse, emergencyResponse] = await Promise.all([
        ManagementAPI.getStaffDonationReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')),
        ManagementAPI.getStaffEmergencyReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
      ]);

      
      const donationData = donationResponse.data || [];
      const transformedDonationData = donationData.map((item, index) => ({
        id: index + 1,
        stt: index + 1,
        staffName: item.staffName || '',
        staffPhone: item.staffPhone || '',
        donorName: item.donorName || '',
        donorPhone: item.donorPhone || '',
        donorMail: item.donorEmail || '',
        donationDate: item.donationDate || '',
        status: item.status || '',
      }));
      setDonationRows(transformedDonationData);

    
      const emergencyData = emergencyResponse.data || [];
      const transformedEmergencyData = emergencyData.map((item, index) => ({
        id: index + 1,
        stt: index + 1,
        staffName: item.staffName || '',
        staffPhone: item.staffPhoneNumber || '',
        patientName: item.patientName || '',
        patientPhone: item.patientPhoneNumber || '',
        note: item.note || '',
        donorName: item.donorName || '',
        donorPhone: item.donorPhoneNumber || '',
        donorMail: item.donorEmail || '',
        donationDate: item.donationDate || '',
        status: item.status || '',
      }));
      setEmergencyRows(transformedEmergencyData);
    } catch (error) {
      console.error('Error fetching staff reports:', error);
      setDonationRows([]);
      setEmergencyRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await ManagementAPI.exportStaffReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Error exporting staff report:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchStaffReports();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ p: 2, background: '#f5f6fa', minHeight: '100vh' }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: theme => `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
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
              <People sx={{ fontSize: 32 }} />
            </Avatar>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Báo Cáo Nhân Viên
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Lọc, xuất file và xem chi tiết hoạt động của nhân viên theo khoảng ngày.
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
                color="info"
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

        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="staff report tabs">
            <Tab label="Báo cáo hiến máu" />
            <Tab label="Báo cáo khẩn cấp" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                📊 Báo cáo quản lý hiến máu của nhân viên
              </Typography>
              <DataGrid
                rows={donationRows}
                columns={donationColumns}
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
            </TabPanel>

        
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'error.main' }}>
                🚨 Báo cáo quản lý yêu cầu khẩn cấp của nhân viên
              </Typography>
              <DataGrid
                rows={emergencyRows}
                columns={emergencyColumns}
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
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
} 