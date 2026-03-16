import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
} from "@mui/material";

// Component chính
export default function BloodDonationInfoView({ data }) {
  // Dữ liệu demo nếu chưa có dữ liệu thật
  const defaultData = {
    fullName: "PHẠM ĐĂNG QUANG",
    idCard: "123456789",
    cccd: "012345678901",
    passport: "",
    dob: "01/01/2000",
    gender: "Nam",
    occupation: "Sinh viên",
    organization: "ĐH Y Dược",
    bloodType: "O+",
    address: "123 Nguyễn Văn A, Q1, TP.HCM",
    phone: "0909123456",
    landline: "",
    email: "quang@example.com",
    answers: {
      q1: "Không",
      q2: "Không",
      q3: "Không",
      q4: "Không",
      q5: "Không",
      q6: "Không",
      q7: "Không",
      q8: "Không",
      q9: "Không",
    },
  };

  const d = data || defaultData;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={3}>
        {/* Thông tin cá nhân */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <InfoRow label="Họ và tên:" value={d.fullName} />
            <InfoRow label="Số CMND:" value={d.idCard} />
            <InfoRow label="Số CCCD:" value={d.cccd} />
            <InfoRow label="Số hộ chiếu:" value={d.passport || "-"} />
            <InfoRow label="Ngày sinh:" value={d.dob} />
            <InfoRow label="Giới tính:" value={d.gender} />
            <InfoRow label="Nghề nghiệp:" value={d.occupation} />
            <InfoRow label="Đơn vị:" value={d.organization} />
            <InfoRow label="Nhóm máu:" value={d.bloodType} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <InfoRow label="Địa chỉ liên hệ:" value={d.address} />
            <InfoRow label="Điện thoại di động:" value={d.phone} />
            <InfoRow label="Điện thoại bàn:" value={d.landline || "-"} />
            <InfoRow label="Email:" value={d.email} />
          </Paper>
        </Grid>

        {/* Phiếu câu hỏi */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Phiếu đăng ký hiến máu
            </Typography>
            {Object.entries(d.answers).map(([key, value], index) => (
              <InfoRow
                key={key}
                label={`${index + 1}. ${getQuestionTitle(index + 1)}`}
                value={value}
              />
            ))}

            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3 }}
              fullWidth
            >
              Xóa đơn đăng ký
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Component hiển thị 1 dòng label + value
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", mb: 1.5 }}>
    <Typography sx={{ fontWeight: "bold", minWidth: 180 }}>{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
);

// Tựa đề câu hỏi hiển thị
const getQuestionTitle = (num) => {
  const titles = {
    1: "Anh/chị từng hiến máu chưa?",
    2: "Hiện tại, anh/chị có mắc bệnh lý nào không?",
    3: "Anh/chị có từng mắc các bệnh: viêm gan B/C, HIV...?",
    4: "Trong 12 tháng gần đây, anh/chị có:",
    5: "Trong 06 tháng gần đây, anh/chị có:",
    6: "Trong 01 tháng gần đây, anh/chị có:",
    7: "Trong 14 ngày gần đây, anh/chị có:",
    8: "Trong 07 ngày gần đây, anh/chị có:",
    9: "Câu hỏi dành cho phụ nữ:",
  };
  return titles[num] || `Câu hỏi ${num}`;
};
