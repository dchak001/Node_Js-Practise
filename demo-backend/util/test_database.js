const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('node-rest-practise-test','root','pass',{
    host:'localhost',
    dialect:'mysql',
})

module.exports=sequelize;