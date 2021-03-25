const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const Post=sequelize.define('post',{
id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
},
title:{
    type:Sequelize.STRING,
    allowNull:false
},
content:{
    type:Sequelize.STRING,
    allowNull:false
}
})

module.exports=Post;