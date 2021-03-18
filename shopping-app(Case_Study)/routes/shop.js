const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.post('/cart/add-product', shopController.addToCart)

router.post('/cart/delete-product', shopController.deleteFromCart)

router.get('/product/:productId', shopController.getProduct)

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
