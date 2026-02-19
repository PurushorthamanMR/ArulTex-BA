const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StaffLeave = sequelize.define('StaffLeave', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'startDate'
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'endDate'
  },
  reason: {
    type: DataTypes.STRING,
    field: 'reason'
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
  tableName: 'staffLeave',
  timestamps: false
});

module.exports = StaffLeave;
