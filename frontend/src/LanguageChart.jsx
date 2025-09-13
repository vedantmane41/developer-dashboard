// src/LanguageChart.jsx

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// We need to register the components we're using with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageChart = ({ wakatimeData }) => {
  // WakaTime API gives us a list of languages. We need to format it for Chart.js.
  const chartData = {
    labels: wakatimeData.languages.map(lang => lang.name),
    datasets: [
      {
        label: 'Time Spent',
        data: wakatimeData.languages.map(lang => lang.total_seconds),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white' // Set legend text color to white
        }
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default LanguageChart;