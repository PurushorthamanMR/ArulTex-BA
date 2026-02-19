const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesReport = sequelize.define('SalesReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    field: 'date'
  },
  totalSales: {
    type: DataTypes.DOUBLE,
    field: 'totalSales'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  }
}, {
  tableName: 'salesReport',
  timestamps: false
});

module.exports = SalesReport;
