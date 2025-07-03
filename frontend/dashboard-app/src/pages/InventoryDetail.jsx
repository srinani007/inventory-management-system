import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

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
        setError('Failed to load item. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        navigate('/inventory', { state: { deleted: true } });
      } catch (err) {
        console.error('Failed to delete item.', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription className="text-center">
            {error}
            <Button
              variant="link"
              onClick={() => window.location.reload()}
              className="mt-2 text-indigo-600 hover:text-indigo-800"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLowStock = item.quantityAvailable <= item.reorderLevel;
  const isOutOfStock = item.quantityAvailable === 0;
  const isNearExpiry = item.expiryDate && new Date(item.expiryDate) - new Date() <= 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/inventory"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Inventory
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Item Details</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            SKU: {item.skuCode}
          </span>
        </div>

        <Card className="mb-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  {item.location || 'No location specified'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock Status</h3>
                <p className="mt-1 text-lg font-medium">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Available Quantity</h3>
                <p className="mt-1 text-lg font-medium">{item.quantityAvailable}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Reserved Quantity</h3>
                <p className="mt-1 text-lg font-medium">{item.quantityReserved}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reorder Level</h3>
                <p className="mt-1 text-lg font-medium">{item.reorderLevel}</p>
              </div>

              {item.expiryDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Expiry Date
                    {isNearExpiry && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Expiring Soon
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-lg font-medium">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {item.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-700">{item.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate(`/inventory/${id}/edit`)}
            className="flex-1 sm:flex-none"
            variant="default"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Item
          </Button>

          <Button
            onClick={handleDelete}
            className="flex-1 sm:flex-none"
            variant="destructive"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete Item
          </Button>
        </div>
      </div>
    </div>
  );
}