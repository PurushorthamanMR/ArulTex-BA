const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchaseNo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    field: 'purchaseNo'
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'supplierId'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'totalAmount'
  },
  purchaseDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'purchaseDate'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
    defaultValue: 'Completed',
    field: 'status'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  }
}, {
  tableName: 'purchases',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = Purchase;
