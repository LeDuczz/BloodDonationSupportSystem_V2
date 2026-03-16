import { Box, TextField } from "@mui/material";

export default function CapacityFilter({ inputCapacity, setInputCapacity }) {
  return (
    <Box mt={3} display="flex" alignItems="center" gap={2}>
      <TextField
        label="Số người hiến mong muốn"
        type="number"
        value={inputCapacity < 0 ? "" : inputCapacity}
        onChange={(e) => setInputCapacity(e.target.value)}
      />
    </Box>
  );
}
