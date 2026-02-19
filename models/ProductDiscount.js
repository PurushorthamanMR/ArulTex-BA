const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductDiscount = sequelize.define('ProductDiscount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discountValue: {
    type: DataTypes.DOUBLE,
    field: 'discountValue'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  },
  productDiscountTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productDiscountTypeId'
  }
}, {
  tableName: 'productDiscount',
  timestamps: false
});

module.exports = ProductDiscount;
