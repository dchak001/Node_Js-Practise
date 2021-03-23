const Product = require('../models/product');
const Cart = require('../models/cart');
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    }).catch(err => { console.log(err) });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    }).catch(err => {
      console.log(err);
    });

};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    }).catch(err => { console.log(err) });

};



exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));


};

exports.postOrders = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    }).then(products => {
      req.user.createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };//setting the orderItem along with addition of products to order
              product.cartItem.destroy();
              return product;
            }))
        }).then(result => {
          //fetchedCart.setProducts(null);
          res.redirect('/orders')
        }).catch(err => console.log(err))
    })
    .catch(err => console.log(err));

};


exports.getCart = (req, res, next) => {
  console.log(req.user);
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      res.render(
        'shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      }
      );
    })
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  let product;
  console.log(prodId)
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return fetchedCart.getProducts({
        where: {
          id: prodId
        }
      });
    }).then(products => {
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1
        return product;
      }
      else {
        return Product.findByPk(prodId);
      }

    }).then(product => {
      return fetchedCart.addProducts(product, { through: { quantity: newQuantity } }) //set quantity property of cartItem seprarately
    }).
    then(result => {
      res.redirect("/cart");
    }).catch(err => console.log(err))

};

exports.deleteFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({
        where: {
          id: prodId
        }
      })
    }).then(products => {
      return products[0].cartItem.destroy();
    }).then(result => {
      res.redirect("/cart");

    }).catch(err => console.log(err))

};
