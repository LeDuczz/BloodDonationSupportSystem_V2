
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminNavBar from "./AdminNavBar";
import RequireAuth from "../../components/RequireAuth";

export default function AdminLayout() {
  const HEADER_HEIGHT = 72; 
const SIDEBAR_WIDTH = 280; 
  return (
    <RequireAuth role={"ROLE_ADMIN"}>
<>



      <Box
        sx={{
          position: 'fixed',
          top:0,
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          bgcolor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          zIndex: 1200,
        }}
      >
        <AdminNavBar />
      </Box>
     
      <Box
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
 
         
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </>

    </RequireAuth>
  );
}
