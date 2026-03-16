import React, { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import FilterBarDonor from './FilterBarDonor';
import RegistrationList from './RegistrationList';
import CancelDonor from './CancelDonor';
import ApproveDonor from './ApproveDonor';
import { getRegistrationList } from '../../../api/donationRegistration';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export default function RegistrationPage() {
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState(null);

  const fetchDonors = async () => {
    try {
      const response = await getRegistrationList();

      const urgencyPriority = {
        "CỰC KÌ KHẨN CẤP": 1,
        "RẤT KHẨN CẤP": 2,
        "KHẨN CẤP": 3,
        "BÌNH THƯỜNG": 4,
      };

      const sorted = response.data.data
        .map((item) => ({
          ...item,
          levelOfUrgency: item.levelOfUrgency || "BÌNH THƯỜNG",
        }))
        .sort((a, b) => {
          const priorityA = urgencyPriority[a.levelOfUrgency] || 4;
          const priorityB = urgencyPriority[b.levelOfUrgency] || 4;
          return priorityA - priorityB;
        });

      setDonors(sorted);
    } catch (err) {
      console.error("Lỗi khi gọi API danh sách người hiến máu:", err);
      setError("Không thể tải danh sách người hiến máu.");
    }
  };

  useEffect(() => {
    fetchDonors();

    const socket = new SockJS(SOCKET_URL);
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe('/emergency/unassigned-list', (message) => {
          const newDonor = JSON.parse(message.body);
          setDonors((prev) => [newDonor, ...prev]);
        });
      },
    });

    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.donorFullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || donor.registrationDate.startsWith(dateFilter);
    const urgency = donor.levelOfUrgency || "BÌNH THƯỜNG";
    const matchesPriority =
      priorityFilter === "all" || urgency === priorityFilter;
    return matchesSearch && matchesDate && matchesPriority;
  });

  const handleCancel = (donor) => {
    setCancelTarget(donor);
    setCancelDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} mt={3}>
        <FilterBarDonor
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </Box>

      <RegistrationList
        donors={filteredDonors}
        onEditDonor={setSelectedDonor}
        onCancelDonor={handleCancel}
      />

      <ApproveDonor
        open={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        donor={selectedDonor}
        onReload={fetchDonors}
      />


      <CancelDonor
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        donor={cancelTarget}
        onReload={fetchDonors}
      />
    </Container>
  );
}
