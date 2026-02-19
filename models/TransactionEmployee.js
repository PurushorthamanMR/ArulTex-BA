const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransactionEmployee = sequelize.define('TransactionEmployee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transactionId'
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employeeId'
  }
}, {
  tableName: 'transactionEmployee',
  timestamps: false
});

module.exports = TransactionEmployee;
