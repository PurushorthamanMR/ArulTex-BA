const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    field: 'type'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'paymentMethod',
  timestamps: false
});

module.exports = PaymentMethod;
