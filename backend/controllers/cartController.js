const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
      query.userId = null;
    } else {
      query.userId = null;
      query.sessionId = null;
    }

    const cartItems = await CartItem.find(query);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    res.status(200).json({
      cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    if (!productId || !qty) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let query = { productId };
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
      query.userId = null;
    } else {
      query.userId = null;
      query.sessionId = null;
    }

    const existingCartItem = await CartItem.findOne(query);

    if (existingCartItem) {
      existingCartItem.qty += qty;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated', cartItem: existingCartItem });
    }

    const newCartItem = new CartItem({
      userId,
      sessionId,
      productId,
      name: product.name,
      image: product.image,
      price: product.price,
      qty
    });

    await newCartItem.save();
    res.status(201).json({ message: 'Item added to cart', cartItem: newCartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    let query = { _id: id };
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
      query.userId = null;
    }

    const cartItem = await CartItem.findOneAndDelete(query);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    if (!qty || qty < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    let query = { _id: id };
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
      query.userId = null;
    }

    const cartItem = await CartItem.findOneAndUpdate(
      query,
      { qty },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item updated', cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const { cartItems, name, email, shippingAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const checkoutData = {
      message: 'Checkout data validated',
      total: total.toFixed(2),
      timestamp: new Date().toISOString(),
      items: cartItems.length
    };

    if (name) checkoutData.customerName = name;
    if (email) checkoutData.customerEmail = email;
    if (shippingAddress) checkoutData.shippingAddress = shippingAddress;

    res.status(200).json(checkoutData);
  } catch (error) {
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, checkout };
