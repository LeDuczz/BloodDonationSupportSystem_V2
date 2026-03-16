import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Bloodtype,
  LocalHospital,
  Science,
  Search,
  Favorite,
} from '@mui/icons-material';


const bloodCompatibilityData = {
  'A+': {
    wholeBlood: {
      canReceive: ['A+'],
      canDonate: ['A+', 'AB+'],
      description: 'Nhận toàn bộ máu từ A+. Cho toàn bộ máu cho A+, AB+.'
    },
    redBloodCells: {
      canReceive: ['A+', 'A-', 'O+', 'O-'],
      canDonate: ['A+', 'AB+'],
      description: 'Nhận được từ A+, A-, O+, O-. Cho được A+, AB+.'
    },
    plasma: {
      canReceive: ['A+', 'AB+'],
      canDonate: ['A+', 'A-', 'O+', 'O-'],
      description: 'Nhận huyết tương từ A+, AB+. Cho huyết tương cho A+, A-, O+, O-.'
    },
    platelets: {
      canReceive: ['A+', 'A-', 'O+', 'O-'],
      canDonate: ['A+', 'AB+'],
      description: 'Nhận tiểu cầu từ A+, A-, O+, O-. Cho tiểu cầu cho A+, AB+.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'A-': {
    wholeBlood: {
      canReceive: ['A-'],
      canDonate: ['A+', 'A-', 'AB+', 'AB-'],
      description: 'Nhận toàn bộ máu từ A-. Cho toàn bộ máu cho A+, A-, AB+, AB-.'
    },
    redBloodCells: {
      canReceive: ['A-', 'O-'],
      canDonate: ['A+', 'A-', 'AB+', 'AB-'],
      description: 'Nhận được từ A-, O-. Cho được A+, A-, AB+, AB-.'
    },
    plasma: {
      canReceive: ['A+', 'A-', 'AB+', 'AB-'],
      canDonate: ['A-', 'O-'],
      description: 'Nhận huyết tương từ A+, A-, AB+, AB-. Cho huyết tương cho A-, O-.'
    },
    platelets: {
      canReceive: ['A-', 'O-'],
      canDonate: ['A+', 'A-', 'AB+', 'AB-'],
      description: 'Nhận tiểu cầu từ A-, O-. Cho tiểu cầu cho A+, A-, AB+, AB-.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'B+': {
    wholeBlood: {
      canReceive: ['B+'],
      canDonate: ['B+', 'AB+'],
      description: 'Nhận toàn bộ máu từ B+. Cho toàn bộ máu cho B+, AB+.'
    },
    redBloodCells: {
      canReceive: ['B+', 'B-', 'O+', 'O-'],
      canDonate: ['B+', 'AB+'],
      description: 'Nhận được từ B+, B-, O+, O-. Cho được B+, AB+.'
    },
    plasma: {
      canReceive: ['B+', 'AB+'],
      canDonate: ['B+', 'B-', 'O+', 'O-'],
      description: 'Nhận huyết tương từ B+, AB+. Cho huyết tương cho B+, B-, O+, O-.'
    },
    platelets: {
      canReceive: ['B+', 'B-', 'O+', 'O-'],
      canDonate: ['B+', 'AB+'],
      description: 'Nhận tiểu cầu từ B+, B-, O+, O-. Cho tiểu cầu cho B+, AB+.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'B-': {
    wholeBlood: {
      canReceive: ['B-'],
      canDonate: ['B+', 'B-', 'AB+', 'AB-'],
      description: 'Nhận toàn bộ máu từ B-. Cho toàn bộ máu cho B+, B-, AB+, AB-.'
    },
    redBloodCells: {
      canReceive: ['B-', 'O-'],
      canDonate: ['B+', 'B-', 'AB+', 'AB-'],
      description: 'Nhận được từ B-, O-. Cho được B+, B-, AB+, AB-.'
    },
    plasma: {
      canReceive: ['B+', 'B-', 'AB+', 'AB-'],
      canDonate: ['B-', 'O-'],
      description: 'Nhận huyết tương từ B+, B-, AB+, AB-. Cho huyết tương cho B-, O-.'
    },
    platelets: {
      canReceive: ['B-', 'O-'],
      canDonate: ['B+', 'B-', 'AB+', 'AB-'],
      description: 'Nhận tiểu cầu từ B-, O-. Cho tiểu cầu cho B+, B-, AB+, AB-.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'AB+': {
    wholeBlood: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['AB+'],
      description: 'Nhận toàn bộ máu từ tất cả các nhóm máu. Chỉ cho toàn bộ máu cho AB+.'
    },
    redBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['AB+'],
      description: 'Nhận được từ tất cả các nhóm máu. Chỉ cho được AB+.'
    },
    plasma: {
      canReceive: ['AB+'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Chỉ nhận huyết tương từ AB+. Cho huyết tương cho tất cả các nhóm máu.'
    },
    platelets: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['AB+'],
      description: 'Nhận tiểu cầu từ tất cả các nhóm máu. Chỉ cho tiểu cầu cho AB+.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'AB-': {
    wholeBlood: {
      canReceive: ['A-', 'B-', 'AB-', 'O-'],
      canDonate: ['AB+', 'AB-'],
      description: 'Nhận toàn bộ máu từ A-, B-, AB-, O-. Cho toàn bộ máu cho AB+, AB-.'
    },
    redBloodCells: {
      canReceive: ['A-', 'B-', 'AB-', 'O-'],
      canDonate: ['AB+', 'AB-'],
      description: 'Nhận được từ A-, B-, AB-, O-. Cho được AB+, AB-.'
    },
    plasma: {
      canReceive: ['AB+', 'AB-'],
      canDonate: ['A-', 'B-', 'AB-', 'O-'],
      description: 'Nhận huyết tương từ AB+, AB-. Cho huyết tương cho A-, B-, AB-, O-.'
    },
    platelets: {
      canReceive: ['A-', 'B-', 'AB-', 'O-'],
      canDonate: ['AB+', 'AB-'],
      description: 'Nhận tiểu cầu từ A-, B-, AB-, O-. Cho tiểu cầu cho AB+, AB-.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'O+': {
    wholeBlood: {
      canReceive: ['O+', 'O-'],
      canDonate: ['A+', 'B+', 'AB+', 'O+'],
      description: 'Nhận toàn bộ máu từ O+, O-. Cho toàn bộ máu cho A+, B+, AB+, O+.'
    },
    redBloodCells: {
      canReceive: ['O+', 'O-'],
      canDonate: ['A+', 'B+', 'AB+', 'O+'],
      description: 'Nhận được từ O+, O-. Cho được A+, B+, AB+, O+.'
    },
    plasma: {
      canReceive: ['O+', 'AB+'],
      canDonate: ['O+', 'O-'],
      description: 'Nhận huyết tương từ O+, AB+. Cho huyết tương cho O+, O-.'
    },
    platelets: {
      canReceive: ['O+', 'O-'],
      canDonate: ['A+', 'B+', 'AB+', 'O+'],
      description: 'Nhận tiểu cầu từ O+, O-. Cho tiểu cầu cho A+, B+, AB+, O+.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  },
  'O-': {
    wholeBlood: {
      canReceive: ['O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Chỉ nhận toàn bộ máu từ O-. Cho toàn bộ máu cho tất cả các nhóm máu.'
    },
    redBloodCells: {
      canReceive: ['O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Chỉ nhận được từ O-. Cho được tất cả các nhóm máu.'
    },
    plasma: {
      canReceive: ['O+', 'O-', 'AB+', 'AB-'],
      canDonate: ['O-'],
      description: 'Nhận huyết tương từ O+, O-, AB+, AB-. Chỉ cho huyết tương cho O-.'
    },
    platelets: {
      canReceive: ['O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Chỉ nhận tiểu cầu từ O-. Cho tiểu cầu cho tất cả các nhóm máu.'
    },
    whiteBloodCells: {
      canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      description: 'Cần xét nghiệm HLA để xác định tương thích chính xác.'
    }
  }
};

const tabLabels = ['Toàn Phần', 'Hồng cầu', 'Huyết tương', 'Tiểu cầu', 'Bạch cầu'];

const BloodCompatibility = () => {
  const theme = useTheme();
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const bloodTypes = Object.keys(bloodCompatibilityData);
  const filteredBloodTypes = bloodTypes.filter(type => type.toLowerCase().includes(search.toLowerCase()));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getComponentData = (bloodType, componentIndex) => {
    const components = ['wholeBlood', 'redBloodCells', 'plasma', 'platelets', 'whiteBloodCells'];
    return bloodCompatibilityData[bloodType]?.[components[componentIndex]];
  };

  return (
    <Box sx={{ py: 6, px: 2, bgcolor: '#f8f9fa' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      
        <Box textAlign="center" sx={{ mb: 5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 2
            }}
          >
            <Search sx={{ fontSize: 36, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Tra Cứu Tương Thích Nhóm Máu
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Tìm kiếm tương thích nhóm máu cho các thành phần máu khác nhau
          </Typography>
        </Box>

     
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Chọn nhóm máu của bạn
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Chọn nhóm máu để xem thông tin tương thích hiến và nhận máu
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm nhóm máu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2}>
            {filteredBloodTypes.map((type) => (
              <Grid key={type}>
                <Button
                  fullWidth
                  variant={selectedBloodType === type ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedBloodType(type)}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {selectedBloodType && (
          <Box mt={5}>
            
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }
                }}
              >
                <Tab icon={<Favorite />} label={tabLabels[0]} />
                <Tab icon={<Bloodtype />} label={tabLabels[1]} />
                <Tab icon={<LocalHospital />} label={tabLabels[2]} />
                <Tab icon={<Science />} label={tabLabels[3]} />
                <Tab icon={<LocalHospital />} label={tabLabels[4]} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
                  {selectedBloodType} - {tabLabels[activeTab]}
                </Typography>

                {(() => {
                  const componentData = getComponentData(selectedBloodType, activeTab);
                  if (!componentData) return null;

                  return (
                    <>
                      <Grid container spacing={3}>
                       
                        <Grid>
                          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'success.light', borderRadius: 2 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom fontWeight={600} color="success.main">
                                Có thể nhận từ:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {componentData.canReceive.map((type) => (
                                  <Chip
                                    key={type}
                                    label={type}
                                    color="success"
                                    variant="filled"
                                    sx={{ fontWeight: 600 }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>

                       
                        <Grid>
                          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'info.light', borderRadius: 2 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom fontWeight={600} color="info.main">
                                Có thể cho:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {componentData.canDonate.map((type) => (
                                  <Chip
                                    key={type}
                                    label={type}
                                    color="info"
                                    variant="filled"
                                    sx={{ fontWeight: 600 }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                    
                      <Box sx={{ mt: 3 }}>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {componentData.description}
                          </Typography>
                        </Alert>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BloodCompatibility; 