const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tax = sequelize.define('Tax', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  taxPercentage: {
    type: DataTypes.DOUBLE,
    field: 'taxPercentage'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'tax',
  timestamps: false
});

module.exports = Tax;
