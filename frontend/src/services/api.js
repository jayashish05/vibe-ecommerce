import axios from 'axios';

const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('app.github.dev')) {
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.protocol}//${window.location.hostname.replace(/\-3000/, '-5001')}${port}/api`;
  }
  
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const getHeaders = () => {
  const headers = {
    'x-session-id': getSessionId()
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const seedProducts = async () => {
  const response = await axios.post(`${API_URL}/products/seed`);
  return response.data;
};

export const seedFromFakeStore = async () => {
  const response = await axios.post(`${API_URL}/products/seed-fakestore`);
  return response.data;
};

export const getCart = async () => {
  const response = await axios.get(`${API_URL}/cart`, { headers: getHeaders() });
  return response.data;
};

export const addToCart = async (productId, qty = 1) => {
  const response = await axios.post(`${API_URL}/cart`, { productId, qty }, { headers: getHeaders() });
  return response.data;
};

export const removeFromCart = async (id) => {
  const response = await axios.delete(`${API_URL}/cart/${id}`, { headers: getHeaders() });
  return response.data;
};

export const updateCartItem = async (id, qty) => {
  const response = await axios.put(`${API_URL}/cart/${id}`, { qty }, { headers: getHeaders() });
  return response.data;
};

export const checkout = async (cartItems, name, email) => {
  const response = await axios.post(`${API_URL}/cart/checkout`, {
    cartItems,
    name,
    email
  });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateProfile = async (token, data) => {
  const response = await axios.put(`${API_URL}/auth/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const addAddress = async (token, address) => {
  const response = await axios.post(`${API_URL}/auth/address`, address, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateAddress = async (token, addressId, address) => {
  const response = await axios.put(`${API_URL}/auth/address/${addressId}`, address, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteAddress = async (token, addressId) => {
  const response = await axios.delete(`${API_URL}/auth/address/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createOrder = async (token, orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/orders/myorders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getOrderById = async (token, orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
