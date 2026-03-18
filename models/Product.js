const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  barCode: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true,
    field: 'barCode'
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'productName'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoryId'
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'supplierId'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'costPrice'
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'sellingPrice'
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'discountPercentage'
  },
  stockQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'stockQty'
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'minStockLevel'
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'pcs',
    field: 'unit'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedAt'
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Product;
