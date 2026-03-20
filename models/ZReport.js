const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ZReport = sequelize.define('ZReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  closedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'closedByUserId'
  },
  filterUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'filterUserId'
  },
  fromDate: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'fromDate'
  },
  toDate: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'toDate'
  },
  grandTotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'grandTotal'
  },
  transactionCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transactionCount'
  },
  snapshot: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'snapshot'
  },
  shiftId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    field: 'shiftId'
  }
}, {
  tableName: 'z_reports',
  timestamps: true,
  updatedAt: false,
  createdAt: 'createdAt'
});

module.exports = ZReport;
