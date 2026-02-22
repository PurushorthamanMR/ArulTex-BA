const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supplierName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'supplierName'
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'phone'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'email'
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'address'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedAt'
  }
}, {
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Supplier;
