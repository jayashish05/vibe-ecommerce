const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem, checkout } = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getCart);
router.post('/', optionalAuth, addToCart);
router.delete('/:id', optionalAuth, removeFromCart);
router.put('/:id', optionalAuth, updateCartItem);
router.post('/checkout', checkout);

module.exports = router;
