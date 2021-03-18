const { DOUBLE } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Product = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Product


// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id,title, imageUrl, description, price) {
//     this.id=id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     getProductsFromFile(products => {
//       if(this.id===null){
//       this.id=Math.random().toString().split(".").join("");
//       products.push(this);
//       }
//       else{
//         const prodIndex=products.findIndex(p=>p.id===this.id);
//         products[prodIndex]={...this}
//       }

//       fs.writeFile(p, JSON.stringify(products), err => {
//         console.log(err);
//       });
//     });
//   }

//   static findById(id,cb)
//   {
//     getProductsFromFile(products=>{
//     const prodFound=products.find(p=>p.id===id);
//     if(prodFound)
//     {
//       cb(prodFound);
//     }
//     })
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static delete(id)
//   {
//     getProductsFromFile(products=>{

//      const prodIndex=products.findIndex(p=>p.id===id);
//      let price=products[prodIndex].price;
//      products.splice(prodIndex,1);
//      console.log(price);
//      fs.writeFile(p,JSON.stringify(products),err=>
//       {
//         if(!err)
//         {
//           Cart.deleteProduct(id,price)
//         }
//       })

//     })

//   }
// };


