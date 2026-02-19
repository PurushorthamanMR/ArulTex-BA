const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DeviceAuth = sequelize.define('DeviceAuth', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tillName: {
    type: DataTypes.STRING,
    field: 'tillName'
  },
  password: {
    type: DataTypes.STRING,
    field: 'password'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'deviceAuth',
  timestamps: false
});

module.exports = DeviceAuth;
