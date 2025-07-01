import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);


export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/inventory').then(res => {
      setItems(res.data);
      setFilteredItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
      title: { display: true, text: 'Inventory Overview' },
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
        fill: false,
      },
    ],
  };

  if (loading) return <p className="p-4 text-center" aria-live="polite">Loading inventory...</p>;

  return (
    <div className="p-4" role="main" aria-label="Inventory List Page">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="space-x-2">
          <button onClick={() => navigate('/inventory/new')} className="bg-green-500 text-white px-4 py-2 rounded" aria-label="Add New Inventory Item">+ New Item</button>
          <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded" aria-label="Export Inventory to CSV">Export CSV</button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search by name or SKU"
        value={search}
        onChange={handleSearch}
        className="border p-2 mb-4 w-full"
        aria-label="Search inventory by name or SKU"
      />
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500" aria-live="polite">No inventory items found.</p>
      ) : (
        <>
          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="mb-8">
            <Line data={lineChartData} options={chartOptions} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map(item => (
              <div key={item.id} onClick={() => navigate(`/inventory/${item.id}`)} className="p-4 border rounded cursor-pointer hover:shadow" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && navigate(`/inventory/${item.id}`)}>
                <h2 className="font-semibold">{item.name}</h2>
                <p>SKU: {item.skuCode}</p>
                <p>Stock: {item.quantityAvailable}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
