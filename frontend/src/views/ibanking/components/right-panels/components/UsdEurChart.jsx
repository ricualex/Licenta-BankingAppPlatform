import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UsdEurChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Exchange Rate',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [error, setError] = useState('');

  const fetchData = async (from, to) => {
    try {
      const response = await axios.get('http://localhost:8080/api/getExchangeRate', {
        params: { from, to },
      });

      if (response.data['Note']) {
        setError('API request limit exceeded. Please try again later.');
        return;
      }

      const forexData = response.data['Time Series FX (Daily)'];
      const dates = Object.keys(forexData);
      const rates = dates.map((date) => forexData[date]['4. close']);

      setChartData({
        labels: dates.reverse(),
        datasets: [
          {
            label: `${from}/${to} Exchange Rate`,
            data: rates.reverse(),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      });
      setError('');
    } catch (error) {
      console.error('Error fetching the forex data', error);
      setError('An error occurred while fetching data.');
    }
  };

  useEffect(() => {
    fetchData(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white'
        }
      },
      y: {
        ticks: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div>
      <h2 style={{ color: 'white' }}>Exchange Rate</h2>
      <div>
        <label style={{ color: 'white' }}>
          From:
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="RON">RON</option>
          </select>
        </label>
        <label style={{ color: 'white' }}>
          To:
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="RON">RON</option>
          </select>
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default UsdEurChart;
