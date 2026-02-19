const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supplier = sequelize.define('Supplier', {
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
  contactNumber: {
    type: DataTypes.STRING,
    field: 'contactNumber'
  },
  emailAddress: {
    type: DataTypes.STRING,
    field: 'emailAddress'
  },
  address: {
    type: DataTypes.STRING,
    field: 'address'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'supplier',
  timestamps: false
});

module.exports = Supplier;
