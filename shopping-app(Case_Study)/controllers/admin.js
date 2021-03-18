const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
    product: null
  });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  req.user.getProducts({
    where: {
      id: prodId
    }
  })
    .then(products => {
      let product=products[0];
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        edit: true,
        product: product
      });
    }).catch(err => {
      console.log(err);
    })
};

exports.updateProduct = (req, res, next) => {

  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  req.user.getProducts({
    where: {
      id: prodId
    }
  })
    .then(products => {
      let product=products[0];
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save();
    })
    .then(result => {
      console.log("Product updated");
      res.redirect('/admin/products');
    }).catch(err => {
      console.log(err);
    });

};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  }).then(result => {
    console.log("Product created");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  })

};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }).catch(err => {
      console.log(err);
    })
};


exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  let product;
  req.user.getProducts({where: {
    id: prodId
  }
}).then(products => {
   product=products[0];
  return product.getOrders();
})
  .then(orders=>{
    return orders.forEach(order=>
      order.getProducts()
      .then(products=>
        {
          if(products.length===1)
           order.destroy();
        })
      )
  })
  .then(result=>
     product.destroy()
  )
  .then(result=>{
    console.log("Product deleted");
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });

};