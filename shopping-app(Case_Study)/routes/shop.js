const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', isAuth,shopController.getCart);

router.post('/cart/add-product', isAuth,shopController.addToCart)

router.post('/cart/delete-product', isAuth,shopController.deleteFromCart)

router.get('/product/:productId', isAuth,shopController.getProduct)

router.get('/orders',isAuth, shopController.getOrders);

router.post('/create-order', isAuth,shopController.postOrders);

module.exports = router;
