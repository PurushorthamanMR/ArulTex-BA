const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'dateTime'
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: 'totalAmount'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'status'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  generateDateTime: {
    type: DataTypes.DATE,
    field: 'generateDateTime'
  },
  manualDiscount: {
    type: DataTypes.DOUBLE,
    field: 'manualDiscount'
  },
  employeeDiscount: {
    type: DataTypes.DOUBLE,
    field: 'employeeDiscount'
  },
  balanceAmount: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'balanceAmount'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  },
  shopdetailsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'shopdetailsId'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customerId'
  }
}, {
  tableName: 'transaction',
  timestamps: false
});

module.exports = Transaction;
