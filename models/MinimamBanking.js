const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MinimamBanking = sequelize.define('MinimamBanking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DOUBLE,
    field: 'amount'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  }
}, {
  tableName: 'minimamBanking',
  timestamps: false
});

module.exports = MinimamBanking;
