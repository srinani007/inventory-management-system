import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skuCode: '',
    name: '',
    quantityAvailable: 0,
    reorderLevel: 0,
  });

  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  // Fetch item data if in edit mode
    useEffect(() => {
      if (isEdit) {
        setLoading(true);
        api.get(`/api/inventory/${id}`)
          .then(res => {
            const data = res.data;
            if (data && data.skuCode && data.name) {
              setForm(data);
            } else {
              throw new Error("Invalid inventory data");
            }
          })
          .catch(err => {
            console.error("Failed to fetch item", err);
            toast.error("Failed to load item details.");
          })
          .finally(() => setLoading(false)); // ✅ moved here properly
      }
    }, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skuCode || !form.name) {
      toast.warning("SKU Code and Item Name are required.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/api/inventory/${id}`, form);
        toast.success("Item updated successfully.");
      } else {
        await api.post('/api/inventory', form);
        toast.success("New item added successfully.");
      }
      navigate('/inventory');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save item', err);
      toast.error(err.response?.data?.message || 'Error saving item');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          {isEdit ? '✏️ Edit Inventory Item' : '➕ Add New Inventory Item'}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading item details...</p>
        ) : (
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
                  min="0"
                  value={form.quantityAvailable}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 100"
                />
              </div>

              <div>
                <label htmlFor="reorderLevel" className="block mb-1 font-medium text-gray-700">Reorder Level</label>
                <input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  value={form.reorderLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-lg transition duration-200"
              >
                {isEdit ? '💾 Update Item' : '✅ Add Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg text-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
