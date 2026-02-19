const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banking = sequelize.define('Banking', {
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
  tableName: 'banking',
  timestamps: false
});

module.exports = Banking;
