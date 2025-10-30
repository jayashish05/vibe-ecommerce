import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, addToCart, seedProducts, seedFromFakeStore } from '../services/api';

const Products = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      
      if (data.length === 0) {
        await seedFromFakeStore();
        const newData = await getProducts();
        setProducts(newData);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError('Failed to load products. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      onCartUpdate();
      
      setNotification('Item added to cart!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleSeedFromFakeStore = async () => {
    try {
      setSeeding(true);
      setError(null);
      await seedFromFakeStore();
      const newData = await getProducts();
      setProducts(newData);
      setNotification('Products loaded from Fake Store API!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError('Failed to load products from Fake Store API');
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {notification && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Our Products</h1>
        <p className="text-slate-600">Discover our premium collection from Fake Store API</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            loading={addingToCart === product._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
