const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VoidHistory = sequelize.define('VoidHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reason: {
    type: DataTypes.STRING,
    field: 'reason'
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transactionId'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  }
}, {
  tableName: 'voidHistory',
  timestamps: false
});

module.exports = VoidHistory;
