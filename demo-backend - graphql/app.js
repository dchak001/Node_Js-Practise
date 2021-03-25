const express=require('express');
const bodyParser=require('body-parser');
const {graphqlHTTP}=require('express-graphql');

const sequelize=require('./util/database');
// const feedRoutes=require('./routes/feed');
// const authRoutes=require('./routes/auth');
const User = require('./models/user');
const Post = require('./models/Post');
const schema=require('./graphql/schema');
const resolver=require('./graphql/resolver');
const { isAuth } = require('./middleware/is-auth');

const app=express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method==='OPTIONS')
    {
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);
app.use('/graphql',graphqlHTTP(
    {
        schema:schema,
        rootValue:resolver,
        graphiql:true,
        customFormatErrorFn(err){
            if(!err.originalError)
            {
                return err;
            }

            const data=err.originalError.data;
            const message=err.message||"Some error occured";
            const code=err.originalError.code||500;

            return {message:message,status:code,data:data};

        }
    }
))

// app.use('/feed',feedRoutes);
// app.use('/auth',authRoutes);


// app.use((err,req,res,next)=>{
// const statusCode=err.statusCode||500;
// const message=err.message||"Something went wrong";
// return res.status(statusCode).json({message:message,data:err.data});
// });


Post.belongsTo(User);
User.hasMany(Post,{constraints:true,onDelete:'CASCADE'});

sequelize
//.sync({force:true})
.sync()
.then(result=>{
    const server=app.listen(8080);
})
.catch(err=>{
    console.log(err);
})





