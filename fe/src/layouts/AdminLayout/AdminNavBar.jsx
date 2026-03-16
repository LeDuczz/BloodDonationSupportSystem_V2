import React, { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Avatar,
    Chip,
} from '@mui/material';


import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmergencyIcon from '@mui/icons-material/Emergency';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext'
import { logout } from '../../api/authService';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loadUser } = useAuth();

    const handleLogout = async () => {
        logout();
        await loadUser();
        navigate("/");
    };

    const menuItems = [
        {
            title: null,
            items: [
                { text: 'Tổng quan', path: '/admin/overview', icon: <DashboardIcon /> },
            ],
        },
        {
            title: 'Quản lý',
            items: [
                { text: 'Người dùng', path: '/admin/user-management', icon: <PeopleIcon /> },
                { text: 'Bài viết', path: '/admin/posts', icon: <ArticleIcon /> },
            ],
        },
        {
            title: 'Báo cáo',
            items: [
                { text: 'Đơn hiến máu', path: '/admin/donation-report', icon: <VolunteerActivismIcon /> },
                { text: 'Kho máu', path: '/admin/blood-inventory-report', icon: <BloodtypeIcon /> },
                { text: 'Yêu cầu khẩn cấp', path: '/admin/emergency-request-report', icon: <EmergencyIcon /> },
                { text: 'Nhân viên', path: '/admin/staff-report', icon: <PeopleIcon /> }
            ],
        }, {
            title: 'Cài đặt',
            items: [

                
                { text: 'Đăng xuất', onClick: handleLogout, icon: <LogoutIcon /> },

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
        <Box sx={{
            width: 280,

            bgcolor: '#f8fafc',
            color: '#334155',
            display: 'flex',
            flexDirection: 'column',
            height: "100vh",
            position: 'fixed',
            overflow: 'hidden',
            borderRight: '1px solid #e2e8f0'
        }}>


            {/* Navigation Menu */}
            <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                {menuItems.map((section, i) => (
                    <Box key={section.title}>
                        <Typography sx={{
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#64748b',
                            opacity: 0.8
                        }}>
                            {section.title}
                        </Typography>
                        <List sx={{ py: 0 }}>
                            {section.items.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                        selected={selectedItem === item.text}
                                        onClick={() => {
                                            setSelectedItem(item.text);
                                            if (item.onClick) {
                                                item.onClick();
                                            } else if (item.path) {
                                                navigate(item.path);
                                            }
                                        }}
                                        sx={{
                                            mx: 1.5,
                                            borderRadius: 2,
                                            color: selectedItem === item.text ? '#667eea' : '#64748b',
                                            minHeight: 48,
                                            '&.Mui-selected': {
                                                bgcolor: '#eff6ff',
                                                borderLeft: '4px solid #667eea',
                                                '&:hover': {
                                                    bgcolor: '#dbeafe',
                                                },
                                            },
                                            '&:hover': {
                                                bgcolor: '#f1f5f9',
                                                transform: 'translateX(4px)',
                                                transition: 'all 0.2s ease-in-out',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            color: selectedItem === item.text ? '#667eea' : '#94a3b8',
                                            minWidth: 40,
                                            transition: 'color 0.2s ease-in-out'
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    fontWeight: selectedItem === item.text ? 600 : 500,
                                                    fontSize: '0.9rem',
                                                    transition: 'font-weight 0.2s ease-in-out'
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        {i < menuItems.length - 1 && (
                            <Divider sx={{
                                borderColor: '#e2e8f0',
                                mx: 2,
                                my: 2
                            }} />
                        )}
                    </Box>
                ))}
                <Box sx={{ 
                borderTop: '1px solid #e2e8f0',
                textAlign: 'center',
                bgcolor: '#f8fafc',
                py: 2,
                mt: 'auto',
                minHeight: 48
            }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    © 2024 Blood Donation System
                </Typography>
            </Box>
            </Box>


            
        </Box>
    );
}
