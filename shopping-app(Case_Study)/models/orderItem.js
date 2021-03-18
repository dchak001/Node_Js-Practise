const sequelize = require("../util/database");
const Sequelize = require('sequelize');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

module.exports=OrderItem;