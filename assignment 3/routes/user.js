const express=require('express');
const path = require('path');
const routes=express.Router();

routes.get('/users',(req,res,next)=>{
    console.log('first route');
    res.sendFile(path.join(__dirname,"..","views","user.html"));
})

routes.get('/',(req,res,next)=>{
    console.log('second route');
    res.sendFile(path.join(__dirname,"..","views","home.html"));
})




module.exports=routes


