const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'firstName'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'lastName'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password'
  },
  address: {
    type: DataTypes.STRING,
    field: 'address'
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'emailAddress'
  },
  mobileNumber: {
    type: DataTypes.STRING,
    field: 'mobileNumber'
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdDate'
  },
  modifiedDate: {
    type: DataTypes.DATE,
    field: 'modifiedDate'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  userRoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userRoleId'
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;
