import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5); // page size
    const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/orders?page=${page}&size=${size}`)
      .then(res => {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
        setIsLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setIsLoading(false);
      });
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-indigo-600 font-semibold animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📄 All Orders</h1>
        <Link to="/order/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow">
          ➕ New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">No orders found.</div>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Placed By</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Placed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.skuCode}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className={`px-4 py-3 font-medium ${order.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.status}
                  </td>
                  <td className="px-4 py-3">{order.placedBy}</td>
                  <td className="px-4 py-3">{new Date(order.placedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => (page + 1 < totalPages ? prev + 1 : prev))}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
