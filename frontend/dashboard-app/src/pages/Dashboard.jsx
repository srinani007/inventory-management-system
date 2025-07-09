import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const { user } = useAuth();
  const isAdminOrManager = user?.roles?.some(role => ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role));
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/api/inventory')
      .then(res => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setItems([]);
        setIsLoading(false);
      });
  }, []);


useEffect(() => {
api.get('/api/orders')
  .then(res => setOrders(res.data.reverse()))
  .catch(() => setOrders([]));
}, []);

  const lowStockItems = items.filter(item => item.quantityAvailable <= item.reorderLevel);
  const outOfStock = items.filter(item => item.quantityAvailable === 0);
  const nearExpiry = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const now = new Date();
    return (expiry - now) / (1000 * 60 * 60 * 24) <= 30;
  });

  const quantityChart = {
    labels: items.map(i => i.name),
    datasets: [{
      label: 'Available Quantity',
      data: items.map(i => i.quantityAvailable),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const stockPieChart = {
    labels: ['Low Stock', 'Sufficient'],
    datasets: [{
      data: [lowStockItems.length, items.length - lowStockItems.length],
      backgroundColor: ['#ef4444', '#10b981'],
      borderWidth: 0,
    }],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="text-indigo-600 font-medium">{user?.username}</span>
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-200">
            <p className="text-sm text-gray-600">Role: <span className="font-medium text-indigo-600">{user?.roles?.join(', ')}</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Items"
            value={items.length}
            icon="📦"
            trend="neutral"
          />
          <StatCard
            label="Total Orders"
            value={orders.length}
            icon="🧾"
            trend="neutral"
          />
          <StatCard
            label="Low Stock"
            value={lowStockItems.length}
            icon="⚠️"
            trend="negative"
          />
          <StatCard
            label="Out of Stock"
            value={outOfStock.length}
            icon="❌"
            trend="negative"
          />
          <StatCard
            label="Near Expiry"
            value={nearExpiry.length}
            icon="📅"
            trend="warning"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Live Data</span>
            </div>
            <div className="h-64">
              <Bar
                data={quantityChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Stock Status</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Overview</span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={stockPieChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                  cutout: '70%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🧾 Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{order.id}</td>
                    <td className="px-6 py-4">{order.skuCode}</td>
                    <td className="px-6 py-4">{order.quantity}</td>
                    <td className={`px-6 py-4 ${order.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>
                      {order.status}
                    </td>
                    <td className="px-6 py-4">{order.placedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Recent Items Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Added Items</h2>
            <Link
              to="/inventory"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.slice(0, 5).map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.skuCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.quantityAvailable === 0 ? 'bg-red-100 text-red-800' :
                          item.quantityAvailable <= item.reorderLevel ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.quantityAvailable}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantityAvailable === 0 ? 'Out of Stock' :
                       item.quantityAvailable <= item.reorderLevel ? 'Low Stock' : 'In Stock'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard
            title="Inventory Management"
            desc="View, edit, and manage all inventory items."
            link="/inventory"
            icon="📋"
          />
          {isAdminOrManager && (
            <NavCard
              title="Add New Product"
              desc="Add new items to your inventory."
              link="/inventory/new"
              icon="➕"
            />
          )}
          <NavCard
            title="Analytics & Reports"
            desc="Detailed inventory analytics and reporting."
            link="/inventory/reports"
            icon="📈"
          />
          {(user?.roles?.includes('ROLE_MANAGER') || user?.roles?.includes('ROLE_WAREHOUSE_STAFF')) && (
            <NavCard
              title="Place Order"
              desc="Submit a new order for stock items."
              link="/orders/new"
              icon="🛒"
            />
          )}
          {user?.roles?.includes('ROLE_ADMIN') && (
            <NavCard
              title="Manage Users"
              desc="View all registered users and their roles."
              link="/users"
              icon="🛡️"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }) {
  const trendColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    neutral: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${trendColors[trend]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function NavCard({ title, desc, link, icon }) {
  return (
    <Link
      to={link}
      className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column',  alignItems: 'center' }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-200">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{desc}</p>
          <div className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">
            Get started
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}