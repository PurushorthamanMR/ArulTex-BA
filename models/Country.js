const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  countryName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'countryName'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'country',
  timestamps: false
});

module.exports = Country;
