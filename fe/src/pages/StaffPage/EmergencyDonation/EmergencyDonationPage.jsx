import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';

import EmerFilterBar from './EmergencyDonationFilterBar';
import EmerList from './EmergencyDonationList';
import { EmergencyRegistrationDialog } from './EmergencyRegistrationDialog';
import { getEmergencyRequests, createEmergencyRequest } from '../../../api/emergencyDonation';
import { Plus } from 'lucide-react';

export default function EmergencyDonationPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [fulfillFilter, setFulfillFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchEmergencyRequests = async () => {
    try {
      const response = await getEmergencyRequests();
      const data = response.data?.data || [];

      const mapped = data.map((item) => ({
        ...item,
        levelOfUrgency: item.levelOfUrgency || "BÌNH THƯỜNG",
      }));

      setRequests(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách yêu cầu khẩn cấp:", err);
      setError("Không thể tải danh sách yêu cầu.");
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);


  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || req.registrationDate?.startsWith(dateFilter);
    const matchesFulfill =
      fulfillFilter === "all" ||
      (fulfillFilter === "true" && req.isFulfill === true) ||
      (fulfillFilter === "false" && req.isFulfill === false);
    const matchesUrgency =
      urgencyFilter === 'all' || req.levelOfUrgency === urgencyFilter;
    return matchesSearch && matchesDate && matchesUrgency && matchesFulfill;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={2}>
        <Typography variant="h5">Trang quản lý yêu cầu hiến máu khẩn cấp</Typography>
      </Box>

      <Box mb={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Plus size={20} />}
          onClick={() => setShowForm(true)}
        >
          Tạo đơn hiến máu khẩn cấp
        </Button>
      </Box>

      <EmergencyRegistrationDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={() => {
          fetchEmergencyRequests();
          setShowForm(false);
        }}
      />

      {/* ✅ Bộ lọc */}
      <Box mb={3}>
        <EmerFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          urgencyFilter={urgencyFilter}
          setUrgencyFilter={setUrgencyFilter}
          fulfillFilter={fulfillFilter}
          setFulfillFilter={setFulfillFilter}

        />
      </Box>

      {/* ✅ Danh sách */}
      <EmerList data={filteredRequests} />
    </Container>
  );
}
