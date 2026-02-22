const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InventoryTransaction = sequelize.define('InventoryTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  },
  transactionType: {
    type: DataTypes.ENUM('Purchase', 'Sale', 'Return', 'Adjustment'),
    allowNull: false,
    field: 'transactionType'
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'referenceId'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity'
  },
  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'previousStock'
  },
  newStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'newStock'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'userId'
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'note'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  }
}, {
  tableName: 'inventory_transactions',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = InventoryTransaction;
