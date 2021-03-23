const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
    errorMessage:null,
    hasErrors:false,
    product:{
      title:'',
      price:'',
      imageUrl:'',
      description:''
    },
    validationErrors:[]
    
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
        product: product,
        hasErrors:false,
        errorMessage:null,
        validationErrors:[]
        
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
  const errors=validationResult(req);
  if(!errors.isEmpty())
  {
   return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      edit: true,
      hasErrors:true,
      errorMessage:errors.array()[0].msg,
      product:{
        id:prodId,
        title:updatedTitle,
        price:updatedPrice,
        imageUrl:updatedImageUrl,
        description:updatedDescription
      },
      validationErrors:[errors.array()[0]]
      
    });
  }
  req.user.getProducts({
    where: {
      id: prodId
    }
  })
    .then(products => {
      if(products.length===0)
      {
        return res.redirect('/');
      }
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
  const errors=validationResult(req);
  if(!errors.isEmpty())
  {
   return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      edit: false,
      hasErrors:true,
      errorMessage:errors.array()[0].msg,
      product:{
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description
      },
      validationErrors:[errors.array()[0]]
      
    });
  }
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  }).then(result => {
    console.log("Product created");
    res.redirect('/admin/products');
  }).catch(err => {
  const error=new Error(err);
  return next(error);
});

};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
 .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        
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
  if(products.length===0)
      {
        return res.redirect('/');
      }
   product=products[0];
   product.getOrders().
  then(orders=>{
    return orders.forEach(order=>
      order.getProducts()
      .then(products=>
        {
          console.log(products);
          if(products.length===1)
          {
          console.log("hello");
           order.destroy();
          }
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
})
  .catch(err => {
    console.log(err);
  });

};