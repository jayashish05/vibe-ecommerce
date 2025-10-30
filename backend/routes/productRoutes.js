const express = require('express');
const router = express.Router();
const { getProducts, seedProducts, seedFromFakeStore } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/seed', seedProducts);
router.post('/seed-fakestore', seedFromFakeStore);

module.exports = router;
