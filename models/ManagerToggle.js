const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ManagerToggle = sequelize.define('ManagerToggle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    field: 'name'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'managerToggle',
  timestamps: false
});

module.exports = ManagerToggle;
