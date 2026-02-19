const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payout = sequelize.define('Payout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DOUBLE,
    field: 'amount'
  },
  description: {
    type: DataTypes.STRING,
    field: 'description'
  },
  payoutCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'payoutCategoryId'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  dateTime: {
    type: DataTypes.DATE,
    field: 'dateTime'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  generatedDateTime: {
    type: DataTypes.DATE,
    field: 'generatedDateTime'
  }
}, {
  tableName: 'payout',
  timestamps: false
});

module.exports = Payout;
