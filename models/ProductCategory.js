const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productCategoryName: {
    type: DataTypes.STRING,
    field: 'productCategoryName'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  agevalidation: {
    type: DataTypes.BOOLEAN,
    field: 'agevalidation'
  }
}, {
  tableName: 'productCategory',
  timestamps: false
});

module.exports = ProductCategory;
