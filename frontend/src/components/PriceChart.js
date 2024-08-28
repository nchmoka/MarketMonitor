import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';


ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const PriceChart = ({ prices }) => {
  const color = prices[0] > prices[prices.length - 1] ? 'red' : 'green';
  const data = {
    labels: prices.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  return (
    <div style={{ height: "50px", width: "150px" }}>
      <Line data={data} options={options} />
    </div>
  );};

export default PriceChart;