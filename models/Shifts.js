const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shifts = sequelize.define('Shifts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startTime: {
    type: DataTypes.DATE,
    field: 'startTime'
  },
  endTime: {
    type: DataTypes.DATE,
    field: 'endTime'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'branchId'
  }
}, {
  tableName: 'shifts',
  timestamps: false
});

module.exports = Shifts;
