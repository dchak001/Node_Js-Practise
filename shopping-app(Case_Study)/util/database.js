const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('node-practise','root','pass',{
    host:'localhost',
    dialect:'mysql'
});

module.exports=sequelize;