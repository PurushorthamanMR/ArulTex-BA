const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductDiscountType = sequelize.define('ProductDiscountType', {
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
  tableName: 'productDiscountType',
  timestamps: false
});

module.exports = ProductDiscountType;
