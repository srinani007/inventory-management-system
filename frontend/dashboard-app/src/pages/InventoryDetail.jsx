import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from "../components/ui/button";

export default function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/inventory/${id}`)
      .then(res => {
        setItem(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load item.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        navigate('/inventory');
      } catch (err) {
        console.error('Failed to delete item.', err);
        alert('Failed to delete item.');
      }
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Link to="/inventory" className="text-blue-600">&larr; Back to list</Link>
      <h1 className="text-2xl font-bold my-4">Item Details</h1>
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <p><strong>SKU:</strong> {item.skuCode}</p>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Available:</strong> {item.quantityAvailable}</p>
        <p><strong>Reserved:</strong> {item.quantityReserved}</p>
        <p><strong>Reorder Level:</strong> {item.reorderLevel}</p>
        {item.location && <p><strong>Location:</strong> {item.location}</p>}
        {item.expiryDate && <p><strong>Expiry Date:</strong> {item.expiryDate}</p>}
      </div>
      <div className="space-x-2">
        <Button onClick={() => navigate(`/inventory/${id}/edit`)}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
