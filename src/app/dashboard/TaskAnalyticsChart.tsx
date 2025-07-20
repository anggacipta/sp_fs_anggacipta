"use client";

import { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TaskAnalyticsChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/tasks")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mb-8">Loading chart...</div>;

  if (!data || data.length === 0) return <div className="mb-8">Belum ada data task.</div>;

  // Hitung total semua task per status
  const totalTodo = data.reduce((sum, p) => sum + (p.todo || 0), 0);
  const totalInProgress = data.reduce((sum, p) => sum + (p.inProgress || 0), 0);
  const totalDone = data.reduce((sum, p) => sum + (p.done || 0), 0);

  const chartData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Jumlah Task",
        data: [totalTodo, totalInProgress, totalDone],
        backgroundColor: ["#facc15", "#60a5fa", "#4ade80"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Task Analytics" },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="mb-8 bg-white p-6 rounded shadow" style={{ maxWidth: 700, margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
