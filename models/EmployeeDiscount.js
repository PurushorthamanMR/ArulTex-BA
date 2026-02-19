const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmployeeDiscount = sequelize.define('EmployeeDiscount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discountPercentage: {
    type: DataTypes.DOUBLE,
    field: 'discountPercentage'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productId'
  }
}, {
  tableName: 'employeeDiscount',
  timestamps: false
});

module.exports = EmployeeDiscount;
