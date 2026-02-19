const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransactionPaymentMethod = sequelize.define('TransactionPaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DOUBLE,
    field: 'amount'
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transactionId'
  },
  paymentMethodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'paymentMethodId'
  }
}, {
  tableName: 'transactionPaymentMethod',
  timestamps: false
});

module.exports = TransactionPaymentMethod;
