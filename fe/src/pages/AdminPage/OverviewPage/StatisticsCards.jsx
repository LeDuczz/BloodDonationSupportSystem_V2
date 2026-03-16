import React from 'react';
import { Grid, Paper, Typography, Tooltip, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

const cardData = [
  {
    label: 'Tài khoản',
    icon: <PeopleIcon fontSize="large" color="primary" />, 
    tooltip: 'Tổng số tài khoản trong hệ thống',
    color: 'primary.main',
    bg: 'primary.lighter',
    key: 'numberAccount',
  },
  {
    label: 'Đăng ký hiến máu',
    icon: <AssignmentTurnedInIcon fontSize="large" color="info" />, 
    tooltip: 'Tổng số lượt đăng ký hiến máu',
    color: 'info.main',
    bg: 'info.lighter',
    key: 'numberBloodDonationsRegistration',
  },
  {
    label: 'Hiến máu thành công',
    icon: <CheckCircleIcon fontSize="large" color="success" />, 
    tooltip: 'Số lượt hiến máu thành công',
    color: 'success.main',
    bg: 'success.lighter',
    key: 'numberSuccessDonation',
  },
  {
    label: 'Hiến máu thất bại',
    icon: <CancelIcon fontSize="large" color="error" />, 
    tooltip: 'Số lượt hiến máu không thành công',
    color: 'error.main',
    bg: 'error.lighter',
    key: 'numberFailureDonation',
  }
];

const StatisticsCards = ({ values }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3} justifyContent="center" mb={4}>
      {cardData.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Tooltip title={card.tooltip} arrow>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 3,
                background: theme.palette[card.bg?.split('.')?.[0]]?.[card.bg?.split('.')?.[1]] || theme.palette.background.paper,
                boxShadow: `0 4px 24px 0 ${theme.palette[card.color?.split('.')?.[0]]?.[card.color?.split('.')?.[1]]}22`,
                minHeight: 170,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-6px) scale(1.03)' },
              }}
            >
              {card.icon}
              <Typography variant="subtitle1" mt={1} color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h3" fontWeight={700} color={card.color} mt={1}>
                {values[card.key]}
              </Typography>
            </Paper>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsCards; 