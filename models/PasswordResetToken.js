const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'token'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiryDate'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  }
}, {
  tableName: 'passwordResetToken',
  timestamps: false
});

module.exports = PasswordResetToken;
