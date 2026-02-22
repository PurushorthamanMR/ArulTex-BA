const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'categoryName'
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
  tableName: 'product_categories',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = ProductCategory;
