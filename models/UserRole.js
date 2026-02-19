const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'userRole'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'userRole',
  timestamps: false
});

module.exports = UserRole;
