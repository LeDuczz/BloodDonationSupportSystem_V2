import React from 'react';
import BloodStorageTable from "./BloodStorageTable"; 
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
function BloodStoragePage() {
  
    
    const navigate = useNavigate();
  

    return (
      <Box>
        <BloodStorageTable
           onViewDashBoard={() => navigate('/staff/storage/blood-bag-list')}
        />     
      </Box>
    );
  }
  
  export default BloodStoragePage;