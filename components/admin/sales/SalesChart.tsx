"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import type { DailySales } from "@/lib/api/sales";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SalesChartProps {
  data: DailySales[];
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((item) => dayjs(item.date).format("MM/DD")),
    datasets: [
      {
        label: "매출",
        data: data.map((item) => item.total_amount),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => `${Number(value).toLocaleString()}원`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} redraw={true} />;
}