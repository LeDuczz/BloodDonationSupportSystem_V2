import { Box, Container, Typography, Button } from "@mui/material";

import BloodInformation from "./HomePageDetails/BloodInformation";
import Blog from "./HomePageDetails/Blog";
import Banner from "./HomePageDetails/SlideShow";
import DonationTips from "./HomePageDetails/DonationTip";
import EmergencyBloodList from "./HomePageDetails/EmergencyBloodList";
import BloodDonationRegister from "./HomePageDetails/BloodDonationRegister";
import QuestionAndAnswer from "../Q&APage/Q&APage";

import BloodTypeSearch from "../../../components/BloodTypeSearch";
import BloodCompatibility from "../../../components/BloodCompatibility";
import { importantNotes } from "../Q&APage/importantNotes";
import ImportantNotes from "../../../components/ImportantNotes1";


export default function Home() {

  const previewNotes = importantNotes.slice(0, 4);


  return (
    <>
      <Container maxWidth={false} style={{ padding: 0 }}>
        <Box
          sx={{
            width: "100%",
            margin: "0 auto",
            borderRadius: 2,
            height: "auto",
          }}
        >
          <Banner />
        </Box>
      </Container>

      <BloodDonationRegister />


      <Box sx={{ paddingX: 2, display: "flex", justifyContent: "center" }}>
        <EmergencyBloodList></EmergencyBloodList>
      </Box>
    <BloodCompatibility/>
   


      <Box sx={{ marginTop: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
        <Box
          component="section"
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2">
            <Container>
              <BloodInformation></BloodInformation>
            </Container>
          </Typography>
        </Box>

        {/* <Blog></Blog> */}
        <Box sx={{ px: 2, mt: 4 }}>
          <ImportantNotes data={previewNotes} />
        </Box>
        

        <Box
          sx={{
            background: "#87ceeb",
          }}
        >
          <DonationTips />
        </Box>
      </Box>
    </>
  );
}
