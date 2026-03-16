
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import DonorTableProcess from '../ProcessManagement/DonorTableProcess';
import UpdateProcess from '../ProcessManagement/UpdateProcess';
import FilterBarProcess from '../ProcessManagement/FilterBarProcess';
import CancelDonor from '../ProcessManagement/CancelDonor';
import { getDonationProcessApi } from '../../../api/donationProcess';


export default function DonorProcessPage() {

  const [donors, setDonors] = useState([]);
  const [error, setError] = useState(null);

  const fetchDonationProcess = async () => {
    try {
      const response = await getDonationProcessApi();

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
      console.error("Error:", err);
      setError("Không thể tải danh sách quản lí tiến trình.");
    }
  };

  useEffect(() => {
    fetchDonationProcess();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [processStatusFilter, setProcessStatusFilter] = useState('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [cancelDonorOpen, setCancelDonorOpen] = useState(false);
  const [selectedCancelDonor, setSelectedCancelDonor] = useState(null);

  // ✅ Lọc dữ liệu theo search và filter
  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.donorFullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProcessStatus = processStatusFilter === 'all' || donor.processStatus === processStatusFilter;
    const matchesDate = !dateFilter || donor.registrationDate.startsWith(dateFilter);
    const urgency = donor.levelOfUrgency || "BÌNH THƯỜNG"; // Gán mặc định nếu null

    const matchesPriority =
      priorityFilter === "all" ||
      (priorityFilter === "BÌNH THƯỜNG" && urgency === "BÌNH THƯỜNG") ||
      urgency === priorityFilter;
    return matchesSearch && matchesProcessStatus && matchesDate && matchesPriority;
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
        <FilterBarProcess
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          processStatusFilter={processStatusFilter}
          setProcessStatusFilter={setProcessStatusFilter}
          bloodTypeFilter={bloodTypeFilter}
          setBloodTypeFilter={setBloodTypeFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      </Box>

      {/* ✅ Bảng danh sách */}
      <DonorTableProcess donors={filteredDonors} onEditDonor={setSelectedDonor} onCancelDonor={handleCancelDonorClick} />

      {/* ✅ Dialog cập nhật */}
      <UpdateProcess
        isOpen={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        donor={selectedDonor}
        onSave={fetchDonationProcess}
        onDonorChange={(updated) => setSelectedDonor(updated)}
      />

      <CancelDonor
        open={cancelDonorOpen}
        onClose={() => setCancelDonorOpen(false)}
        donor={selectedCancelDonor}
        onReload={fetchDonationProcess}
      />
    </Container>
  );
}