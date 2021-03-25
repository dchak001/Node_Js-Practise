const express=require('express');
const bodyParser=require('body-parser');

const sequelize=require('./util/database');
const feedRoutes=require('./routes/feed');
const authRoutes=require('./routes/auth');
const User = require('./models/user');
const Post = require('./models/Post');

const app=express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})


app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);


app.use((err,req,res,next)=>{
const statusCode=err.statusCode||500;
const message=err.message||"Something went wrong";
return res.status(statusCode).json({message:message,data:err.data});
});


Post.belongsTo(User);
User.hasMany(Post,{constraints:true,onDelete:'CASCADE'});

sequelize
//.sync({force:true})
.sync()
.then(result=>{
    const server=app.listen(8080);
    const io=require('socket.io')(server,{cors:{
        origin:'*',
    }});
    io.on('connection',socket=>{
            console.log('connection established');
    });
})
.catch(err=>{
    console.log(err);
})





