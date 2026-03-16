import axios from "../config/axios";
import { format } from 'date-fns';

export const ManagementAPI = {
  
      getOverviewStatistics: async (year, month) => {
  
    const body = { year, month };
    const res = await axios.post('/admin/report/overview', body);
    return res.data;
  },

  getAllArticles: async () => {
    const res = await axios.get('/homepage/articles');
    return res.data;
  },
  getDonationDataByYearForChart: async (year, month) => {
    const body = { year, month };
    const res = await axios.post('/admin/report/monthly-blood-statistic', body);
    return res.data;
  },
  getBloodDataByYearAndMonthForChart: async (year, month) => {
    const body = { year, month };
    const res = await axios.post('/admin/report/blood-inventory-for-chart', body);
    return res.data;
  },
  exportBloodDonationReport :async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post(
      '/admin/report/blood-donation/export',
      body,
      {
        responseType: 'blob', // để nhận file Excel
      }
    );
  
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'donation_registration_report.xlsx');
    document.body.appendChild(link);
    link.click();
  },
  exportBloodInventory: async () => {
    const response = await axios.get(
      '/admin/report/blood-inventory/export',
      {
        responseType: 'blob', // để nhận file Excel
      }
    );
  
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'blood_inventory_report.xlsx');
    document.body.appendChild(link);
    link.click();
  },
  getBloodInventory: async () => {
    const response = await axios.get('/admin/report/blood-inventory');
    return response.data;
  },
  getBloodDonationReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post('/admin/report/blood-donation', body);
    return response.data;
  },
  
  getEmergencyRequestsByYearForChart: async (year, month) => {
    const body = { year, month };
    const res = await axios.post('/admin/report/monthly-emergency', body);
    return res.data;
  },

 

  getEmergencyBloodRequestReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post('/admin/report/emergency-blood-request', body);
    return response.data;
  },

  exportEmergencyBloodRequestReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post(
      '/admin/report/emergency-blood-request/export',
      body,
      {
        responseType: 'blob',
      }
    );
  
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'emergency_blood_request_report.xlsx');
    document.body.appendChild(link);
    link.click();
  },

 
  getStaffDonationReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post('/admin/report/staff-donation', body);
    return response.data;
  },

  getStaffEmergencyReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post('/admin/report/staff-emergency', body);
    return response.data;
  },

  exportStaffReport: async (startDate, endDate) => {
    const body = { startDate, endDate };
    const response = await axios.post(
      '/admin/report/staff/export',
      body,
      {
        responseType: 'blob',
      }
    );
  
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'staff_report.xlsx');
    document.body.appendChild(link);
    link.click();
  }
}