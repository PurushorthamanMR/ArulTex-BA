const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLogs = sequelize.define('UserLogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.STRING,
    field: 'action'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'timestamp'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  signOff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'signOff'
  },
  logIn: {
    type: DataTypes.DATE,
    field: 'logIn'
  },
  logOut: {
    type: DataTypes.DATE,
    field: 'logOut'
  },
  description: {
    type: DataTypes.STRING,
    field: 'description'
  }
}, {
  tableName: 'userLogs',
  timestamps: false
});

module.exports = UserLogs;
