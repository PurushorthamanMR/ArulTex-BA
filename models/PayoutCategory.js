const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PayoutCategory = sequelize.define('PayoutCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryName: {
    type: DataTypes.STRING,
    field: 'categoryName'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'payoutCategory',
  timestamps: false
});

module.exports = PayoutCategory;
