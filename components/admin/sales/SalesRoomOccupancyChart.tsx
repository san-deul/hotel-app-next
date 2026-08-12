"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import type { RoomOccupancy } from "@/lib/api/sales";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesRoomOccupancyChartProps {
  data: RoomOccupancy[];
}

export default function SalesRoomOccupancyChart({
  data,
}: SalesRoomOccupancyChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((item) => item.roomName),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#a855f7",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "left" as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) => {
            const dataset = ctx.dataset.data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const value = ctx.raw as number;
            const percent = ((value / total) * 100).toFixed(1);
            return `${value}건 (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-[320px] w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}