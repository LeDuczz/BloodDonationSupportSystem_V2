import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ListAltIcon from "@mui/icons-material/ListAlt";

import LogoutIcon from "@mui/icons-material/Logout";
import EmergencyIcon from "@mui/icons-material/Emergency";

import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

import { useLocation } from "react-router-dom";
import { logout } from "../../api/authService";
const StaffSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    logout();
    navigate("/");
  };
  const menuItems = [
    {
      title: "Quản lý",
      items: [
        {
          text: "Yêu cầu hiến máu",
          path: "/staff/request",
          icon: <ListAltIcon />,
        },
        {
          text: "Quản lí hiến máu",
          path: "/staff/blood-management",
          icon: <LocalHospitalIcon />,
        },
        
        {
          text: "Trường hợp khẩn cấp",
          path: "/staff/emergency",
          icon: <EmergencyIcon />,
        },
        {
          text: "Lịch Hiến Máu",
          path: "/staff/blood-donation-schedule",
          icon: <CalendarMonthIcon />,
        },
        {
          text: "Kho máu",
          path: "/staff/storage/blood-bag-list",
          icon: <InventoryIcon />,
        },
        {
          text: "Tìm theo khoảng cách",
          path: "/staff/find-by-distance",
          icon: <LocationOnIcon />,
        },
        {
          text: "Lịch sử hiến máu",
          path: "/staff/blood-donation-history",
          icon: <HistoryIcon />,
        },
      ],
    },
    {
      title: "Cài đặt",
      items: [
        {
          text: "Thông tin cá nhân",
          path: "/staff/profile",
          icon: <PersonIcon />,
        },
        { text: "Đăng xuất", icon: <LogoutIcon /> },
      ],
    },
  ];
  // Get current selected item based on location
  const getCurrentSelectedItem = () => {
    const currentPath = location.pathname;
    for (const section of menuItems) {
      const foundItem = section.items.find(item => item.path === currentPath);
      if (foundItem) return foundItem.text;
    }
    return 'Tổng quan';
  };
  const [selectedItem, setSelectedItem] = useState(getCurrentSelectedItem());

  return (
    <Box
      sx={{
        width: 310,
        bgcolor: "#f8fafc",
        color: "#334155",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        overflow: "hidden",
        borderRight: "1px solid #e2e8f0",
        height: "100vh",
      }}
    >
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {menuItems.map((section, i) => (
          <Box key={section.title || i}>
            {section.title && (
              <Typography
                sx={{
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#64748b",
                  opacity: 0.8,
                }}
              >
                {section.title}
              </Typography>
            )}
            <List sx={{ py: 0 }}>
              {section.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === item.text}
                    onClick={() => {
                      setSelectedItem(item.text);
                      if (item.text === "Đăng xuất") {
                        handleLogout();
                      } else {
                        navigate(item.path);
                      }
                    }}
                    sx={{
                      mx: 1.5,
                      borderRadius: 2,
                      color: selectedItem === item.text ? "#667eea" : "#64748b",
                      minHeight: 48,
                      "&.Mui-selected": {
                        bgcolor: "#eff6ff",
                        borderLeft: "4px solid #667eea",
                        "&:hover": {
                          bgcolor: "#dbeafe",
                        },
                      },
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                        transform: "translateX(4px)",
                        transition: "all 0.2s ease-in-out",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: selectedItem === item.text ? "#667eea" : "#94a3b8",
                        minWidth: 40,
                        transition: "color 0.2s ease-in-out",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: selectedItem === item.text ? 600 : 500,
                          fontSize: "0.9rem",
                          transition: "font-weight 0.2s ease-in-out",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {i < menuItems.length - 1 && (
              <Divider
                sx={{
                  borderColor: "#e2e8f0",
                  mx: 2,
                  my: 2,
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
          bgcolor: "#f8fafc",
          py: 2,
          mt: "auto",
          minHeight: 48,
        }}
      >
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          © 2024 Blood Donation System
        </Typography>
      </Box>
    </Box>


  );
};

export default StaffSidebar;
