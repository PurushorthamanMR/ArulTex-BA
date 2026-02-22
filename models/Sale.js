const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceNo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
    field: 'invoiceNo'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'userId'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'subtotal'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'totalAmount'
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Card', 'UPI'),
    allowNull: false,
    field: 'paymentMethod'
  },
  saleDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'saleDate'
  },
  status: {
    type: DataTypes.ENUM('Completed', 'Refunded', 'Pending'),
    defaultValue: 'Completed',
    field: 'status'
  }
}, {
  tableName: 'sales',
  timestamps: false
});

module.exports = Sale;
