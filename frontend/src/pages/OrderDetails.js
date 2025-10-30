import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderById } from '../services/api';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchOrder = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrderById(token, id);
      setOrder(data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [token, navigate, fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 font-semibold mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Order Details</h1>
            <p className="text-indigo-100">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Order Date</p>
                <p className="font-semibold text-slate-800">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Order Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Shipping Address</h2>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="font-semibold text-slate-800 mb-2">{order.shippingAddress.fullName}</p>
                <p className="text-slate-600 text-sm">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-slate-600 text-sm">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-slate-600 text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-slate-600 text-sm">{order.shippingAddress.country}</p>
                <p className="text-slate-600 text-sm mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 bg-slate-50 rounded-lg p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-slate-600 text-sm">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
                      <p className="text-slate-600 text-sm">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Items Price:</span>
                  <span className="font-semibold">${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span className="font-semibold">${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-300 pt-3">
                  <div className="flex justify-between text-2xl font-bold text-indigo-600">
                    <span>Total:</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2">Payment Method</h3>
              <p className="text-blue-700">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
