import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReceiptModal from '../components/ReceiptModal';
import { createOrder, getProfile } from '../services/api';

const Checkout = ({ onCartUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const cartData = location.state?.cartData || { cartItems: [], total: 0 };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const fetchAddresses = React.useCallback(async () => {
    try {
      const profile = await getProfile(token);
      setAddresses(profile.addresses || []);
      const defaultAddr = profile.addresses?.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (profile.addresses?.length === 0) {
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error('Failed to fetch addresses');
      setShowAddressForm(true);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAddresses();
    } else if (isAuthenticated && !token) {
      setShowAddressForm(true);
    }
  }, [isAuthenticated, token, fetchAddresses]);

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('Please login to complete your purchase. Guest checkout is not available for payment.');
      setTimeout(() => {
        navigate('/login', { state: { from: '/checkout', cartData } });
      }, 2000);
      return;
    }

    let shippingAddress;

    if (addresses.length === 0 || showAddressForm) {
      if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 || 
          !addressForm.city || !addressForm.state || !addressForm.zipCode) {
        setError('Please fill in all required address fields');
        return;
      }
      shippingAddress = addressForm;
    } else if (selectedAddress) {
      shippingAddress = selectedAddress;
    } else {
      setError('Please select a shipping address');
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartData.cartItems.map(item => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
        itemsPrice: parseFloat(cartData.total),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: parseFloat(cartData.total)
      };

      const response = await createOrder(token, orderData);
      
      setReceipt({
        message: 'Order placed successfully',
        total: cartData.total,
        timestamp: new Date().toISOString(),
        customerName: shippingAddress.fullName,
        customerEmail: user.email,
        items: cartData.cartItems.length,
        orderId: response.order._id
      });
      
      onCartUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  if (cartData.cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-50 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No items to checkout</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your purchase</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-yellow-800">Login Required</h3>
                <p className="text-sm text-yellow-700 mt-2">
                  You must be logged in to complete your purchase. Please login or create an account to proceed with payment.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate('/login', { state: { from: '/checkout', cartData } })}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => navigate('/signup', { state: { from: '/checkout', cartData } })}
                    className="bg-white hover:bg-yellow-50 text-yellow-800 border-2 border-yellow-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Shipping Address</h2>
              
              {isAuthenticated && addresses.length > 0 && !showAddressForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-4">Select a saved address or add a new one</p>
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress?._id === addr._id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{addr.fullName}</p>
                          <p className="text-slate-600 text-sm">{addr.addressLine1}</p>
                          {addr.addressLine2 && <p className="text-slate-600 text-sm">{addr.addressLine2}</p>}
                          <p className="text-slate-600 text-sm">
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-slate-600 text-sm">Phone: {addr.phone}</p>
                        </div>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all font-semibold"
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={addressForm.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={addressForm.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  {isAuthenticated && showAddressForm && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm({
                          fullName: '',
                          phone: '',
                          addressLine1: '',
                          addressLine2: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          country: 'United States'
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                    >
                      ← Back to saved addresses
                    </button>
                  )}
                </form>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Payment Method</h2>
              <div className="bg-slate-50 rounded-lg p-4 border-2 border-indigo-600">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    checked
                    readOnly
                    className="w-4 h-4 text-indigo-600"
                  />
                  <label htmlFor="cod" className="ml-3 font-semibold text-slate-800">Cash on Delivery</label>
                </div>
                <p className="text-slate-600 text-sm mt-2 ml-7">
                  Pay when your order is delivered
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartData.cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-300 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${cartData.total}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-slate-800 pt-2 border-t border-slate-300">
                  <span>Total</span>
                  <span className="text-indigo-600">${cartData.total}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !isAuthenticated}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                  !isAuthenticated 
                    ? 'bg-slate-400 cursor-not-allowed text-slate-100' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : !isAuthenticated ? '🔒 Login Required to Place Order' : 'Place Order'}
              </button>

              {!isAuthenticated && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-center text-sm text-slate-700 font-semibold mb-2">
                    📦 Secure Checkout Required
                  </p>
                  <p className="text-center text-xs text-slate-600 mb-3">
                    Create an account or login to complete your purchase
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/login', { state: { from: '/checkout', cartData } })}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/signup', { state: { from: '/checkout', cartData } })}
                      className="flex-1 bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />
    </div>
  );
};

export default Checkout;
