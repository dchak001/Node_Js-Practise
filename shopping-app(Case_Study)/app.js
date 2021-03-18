const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

app.use((req, res, next) => {

    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
        })
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User);
User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsTo(User);
User.hasOne(Cart);
Product.belongsToMany(Cart, { onDelete: 'CASCADE', constraints: true, through: { model: CartItem } });
Cart.belongsToMany(Product, { through: { model: CartItem } });
User.hasMany(Order);
Order.belongsTo(User);
Product.belongsToMany(Order,{onDelete: 'CASCADE', constraints: true, through: { model: OrderItem } })
Order.belongsToMany(Product, { through: { model: OrderItem } });


sequelize.
    //sync({ force: true }).
    sync().
    then(res => {
        return User.findByPk(1)
    })
    .then(user => {
        if (user)
            return user;
        else
            return User.create({ name: "Dipan", email: "abc@gmail.com" })
    })
    .then(user => {
        return user.getCart()

            .then(cart => {
                if (cart) {
                    return cart;
                } else {
                    return user.createCart();
                }
            })
    })
    .then(res => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

