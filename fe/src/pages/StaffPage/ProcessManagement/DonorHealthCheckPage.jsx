
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import FilterBarHealthCheck from '../ProcessManagement/FilterBarHealthCheck';
import DonorTableHealthCheck from '../ProcessManagement/DonorTableHealthCheck';
import UpdateHealthCheck from '../ProcessManagement/UpdateHealthCheck';
import CancelDonor from '../ProcessManagement/CancelDonor';
import { getHealthChecksApi } from '../../../api/healthcheckService';




export default function DonorHealthCheckPage() {

  const [donors, setDonors] = useState([]);
  const [error, setError] = useState(null);

  const fetchHealthChecks = async () => {
      try {
        const response = await getHealthChecksApi();

        const urgencyPriority = {
          "CỰC KÌ KHẨN CẤP": 1,
          "RẤT KHẨN CẤP": 2,
          "KHẨN CẤP": 3,
          "THÔNG THƯỜNG": 4,
        };

        const sortedDonors = response.data.data
          .map((item) => ({
            ...item,
            levelOfUrgency: item.levelOfUrgency || "BÌNH THƯỜNG",
          }))
          .sort((a, b) => {
            const priorityA = urgencyPriority[a.levelOfUrgency] || 4;
            const priorityB = urgencyPriority[b.levelOfUrgency] || 4;
            return priorityA - priorityB;
          });

        setDonors(sortedDonors);
      } catch (err) {
        console.error("Lỗi gọi API health checks:", err);
        setError("Không thể tải danh sách kiểm tra sức khỏe.");
      }
    };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [cancelDonorOpen, setCancelDonorOpen] = useState(false);
  const [selectedCancelDonor, setSelectedCancelDonor] = useState(null);



  // ✅ Lọc dữ liệu theo search và filter
  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.donorFullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || donor.registrationDate.startsWith(dateFilter);

    const urgency = donor.levelOfUrgency || "BÌNH THƯỜNG"; // Gán mặc định nếu null

    const matchesPriority =
      priorityFilter === "all" ||
      (priorityFilter === "BÌNH THƯỜNG" && urgency === "BÌNH THƯỜNG") ||
      urgency === priorityFilter;
    return matchesSearch && matchesDate && matchesPriority;
  });

  const handleCancelDonorClick = (donor) => {
    setSelectedCancelDonor(donor);
    setCancelDonorOpen(true);
  };

  const handleSaveDonor = (updatedDonor) => {
    setDonors((prev) =>
      prev.map((d) => (d.donationRegistrationId === updatedDonor.donationRegistrationId ? updatedDonor : d))
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {/* ✅ Thanh tìm kiếm + lọc */}
      <Box mb={3} mt={3}>
        <FilterBarHealthCheck
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </Box>

      {/* ✅ Bảng danh sách */}
      <DonorTableHealthCheck donors={filteredDonors} onEditDonor={setSelectedDonor} onCancelDonor={handleCancelDonorClick} />

      {/* ✅ Dialog cập nhật */}
      <UpdateHealthCheck
        isOpen={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        donor={selectedDonor}
        onSave={fetchHealthChecks}
        onDonorChange={(updated) => setSelectedDonor(updated)}
      />

      <CancelDonor
        open={cancelDonorOpen}
        onClose={() => setCancelDonorOpen(false)}
        donor={selectedCancelDonor}
        onReload={fetchHealthChecks}
      />
    </Container>
  );
}