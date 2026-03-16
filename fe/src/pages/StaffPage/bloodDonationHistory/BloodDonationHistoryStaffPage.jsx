

import React from 'react';
import BloodDonationHistoryStaffTable from "./BloodDonationHistoryStaffTable";
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
function BloodDonationHistoryStaffPage() {
  
    
    const navigate = useNavigate();
  

    return (
      <Box>
        <BloodDonationHistoryStaffTable
           onViewDashBoard={() => navigate('/staff/blood-donation-history')}
        />     
      </Box>
    );
  }
  
  export default BloodDonationHistoryStaffPage;