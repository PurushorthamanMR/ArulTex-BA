const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    field: 'quantity'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'supplierId'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  }
}, {
  tableName: 'stock',
  timestamps: false
});

module.exports = Stock;
