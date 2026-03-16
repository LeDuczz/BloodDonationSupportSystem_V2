import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";

import {
  getBloodDonationSchedules,
  getStatByDay,
  createSchedule,
} from "../../../api/bloodDonationSchedule";

import StatChart from "./BloodDonationSchedulePageDetails/StatChart";
import CapacityFilter from "./BloodDonationSchedulePageDetails/CapacityFilter";
import SuitableDates from "./BloodDonationSchedulePageDetails/SuitableDates";
import ScheduleForm from "./BloodDonationSchedulePageDetails/ScheduleForm";
import ScheduleTable from "./BloodDonationSchedulePageDetails/ScheduleTable";
import BloodDonationScheduleCreate from "./BloodDonationSchedulePageDetails/BloodDonationScheduleCreate";
import { formatTimeToString } from "../../../utils/dayFormat";

export default function BloodDonationSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState([]);
  const [inputCapacity, setInputCapacity] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({
    addressHospital: "",
    startTime: null,
    endTime: null,
    amountRegistration: null,
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const selectedDay = stats.find((d) => d.date === selectedDate);
  const existingTotal = selectedDay?.total || 0;

  const filteredDays =
    inputCapacity && Number(inputCapacity) > 0
      ? stats.filter((day) => day.total >= Number(inputCapacity))
      : [];

  const loadSchedules = async () => {
    getBloodDonationSchedules()
      .then((res) => {
        const data = res.data;
        setSchedule(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setSchedule([]));
  };

  useEffect(() => {
    getStatByDay()
      .then((res) => {
        const data = res.data;
        setStats(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setStats([]));

    loadSchedules();
  }, []);

  const handleCreateSchedule = async () => {
    const payload = {
      donationDate: selectedDate,
      addressHospital: form.addressHospital,
      startTime: formatTimeToString(form.startTime),
      endTime: formatTimeToString(form.endTime),
      amountRegistration: form.amountRegistration,
    };
    try {
      await createSchedule(payload);
      setForm({
        addressHospital: "",
        startTime: "",
        endTime: "",
        amountRegistration: "",
      });
      setSelectedDate(null);
      loadSchedules();
    } catch (err) {
      alert("Tạo lỗi!" + err.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Lịch Hiến Máu
      </Typography>
      <Box display='flex' justifyContent='right'>
        <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={() => setOpenCreateDialog(true)}
      >
        + Tạo lịch hiến máu mới
      </Button>
      </Box>
      

      <StatChart stats={stats} selectedDate={selectedDate} />

      <CapacityFilter
        inputCapacity={inputCapacity}
        setInputCapacity={setInputCapacity}
      />

      <SuitableDates
        filteredDays={filteredDays}
        setSelectedDate={setSelectedDate}
        setForm={setForm}
      />

      {selectedDate && (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <ScheduleForm
            selectedDate={selectedDate}
            form={form}
            setForm={setForm}
            inputCapacity={inputCapacity}
            existingTotal={existingTotal}
            handleCreateSchedule={handleCreateSchedule}
          />
        </LocalizationProvider>
      )}

      <ScheduleTable schedule={schedule} />

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tạo Lịch Hiến Máu</DialogTitle>
        <DialogContent>
          <BloodDonationScheduleCreate
            onClose={() => {
              setOpenCreateDialog(false);
              loadSchedules(); 
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
