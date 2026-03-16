import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Divider, useTheme, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ManagementAPI } from '../../../api/ManagementAPI';

const BloodVolumeChart = () => {
  const theme = useTheme();

  const [monthlyBloodVolumeData, setMonthlyBloodVolumeData] = useState({ labels: [], series: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' }, { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' }, { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' }, { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' }, { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' },
  ];

  const fetchBloodVolumeData = async (year, month) => {
    setLoading(true);
    try {
      
      const response = await ManagementAPI.getBloodDataByYearAndMonthForChart(year, month);
      
      
      const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const labels = allBloodTypes;
      
      
      const bloodVolumeData = response.data || {};
      const data = allBloodTypes.map(bt => bloodVolumeData[bt] || 0);
      
      const newSeries = [{
        label: 'Thể tích (ml)',
        data,
      }];
      
      setMonthlyBloodVolumeData({ labels, series: newSeries });
    } catch (error) {
      console.error('Error fetching blood volume data:', error);
      
      const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const labels = allBloodTypes;
      const data = allBloodTypes.map(() => 0);
      
      setMonthlyBloodVolumeData({ 
        labels, 
        series: [{ label: 'Thể tích (ml)', data }] 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodVolumeData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: theme.palette.background.paper, boxShadow: 3, mt: 3 }}>
      <Typography variant="h6" mb={2} color="primary.main" fontWeight={600}>
        Thống kê thể tích máu 
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select 
                value={selectedYear} 
                label="Năm" 
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={loading}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tháng</InputLabel>
              <Select 
                value={selectedMonth} 
                label="Tháng" 
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={loading}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </Stack>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <BarChart
            xAxis={[{ 
              scaleType: 'band', 
              data: monthlyBloodVolumeData.labels
            }]}
            series={monthlyBloodVolumeData.series}
            width={Math.max(600, monthlyBloodVolumeData.labels.length * 100)}
            height={400}
          />
        )}
      </Box>
    </Paper>
  );
};

export default BloodVolumeChart; 