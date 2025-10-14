import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart: React.FC = () => {
  // Dummy data untuk chart
  const chartData = {
    labels: ['KKM', 'Rata-rata', 'Tertinggi', 'Terendah'],
    datasets: [
      {
        label: 'Nilai',
        data: [75, 82, 95, 60],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rata-rata Nilai per Mata Pelajaran',
      },
    },
  };

  return (
    <div className="h-64">
      <div className="flex justify-center items-center">
        <div className="w-full">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Chart;