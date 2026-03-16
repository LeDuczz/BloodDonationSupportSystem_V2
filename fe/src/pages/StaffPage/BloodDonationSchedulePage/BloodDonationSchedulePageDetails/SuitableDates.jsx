import { Box, Typography, Button } from "@mui/material";

export default function SuitableDates({ filteredDays, setSelectedDate, setForm }) {
  if (filteredDays.length === 0) return null;

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" fontWeight="bold">
        Các ngày phù hợp:
      </Typography>
      <Box component="ul" sx={{ paddingLeft: 3 }}>
        {filteredDays.map((day) => (
          <li key={day.date} style={{ marginBottom: 8 }}>
            <Typography component="span">
              {new Date(day.date).toLocaleDateString("vi-VN")} - {day.total} đơn
            </Typography>
            <Button
              onClick={() => {
                setSelectedDate(day.date);
                setForm((prev) => ({ ...prev, date: day.date }));
              }}
              size="small"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Chọn ngày này
            </Button>
          </li>
        ))}
      </Box>
    </Box>
  );
}
