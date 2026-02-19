const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransactionDetailsList = sequelize.define('TransactionDetailsList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    field: 'quantity'
  },
  price: {
    type: DataTypes.DOUBLE,
    field: 'price'
  },
  discount: {
    type: DataTypes.DOUBLE,
    field: 'discount'
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transactionId'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  }
}, {
  tableName: 'transactionDetailsList',
  timestamps: false
});

module.exports = TransactionDetailsList;
