const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  branchName: {
    type: DataTypes.STRING,
    field: 'branch_name'
  },
  branchCode: {
    type: DataTypes.STRING,
    field: 'branch_code'
  },
  address: {
    type: DataTypes.STRING,
    field: 'address'
  },
  contactNumber: {
    type: DataTypes.STRING,
    field: 'contact_number'
  },
  emailAddress: {
    type: DataTypes.STRING,
    field: 'email_address'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'countryId'
  },
  shopDetailsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'shopDetailsId'
  }
}, {
  tableName: 'branch',
  timestamps: false
});

module.exports = Branch;
