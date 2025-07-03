import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function InventoryReports() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/inventory')
      .then(res => setItems(res.data))
      .catch(err => console.error('Failed to load inventory data', err));
  }, []);

  const lowStockItems = items.filter(item => item.quantityAvailable <= item.reorderLevel);
  const outOfStockItems = items.filter(item => item.quantityAvailable === 0);
  const nearExpiryItems = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const now = new Date();
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  });

  const expiryStats = Array(6).fill(0);
  const now = new Date();
  items.forEach(item => {
    if (!item.expiryDate) return;
    const expiry = new Date(item.expiryDate);
    const diffMonths = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
    if (diffMonths >= 0 && diffMonths < 6) {
      expiryStats[diffMonths]++;
    }
  });

  const expiryChartData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(now.getMonth() + i);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Expiring Items',
        data: expiryStats,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const quantityChart = {
    labels: items.map(i => i.name),
    datasets: [{
      label: 'Available Quantity',
      data: items.map(i => i.quantityAvailable),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }],
  };

  const lowStockChart = {
    labels: ['Low Stock', 'Sufficient'],
    datasets: [{
      label: 'Stock Status',
      data: [lowStockItems.length, items.length - lowStockItems.length],
      backgroundColor: ['#f87171', '#34d399'],
    }],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-indigo-600">📈 Inventory Reports</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded shadow border-l-4 border-indigo-500">
            <h2 className="text-sm text-gray-500">Total Items</h2>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
            <h2 className="text-sm text-gray-500">Low Stock</h2>
            <p className="text-2xl font-bold">{lowStockItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
            <h2 className="text-sm text-gray-500">Out of Stock</h2>
            <p className="text-2xl font-bold">{outOfStockItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-pink-500">
            <h2 className="text-sm text-gray-500">Near Expiry</h2>
            <p className="text-2xl font-bold">{nearExpiryItems.length}</p>
          </div>
        </div>

        {/* Expiry Date Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📆 Expiry Date Tracking</h2>
          <Line data={expiryChartData} />
        </div>

        {/* Quantity and Low Stock Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">📊 Available Quantity per Item</h2>
            <Bar data={quantityChart} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">🔴 Low Stock vs Sufficient</h2>
            <Doughnut data={lowStockChart} />
          </div>
        </div>
      </div>
    </div>
  );
}
