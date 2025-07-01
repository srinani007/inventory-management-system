import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ skuCode: '', name: '', quantityAvailable: 0, reorderLevel: 0 });
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/inventory/${id}`).then(res => setForm(res.data));
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
    } catch (err) {
      console.error('Failed to save item', err);
      alert('Error saving item');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Item' : 'New Item'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="skuCode" placeholder="SKU Code" value={form.skuCode} onChange={handleChange} className="border p-2 w-full" required />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="quantityAvailable" placeholder="Quantity Available" value={form.quantityAvailable} onChange={handleChange} className="border p-2 w-full" />
        <input type="number" name="reorderLevel" placeholder="Reorder Level" value={form.reorderLevel} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
