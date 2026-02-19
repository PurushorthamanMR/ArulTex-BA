const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'mobileNumber'
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdDate'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'customer',
  timestamps: false
});

module.exports = Customer;
