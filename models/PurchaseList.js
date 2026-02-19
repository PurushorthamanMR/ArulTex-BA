const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PurchaseList = sequelize.define('PurchaseList', {
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
  tableName: 'purchaseList',
  timestamps: false
});

module.exports = PurchaseList;
