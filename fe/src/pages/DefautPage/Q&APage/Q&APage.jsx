import React from 'react';
import {
  Typography,
  Box,
} from '@mui/material';
import ImportantNotes from '../../../components/ImportantNotes';
import { importantNotes } from "./importantNotes.jsx";

// const importantNotes = [
//   {
//     question: '1. Ai có thể tham gia hiến máu?',
//     answer: (
//       <>
//         <Typography>- Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.</Typography>
//         <Typography>- Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.</Typography>
//         <Typography>- Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.</Typography>
//         <Typography>- Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.</Typography>
//         <Typography>- Có giấy tờ tùy thân.</Typography>
//       </>
//     ),
//   },
//   {
//     question: '2. Ai là người không nên hiến máu',
//     answer: <Typography>...</Typography>,
//   },
//   {
//     question: '3. Máu của tôi sẽ được làm những xét nghiệm gì?',
//     answer: <Typography>...</Typography>,
//   },
//   {
//     question: '4. Máu gồm những thành phần và chức năng gì?',
//     answer: <Typography>...</Typography>,
//   },
// ];

export default function QuestionAndAnswer() {
 return (
  <Box sx={{margin : '120px', padding: '0 100'}}>
    <ImportantNotes data={importantNotes} />
  </Box>
 );
} 