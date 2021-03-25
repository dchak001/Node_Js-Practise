const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('node-graphql-practice','root','pass',{
    host:'localhost',
    dialect:'mysql',
})

module.exports=sequelize;