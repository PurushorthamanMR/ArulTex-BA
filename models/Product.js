const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    field: 'name'
  },
  barcode: {
    type: DataTypes.STRING,
    field: 'barcode'
  },
  pricePerUnit: {
    type: DataTypes.DOUBLE,
    field: 'pricePerUnit'
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdDate'
  },
  quantity: {
    type: DataTypes.INTEGER,
    field: 'quantity'
  },
  lowStock: {
    type: DataTypes.INTEGER,
    field: 'lowStock'
  },
  purchasePrice: {
    type: DataTypes.DOUBLE,
    field: 'purchasePrice'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  discountValidation: {
    type: DataTypes.BOOLEAN,
    field: 'discountValidation'
  },
  tax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tax'
  },
  productCategory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productCategory'
  }
}, {
  tableName: 'product',
  timestamps: false
});

module.exports = Product;
