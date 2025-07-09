import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LowStockBadge from '../components/LowStockBadge';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/api/inventory')
      .then(res => {
        setItems(res.data);
        setFilteredItems(res.data);
      })
      .catch(err => {
        console.error('⚠️ Failed to load inventory:', err);
        toast.error('Failed to load inventory.');
      })
      .finally(() => setLoading(false));
  }, [location.pathname]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.skuCode.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (filteredItems.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const worksheet = utils.json_to_sheet(filteredItems);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Inventory');
    writeFile(workbook, 'inventory_export.xlsx');
    toast.success('Inventory exported successfully!');
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#ccc' },
      },
      title: {
        display: true,
        text: 'Inventory Overview',
        color: '#fff',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#bbb' },
        grid: { color: '#333' },
      },
      y: {
        ticks: { color: '#bbb' },
        grid: { color: '#333' },
      },
    },
  };

  const chartData = {
    labels: filteredItems.map(item => item.name),
    datasets: [
      {
        label: 'Quantity Available',
        data: filteredItems.map(item => item.quantityAvailable),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  const lineChartData = {
    labels: filteredItems.map(item => item.name),
    datasets: [
      {
        label: 'Reorder Level',
        data: filteredItems.map(item => item.reorderLevel),
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  if (loading) return <p className="p-6 text-center text-lg text-white">Loading inventory...</p>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 md:px-10 lg:px-16 bg-[url('/background.svg')] bg-cover">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-teal-300 mb-4 md:mb-0">📦 Inventory Dashboard</h1>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <button onClick={() => navigate('/inventory/new')} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow transition">
              ➕ Add New
            </button>
            <button onClick={() => navigate('/inventory/reports')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow transition">
              📊 Reports
            </button>
            <button onClick={exportToCSV} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded shadow transition">
              📤 Export
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by name or SKU..."
          value={search}
          onChange={handleSearch}
          className="w-full mb-8 px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-400"
        />

        {/* Charts */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400">No inventory items found.</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-start gap-8 mb-10 px-4">
              <div className="bg-neutral-900 p-6 rounded-xl shadow-lg w-full md:w-[500px] max-w-[95vw] hover:scale-[1.01] transition">
                <h2 className="text-lg font-semibold text-gray-200 mb-4 text-center">📊 Quantity Available</h2>
                <div className="h-[300px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl shadow-lg w-full md:w-[500px] max-w-[95vw] hover:scale-[1.01] transition">
                <h2 className="text-lg font-semibold text-gray-200 mb-4 text-center">📈 Reorder Level</h2>
                <div className="h-[300px]">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Inventory Items */}
            <div>
              {paginatedItems.map(item => {
                const isLowStock = item.quantityAvailable <= item.reorderLevel;
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/inventory/${item.id}`)}
                    className={`p-4 mb-4 rounded-lg border-2 transition cursor-pointer bg-neutral-800 hover:bg-neutral-700 shadow ${isLowStock ? 'border-red-500' : 'border-transparent'}`}
                  >
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-gray-400">SKU: <span className="font-mono">{item.skuCode}</span></p>
                    <p className="text-gray-400">Stock: {item.quantityAvailable}</p>
                    <LowStockBadge quantity={item.quantityAvailable} reorderLevel={item.reorderLevel} />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm font-medium ${currentPage === i + 1 ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
