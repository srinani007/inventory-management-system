import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function OrderForm() {
  const [skuCode, setSkuCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [recentOrders, setRecentOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🧠 Load recent orders on mount
  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/api/orders?page=0&size=5&sort=placedAt,desc');
      setRecentOrders(response.data.content);
    } catch (error) {
      console.error('❌ Order failed:', error);

      if (error.response && error.response.status === 400) {
        toast.error('❌ Not enough stock available for this SKU.');
      } else if (error.response && error.response.status === 403) {
        toast.error('🔒 You are not authorized to place orders.');
      } else {
        toast.error('⚠️ Something went wrong. Please try again.');
      }
    }
  };

  const checkStock = async () => {
    if (!skuCode.trim()) {
      toast.error("Enter a SKU Code first");
      return;
    }

    try {
      const response = await api.get(`/api/inventory/sku/${skuCode}`);
      toast.success(`✅ Stock available: ${response.data.quantityAvailable}`);
    } catch (error) {
      toast.error("❌ Could not fetch stock. Invalid SKU?");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skuCode.trim() || quantity <= 0) {
      toast.error('❌ Please enter a valid SKU code and quantity');
      return;
    }

    try {
      const response = await api.post('/api/orders', {
        skuCode,
        quantity,
        placedBy: user?.username,
      });

      toast.success(`✅ Order placed for SKU: ${skuCode}`);
      setSkuCode('');
      setQuantity(1);
      await fetchRecentOrders(); // 🔥 Refresh recent orders here
    } catch (error) {
      console.error(error);
      toast.error('⚠️ Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-10">
      {/* Form Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">📦 Place a New Order</h2>

        <button
          type="button"
          onClick={checkStock}
          className="ml-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          🔍 Check Stock
        </button>q
        /q\q


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">SKU Code</label>
            <input
              type="text"
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              placeholder="e.g. ITEM123"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
          >
            ➕ Submit Order
          </button>
        </form>
      </div>

      {/* Recent Orders Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🕒 Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="text-gray-500">No recent orders to display.</div>
        ) : (
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Placed By</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.skuCode}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className={`px-4 py-2 font-medium ${order.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.status}
                  </td>
                  <td className="px-4 py-2">{order.placedBy}</td>
                  <td className="px-4 py-2">{new Date(order.placedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
