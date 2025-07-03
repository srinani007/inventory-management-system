import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    skuCode: '',
    name: '',
    quantityAvailable: 0,
    reorderLevel: 0
  });
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/inventory/${id}`)
        .then(res => setForm(res.data))
        .catch(err => {
          console.error("Failed to fetch item", err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/inventory/${id}`, form);
      } else {
        await api.post('/inventory', form);
      }
      navigate('/inventory');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save item', err);
      toast.error(err.response?.data?.message || 'Error saving item');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8  max-w-2xl">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          {isEdit ? '✏️ Edit Inventory Item' : '➕ Add New Inventory Item'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="skuCode" className="block mb-1 font-medium text-gray-700">SKU Code</label>
            <input
              id="skuCode"
              name="skuCode"
              type="text"
              value={form.skuCode}
              onChange={handleChange}
              required
              className="l px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. SKU12345"
            />
          </div>

          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Item Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Wireless Mouse"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantityAvailable" className="block mb-1 font-medium text-gray-700">Quantity Available</label>
              <input
                id="quantityAvailable"
                name="quantityAvailable"
                type="number"
                value={form.quantityAvailable}
                onChange={handleChange}
                className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 100"
              />
            </div>

            <div>
              <label htmlFor="reorderLevel" className="block mb-1 font-medium text-gray-700">Reorder Level</label>
              <input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                value={form.reorderLevel}
                onChange={handleChange}
                className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 20"
              />
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-lg transition duration-200"
            >
              {isEdit ? '💾 Update Item' : '✅ Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
