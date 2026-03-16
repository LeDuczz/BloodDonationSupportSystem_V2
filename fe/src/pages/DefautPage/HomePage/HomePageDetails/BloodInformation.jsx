import React from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";

const initialItems = [
  {
    title: "Nhóm máu A+",
    image: "/bloodtype/A+.jpg",
    description: "Người có nhóm máu A+ chiếm tỷ lệ lớn trên thế giới và có thể nhận từ A+, A-, O+, O-.",
    populationRate: "34%",
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
  },
  {
    title: "Nhóm máu A-",
    image: "/bloodtype/A-.jpg",
    description: "Người có nhóm máu A- có thể hiến cho A-, A+, AB-, AB+ và chỉ nhận từ A- và O-.",
    populationRate: "6%",
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
  },
  {
    title: "Nhóm máu B+",
    image: "/bloodtype/B+.jpg",
    description: "Người có nhóm máu B+ có thể nhận từ B+, B-, O+, O- và cho B+, AB+.",
    populationRate: "9%",
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
  },
  {
    title: "Nhóm máu B-",
    image: "/bloodtype/B-.jpg",
    description: "Người có nhóm máu B- có thể hiến cho B-, B+, AB-, AB+ và chỉ nhận từ B- và O-.",
    populationRate: "2%",
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
  },
  {
    title: "Nhóm máu AB+",
    image: "/bloodtype/AB+.jpg",
    description: "AB+ là nhóm máu hiếm và là người nhận phổ quát – có thể nhận từ tất cả các nhóm máu.",
    populationRate: "3%",
    canDonateTo: ["AB+"],
    canReceiveFrom: ["Tất cả nhóm máu"],
  },
  {
    title: "Nhóm máu AB-",
    image: "/bloodtype/AB-.jpg",
    description: "Người có nhóm máu AB- có thể nhận từ AB-, A-, B-, O- và cho AB- và AB+.",
    populationRate: "1%",
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
  },
  {
    title: "Nhóm máu O+",
    image: "/bloodtype/O+.jpg",
    description: "Người có nhóm máu O+ là người cho phổ biến và có thể nhận từ O+ và O-.",
    populationRate: "37%",
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    canReceiveFrom: ["O+", "O-"],
  },
  {
    title: "Nhóm máu O-",
    image: "/bloodtype/O-.jpg",
    description: "O- là người cho phổ quát – có thể hiến cho tất cả nhóm máu, nhưng chỉ nhận từ O-.",
    populationRate: "6.6%",
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["O-"],
  },
];

const BloodInformation = () => {

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,

  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>      
        Thông tin nhóm máu
      </Typography>

      <Slider {...settings}>
        {initialItems.map((item, index) => (
          <Box key={index} px={2} py={2}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow: 6,
                
              }}
            >
              <Box
                sx={{
                  height: 200,
                  overflow: "hidden",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{
                    width: "30%",
                    height: "100%",
                    objectFit: "cover",
                    
                  }}
                />
              </Box>

              <CardContent >
                <Typography variant="h6" fontWeight="bold" gutterBottom display={'flex'} justifyContent={'center'}>
                  
                  {item.title}
                </Typography>

                {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.description}
                </Typography> */}

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" >
                  <GroupsIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "primary.main" }} />
                  <strong>Tỉ lệ dân số:</strong>{" "}
                  {item.populationRate}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  <VolunteerActivismIcon sx={{ fontSize: 18, mr: 0.5, color: "red" }} />
                  Có thể cho:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1, mt: 0.5 }}>
                {item.canDonateTo.map((type, idx) => {
                  return (
                    <Chip
                      key={idx}
                      label={type}
                      size="small"
                      variant="outlined"
                      color="error"
                      icon={<FavoriteIcon sx={{ fontSize: 14 }} />}
                    />
                      
                  )
                  
                }) }
                    
                    
                  
                </Stack>

                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  <FavoriteIcon sx={{ fontSize: 18, mr: 0.5, color: "info.main" }} />
                  Có thể nhận:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                  {item.canReceiveFrom.map((type, idx) => (
                    <Chip
                      key={idx}
                      label={type}
                      size="small"
                      variant="outlined"
                      color="primary"
                      icon={<FavoriteIcon sx={{ fontSize: 14 }} />}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default BloodInformation;
