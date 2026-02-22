const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PurchaseItem = sequelize.define('PurchaseItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'purchaseId'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'costPrice'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'totalPrice'
  }
}, {
  tableName: 'purchase_items',
  timestamps: false
});

module.exports = PurchaseItem;
