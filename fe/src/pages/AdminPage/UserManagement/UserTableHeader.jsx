import React from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Avatar,
  useTheme 
} from "@mui/material";
import { People } from "@mui/icons-material";

const UserTableHeader = () => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        borderRadius: 3
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 56,
              height: 56
            }}
          >
            <People sx={{ fontSize: 32 }} />
          </Avatar>
          <div>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Quản lý người dùng
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Danh sách và quản lý thông tin người dùng trong hệ thống
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserTableHeader;