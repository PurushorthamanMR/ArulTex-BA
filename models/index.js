const { sequelize } = require('../config/database');
const UserRole = require('./UserRole');
const User = require('./User');
const ProductCategory = require('./ProductCategory');
const Tax = require('./Tax');
const Product = require('./Product');
const Customer = require('./Customer');
const PaymentMethod = require('./PaymentMethod');
const Transaction = require('./Transaction');
const TransactionDetailsList = require('./TransactionDetailsList');
const TransactionPaymentMethod = require('./TransactionPaymentMethod');
const Supplier = require('./Supplier');
const Stock = require('./Stock');
const PasswordResetToken = require('./PasswordResetToken');
const UserLogs = require('./UserLogs');

// Define associations
// UserRole associations
UserRole.hasMany(User, { foreignKey: 'userRoleId', as: 'users' });
User.belongsTo(UserRole, { foreignKey: 'userRoleId', as: 'userRole' });

// Product associations
Product.belongsTo(Tax, { foreignKey: 'tax', as: 'taxInfo' });
Product.belongsTo(ProductCategory, { foreignKey: 'productCategory', as: 'categoryInfo' });

// Transaction associations
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Transaction.hasMany(TransactionDetailsList, { foreignKey: 'transactionId', as: 'transactionDetailsList' });
Transaction.hasMany(TransactionPaymentMethod, { foreignKey: 'transactionId', as: 'transactionPaymentMethod' });

TransactionDetailsList.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
TransactionDetailsList.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

TransactionPaymentMethod.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
TransactionPaymentMethod.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });

// Stock associations
Stock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Stock.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

// PasswordResetToken associations
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserLogs associations
UserLogs.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  UserRole,
  User,
  ProductCategory,
  Tax,
  Product,
  Customer,
  PaymentMethod,
  Transaction,
  TransactionDetailsList,
  TransactionPaymentMethod,
  Supplier,
  Stock,
  PasswordResetToken,
  UserLogs
};
