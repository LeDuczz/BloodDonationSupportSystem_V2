import React, { useEffect, useState } from 'react';
import { Typography, Box, useTheme, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Stack, Avatar } from '@mui/material';
import { BarChart } from '@mui/icons-material';
import StatisticsCards from './StatisticsCards';
import DonationChart from './DonationChart';
import BloodVolumeChart from './BloodVolumeChart';
import { ManagementAPI } from '../../../api/ManagementAPI';
import EmergencyRequestLineChart from './EmergencyRequestLineChart';

const OverViewPage = () => {
  const [numberAccount, setNumberAccount] = useState(0);
  const [numberBloodDonationsRegistration, setNumberBloodDonationsRegistration] = useState(0);
  const [numberSuccessDonation, setNumberSuccessDonation] = useState(0);
  const [numberFailureDonation, setNumberFailureDonation] = useState(0);
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const theme = useTheme();

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ManagementAPI.getOverviewStatistics(selectedYear, selectedMonth);
        setNumberAccount(res.data.numberAccount || 0);
        setNumberBloodDonationsRegistration(res.data.numberBloodDonationsRegistration || 0);
        setNumberSuccessDonation(res.data.numberSuccessDonation || 0);
        setNumberFailureDonation(res.data.numberFailureDonation || 0);
      } catch (err) {
        setNumberAccount(0);
        setNumberBloodDonationsRegistration(0);
        setNumberSuccessDonation(0);
        setNumberFailureDonation(0);
      }
    };
    fetchData();
  }, [selectedYear, selectedMonth]);

  const values = {
    numberAccount,
    numberBloodDonationsRegistration,
    numberSuccessDonation,
    numberFailureDonation,
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: theme.palette.background.default, minHeight: '100vh' }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
              <BarChart sx={{ fontSize: 32 }} />
            </Avatar>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Thống kê tổng quan
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Xem nhanh các chỉ số và biểu đồ về hiến máu, kho máu trong hệ thống
              </Typography>
            </div>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="year-select-label">Năm</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Năm"
              onChange={e => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="month-select-label">Tháng</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="Tháng"
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <StatisticsCards values={values} />
      <DonationChart />
      <BloodVolumeChart />
      <EmergencyRequestLineChart/>
    </Box>
  );
};

export default OverViewPage; 