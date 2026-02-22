const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SaleItem = sequelize.define('SaleItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'saleId'
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
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unitPrice'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discountAmount'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'totalPrice'
  },
  returnedQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'returnedQty'
  }
}, {
  tableName: 'sale_items',
  timestamps: false
});

module.exports = SaleItem;
