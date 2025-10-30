const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
