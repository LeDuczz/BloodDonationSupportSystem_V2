import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Divider, FormControl, InputLabel, Select, MenuItem, Stack, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { ManagementAPI } from '../../../api/ManagementAPI';

const DonationChart = () => {
  const theme = useTheme();

  const [chartData, setChartData] = useState({ labels: [], successData: [], failedData: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => ({ value: y, label: y }));

  const fetchDonationData = async (year) => {
    setLoading(true);
    try {
 
      const response = await ManagementAPI.getDonationDataByYearForChart(year, 1);
      
      const labels = [];
      const successData = [];
      const failedData = [];
      

      for (let month = 1; month <= 12; month++) {
        const label = `${year}-${month.toString().padStart(2, '0')}`;
        labels.push(label);
        
  
        const monthData = response.data?.[month] || {};
        successData.push(monthData.successCount || 0);
        failedData.push(monthData.failedCount || 0);
      }
      
      setChartData({ labels, successData, failedData });
    } catch (error) {
      console.error('Error fetching donation data:', error);

      const labels = [];
      const successData = [];
      const failedData = [];
      
      for (let month = 1; month <= 12; month++) {
        const label = `${selectedYear}-${month.toString().padStart(2, '0')}`;
        labels.push(label);
        successData.push(0);
        failedData.push(0);
      }
      
      setChartData({ labels, successData, failedData });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationData(selectedYear);
  }, [selectedYear]);



  const filters = [
    { id: 'year', label: 'Năm', value: selectedYear, options: years, handler: setSelectedYear },
  ];

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: theme.palette.background.paper, boxShadow: 3 }}>
      <Typography variant="h6" mb={2} color="primary.main" fontWeight={600}>
        Biểu đồ số lượt hiến máu 
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {filters.map(filter => (
            <FormControl key={filter.id} size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filter.value}
                label={filter.label}
                onChange={(e) => filter.handler(e.target.value)}
                disabled={loading}
              >
                {filter.options.map((option) => (
<MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <LineChart
            xAxis={[{ scaleType: 'point', data: chartData.labels }]}
            series={[
              { 
                data: chartData.successData, 
                label: 'Hiến máu thành công', 
                color: theme.palette.success.main 
              },
              { 
                data: chartData.failedData, 
                label: 'Hiến máu thất bại', 
                color: theme.palette.error.main 
              }
            ]}
            width={Math.max(600, chartData.labels.length * 80)}
            height={320}
          />
        )}
      </Box>
    </Paper>
  );
};

export default DonationChart;