const sequelize = require("../util/database");
const Sequelize = require('sequelize');

const CartItem = sequelize.define('cartItem', {
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

module.exports=CartItem;