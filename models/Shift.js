const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shift = sequelize.define('Shift', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'openedByUserId'
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'openedAt'
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'closedAt'
  },
  closedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'closedByUserId'
  },
  zReportId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'zReportId'
  }
}, {
  tableName: 'shifts',
  timestamps: false
});

module.exports = Shift;
