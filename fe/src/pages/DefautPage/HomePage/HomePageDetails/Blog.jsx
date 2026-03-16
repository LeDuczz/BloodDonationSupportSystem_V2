import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImportantNotes from "../../../../components/ImportantNotes";



  

const importantNotes = [
  {
    question: "Kinh nghiệm đi hiến máu lần đầu",
    answer: (
      <>
        <Typography>Nếu bạn lần đầu đi hiến máu, hãy chuẩn bị giấy tờ tùy thân, nghỉ ngơi đầy đủ trước ngày hiến máu và uống nhiều nước. Đừng quá lo lắng vì quá trình hiến máu rất nhanh và an toàn.</Typography>
      </>
    ),
  },
  {
    question: 'Chế độ ăn trước và sau hiến máu',
    answer: <Typography>Trước khi hiến máu, bạn nên ăn nhẹ, tránh đồ chiên nhiều dầu mỡ và không uống rượu bia. Sau hiến máu, hãy uống nhiều nước, ăn thức ăn giàu sắt như thịt đỏ, rau xanh đậm và nghỉ ngơi hợp lý.</Typography>,
  },
  {
    question: 'Vì sao nên hiến máu định kỳ?',
    answer: <Typography>Hiến máu định kỳ giúp kích thích tủy xương sản sinh máu mới, kiểm tra sức khỏe định kỳ miễn phí và quan trọng nhất là góp phần cứu sống người bệnh cần máu.</Typography>,
  },
  {
    question: 'Câu chuyện truyền cảm hứng',
    answer: <Typography>Một người mẹ trẻ đã vượt qua cơn nguy kịch sau sinh nhờ những đơn vị máu kịp thời từ người hiến máu. Câu chuyện là minh chứng cho sức mạnh của lòng nhân ái và sự sẻ chia trong cộng đồng.</Typography>,
  },
  {
    question: 'Hiểu đúng về các nhóm máu',
    answer: <Typography>Có 4 nhóm máu chính là A, B, AB, và O. Người nhóm máu O là người cho phổ quát, còn nhóm máu AB là người nhận phổ quát. Biết rõ nhóm máu của mình giúp bạn chủ động hơn trong các tình huống y tế.</Typography>,
  },
];


const Blog = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Blog Chia Sẻ Kinh Nghiệm
      </Typography>

     <ImportantNotes data={importantNotes}/>
    </Container>
  );
};

export default Blog;
