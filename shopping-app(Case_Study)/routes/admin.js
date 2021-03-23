const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth,adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title','Title must have atleast 4 characters')
    .isString()
    .trim()
    .isLength({min:4}),
    body('imageUrl','Invalid Url')
    .trim()
    .isURL(),
    body('price','Price should have values after decimal')
    .trim()
    .toFloat()
    .isFloat(),
    body('description','Desscription should be between 10 and 100 characters')
    .trim()
    .isLength({min:10,max:100})
],isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product', 
[
    body('title','Title must have atleast 4 characters')
    .isString()
    .trim()
    .isLength({min:4}),
    body('imageUrl','Invalid Url')
    .trim()
    .isURL(),
    body('price','Price should have values after decimal')
    .trim()
    .toFloat()
    .isFloat(),
    body('description','Desscription should be between 10 and 100 characters')
    .trim()
    .isLength({min:10,max:100})
],
isAuth,adminController.updateProduct);

router.post('/delete-product', isAuth,adminController.deleteProduct);

module.exports = router;
