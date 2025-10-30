import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { getCart, removeFromCart, updateCartItem } from '../services/api';

const Cart = ({ onCartUpdate }) => {
  const [cartData, setCartData] = useState({ cartItems: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCartData(data);
      onCartUpdate();
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onCartUpdate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (id) => {
    try {
      setActionLoading(true);
      await removeFromCart(id);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQty = async (id, qty) => {
    try {
      setActionLoading(true);
      await updateCartItem(id, qty);
      await fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
      console.error(err);
    } finally {
      setActionLoading(false);
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
            onClick={fetchCart}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cartData.cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-50 rounded-lg p-12 text-center">
          <svg className="w-24 h-24 text-slate-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 mb-6">Add some items to get started</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Shopping Cart</h1>
        <p className="text-slate-600">{cartData.cartItems.length} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartData.cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={handleRemove}
              onUpdateQty={handleUpdateQty}
              loading={actionLoading}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${cartData.total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="border-t border-slate-300 pt-3">
                <div className="flex justify-between text-xl font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-indigo-600">${cartData.total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { cartData } })}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
