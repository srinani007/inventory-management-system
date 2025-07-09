import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import {
  ChevronLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Calendar,
  Info
} from 'lucide-react';

export default function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/inventory/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load item. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      try {
        await api.delete(`/api/inventory/${id}`);
        navigate('/inventory', { state: { deleted: true } });
      } catch (err) {
        console.error('Failed to delete item.', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!item) return null;

  const isLowStock = item.quantityAvailable <= item.reorderLevel;
  const isOutOfStock = item.quantityAvailable === 0;
  const isNearExpiry = item.expiryDate && new Date(item.expiryDate) - new Date() <= 30 * 24 * 60 * 60 * 1000;
  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        text: "Out of Stock",
        icon: <AlertCircle className="h-4 w-4" />,
        variant: "destructive"
      };
    }
    if (isLowStock) {
      return {
        text: "Low Stock",
        icon: <AlertTriangle className="h-4 w-4" />,
        variant: "warning"
      };
    }
    return {
      text: "In Stock",
      icon: <CheckCircle className="h-4 w-4" />,
      variant: "success"
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            asChild
            variant="ghost"
            className="pl-0 hover:bg-transparent"
          >
            <Link to="/inventory" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Inventory</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-sm text-muted-foreground">
              Detailed view of inventory item
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
            SKU: {item.skuCode}
          </Badge>
        </div>

        <Card>
          <CardHeader className="border-b p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.location || 'No location specified'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Stock Status
                </h3>
                <Badge variant={stockStatus.variant} className="gap-2">
                  {stockStatus.icon}
                  {stockStatus.text}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Available Quantity
                </h3>
                <p className="text-xl font-semibold">
                  {item.quantityAvailable}
                  {isLowStock && (
                    <span className="ml-2 text-sm text-yellow-600">
                      (Below reorder level)
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Reserved Quantity
                </h3>
                <p className="text-xl font-semibold">{item.quantityReserved}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Reorder Level
                </h3>
                <p className="text-xl font-semibold">{item.reorderLevel}</p>
              </div>

              {item.expiryDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </h3>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                    {isExpired ? (
                      <Badge variant="destructive" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Expired
                      </Badge>
                    ) : isNearExpiry ? (
                      <Badge variant="warning" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Expiring Soon
                      </Badge>
                    ) : null}
                  </div>
                </div>
              )}

              {item.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={() => navigate(`/inventory/${id}/edit`)}
                className="flex-1 gap-2"
                variant="default"
              >
                <Edit className="h-4 w-4" />
                Edit Item
              </Button>

              <Button
                onClick={handleDelete}
                className="flex-1 gap-2"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete Item
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}