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
  Filler,
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
  Title,
  Filler
);

export default function InventoryReports() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/api/inventory')
      .then(res => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load inventory data', err);
        setIsLoading(false);
      });
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
        label: 'Items Expiring',
        data: expiryStats,
        borderColor: 'rgba(220, 38, 38, 1)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(220, 38, 38, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const quantityChart = {
    labels: items.map(i => i.name),
    datasets: [{
      label: 'Available Quantity',
      data: items.map(i => i.quantityAvailable),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 1)',
    }],
  };

  const lowStockChart = {
    labels: ['Low Stock', 'Sufficient'],
    datasets: [{
      label: 'Stock Status',
      data: [lowStockItems.length, items.length - lowStockItems.length],
      backgroundColor: ['#f87171', '#34d399'],
      borderWidth: 1,
      borderColor: ['#ef4444', '#10b981'],
    }],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Analytics</h1>
            <p className="text-gray-500 mt-1">Real-time insights into your inventory status</p>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg shadow-xs border border-gray-200">
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Total Items</h2>
                <p className="text-2xl font-bold text-gray-800">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Low Stock</h2>
                <p className="text-2xl font-bold text-gray-800">{lowStockItems.length}</p>
                <p className="text-xs text-yellow-600 mt-1">{lowStockItems.length > 0 ? 'Action needed' : 'All good'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-50 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Out of Stock</h2>
                <p className="text-2xl font-bold text-gray-800">{outOfStockItems.length}</p>
                {outOfStockItems.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">Urgent attention needed</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-50 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Near Expiry</h2>
                <p className="text-2xl font-bold text-gray-800">{nearExpiryItems.length}</p>
                {nearExpiryItems.length > 0 && (
                  <p className="text-xs text-pink-600 mt-1">Check expiry dates</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Date Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expiry Date Tracking</h2>
              <p className="text-sm text-gray-500">Items expiring in the next 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-gray-500">Expiring Items</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Line
              data={expiryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                      stepSize: 1,
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                },
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
                }
              }}
            />
          </div>
        </div>

        {/* Quantity and Low Stock Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Available Quantity per Item</h2>
                <p className="text-sm text-gray-500">Current stock levels across all items</p>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Live Data</span>
            </div>
            <div className="h-80">
              <Bar
                data={quantityChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)',
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Stock Status Overview</h2>
                <p className="text-sm text-gray-500">Low stock vs sufficient stock items</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Inventory Health</span>
            </div>
            <div className="h-80 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64">
                <Doughnut
                  data={lowStockChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '75%',
                  }}
                />
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Low Stock: {lowStockItems.length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Sufficient: {items.length - lowStockItems.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}