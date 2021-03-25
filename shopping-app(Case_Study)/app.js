const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const csrf=require('csurf');
const flash=require('connect-flash');


const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const csrfProtection=csrf();
const sequelize = require('./util/database');
const sequelizeSessionStore = new SessionStore({
    db: sequelize,
});


const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');


app.use(expressSession({
    secret: 'keep it secret, keep it safe.',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));

app.use(csrfProtection);
app.use(flash());



app.use((req,res,next)=>{
    res.locals.isLoggedIn=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
})

app.use((req, res, next) => {

    if(req.session.user)
    {
    User.findByPk(req.session.user.id)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
}else{
    next();
}
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500',(req,res,next)=>{
    res.status(500).render('505',{
        path:'/505',
        pageTitle:'Server error',
        isLoggedIn:req.session.isLoggedIn
    })
})

app.use(errorController.get404);

app.use((err,req,res,next)=>{
    res.status(500).render('505',{
        path:'/505',
        pageTitle:'Server error',
        isLoggedIn:req.session.isLoggedIn
    })
})


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
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    })

