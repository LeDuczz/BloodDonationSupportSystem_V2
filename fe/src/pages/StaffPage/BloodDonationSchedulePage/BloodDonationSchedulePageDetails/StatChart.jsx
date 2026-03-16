import { Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale, 
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale, 
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function StatChart({ stats, selectedDate }) {
  const chartData = {
    labels: stats.map((day) => new Date(day.date).toLocaleDateString("vi-VN")),
    datasets: [
      {
        label: "Số đơn đăng ký",
        data: stats.map((day) => day.total),
        backgroundColor: stats.map((day) =>
          day.date === selectedDate
            ? "rgba(255, 99, 132, 0.8)"
            : "rgba(54, 162, 235, 0.5)"
        ),
        borderColor: stats.map((day) =>
          day.date === selectedDate
            ? "rgba(255, 99, 132, 1)"
            : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} đơn`,
        },
      },
      title: {
        display: true,
        text: "Thống kê số đơn đăng ký",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng đơn" },
        ticks: { stepSize: 10, precision: 10 },
      },
      x: {
        title: { display: true, text: "Ngày" },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 60,
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ mt: 4, padding: 2, height: 500 }}>
      <Bar data={chartData} options={chartOptions} />
    </Paper>
  );
}
