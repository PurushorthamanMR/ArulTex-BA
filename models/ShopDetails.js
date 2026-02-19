const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShopDetails = sequelize.define('ShopDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    field: 'name'
  },
  address: {
    type: DataTypes.STRING,
    field: 'address'
  },
  contactNumber: {
    type: DataTypes.STRING,
    field: 'contactNumber'
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    field: 'whatsappNumber'
  },
  email: {
    type: DataTypes.STRING,
    field: 'email'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'shopDetails',
  timestamps: false
});

module.exports = ShopDetails;
