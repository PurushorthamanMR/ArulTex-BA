const { sequelize } = require('../config/database');
const UserRole = require('./UserRole');
const Branch = require('./Branch');
const Country = require('./Country');
const ShopDetails = require('./ShopDetails');
const User = require('./User');
const ProductCategory = require('./ProductCategory');
const Tax = require('./Tax');
const Product = require('./Product');
const Customer = require('./Customer');
const PaymentMethod = require('./PaymentMethod');
const Transaction = require('./Transaction');
const TransactionDetailsList = require('./TransactionDetailsList');
const TransactionPaymentMethod = require('./TransactionPaymentMethod');
const TransactionEmployee = require('./TransactionEmployee');
const Supplier = require('./Supplier');
const Stock = require('./Stock');
const Shifts = require('./Shifts');
const StaffLeave = require('./StaffLeave');
const PayoutCategory = require('./PayoutCategory');
const Payout = require('./Payout');
const Banking = require('./Banking');
const MinimamBanking = require('./MinimamBanking');
const VoidHistory = require('./VoidHistory');
const SalesReport = require('./SalesReport');
const PurchaseList = require('./PurchaseList');
const ProductDiscountType = require('./ProductDiscountType');
const ProductDiscount = require('./ProductDiscount');
const EmployeeDiscount = require('./EmployeeDiscount');
const DeviceAuth = require('./DeviceAuth');
const ManagerToggle = require('./ManagerToggle');
const PasswordResetToken = require('./PasswordResetToken');
const UserLogs = require('./UserLogs');

// Define associations
// UserRole associations
UserRole.hasMany(User, { foreignKey: 'userRoleId', as: 'users' });
User.belongsTo(UserRole, { foreignKey: 'userRoleId', as: 'userRole' });

// Branch associations
Branch.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Branch.belongsTo(ShopDetails, { foreignKey: 'shopDetailsId', as: 'shopDetails' });
Branch.hasMany(User, { foreignKey: 'branchId', as: 'users' });
User.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Product associations
Product.belongsTo(Tax, { foreignKey: 'tax', as: 'taxInfo' });
Product.belongsTo(ProductCategory, { foreignKey: 'productCategory', as: 'categoryInfo' });

// Transaction associations
Transaction.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Transaction.belongsTo(ShopDetails, { foreignKey: 'shopdetailsId', as: 'shopDetails' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Transaction.hasMany(TransactionDetailsList, { foreignKey: 'transactionId', as: 'transactionDetailsList' });
Transaction.hasMany(TransactionPaymentMethod, { foreignKey: 'transactionId', as: 'transactionPaymentMethod' });
Transaction.hasMany(TransactionEmployee, { foreignKey: 'transactionId', as: 'transactionEmployee' });

TransactionDetailsList.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
TransactionDetailsList.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

TransactionPaymentMethod.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
TransactionPaymentMethod.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });

TransactionEmployee.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
TransactionEmployee.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });

// Stock associations
Stock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Stock.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Stock.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Shifts associations
Shifts.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Shifts.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// StaffLeave associations
StaffLeave.belongsTo(User, { foreignKey: 'userId', as: 'user' });
StaffLeave.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Payout associations
Payout.belongsTo(PayoutCategory, { foreignKey: 'payoutCategoryId', as: 'payoutCategory' });
Payout.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Payout.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Banking associations
Banking.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// MinimamBanking associations
MinimamBanking.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// VoidHistory associations
VoidHistory.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
VoidHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// SalesReport associations
SalesReport.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// PurchaseList associations
PurchaseList.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
PurchaseList.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
PurchaseList.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// ProductDiscount associations
ProductDiscount.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductDiscount.belongsTo(ProductDiscountType, { foreignKey: 'productDiscountTypeId', as: 'productDiscountType' });

// EmployeeDiscount associations
EmployeeDiscount.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EmployeeDiscount.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// PasswordResetToken associations
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserLogs associations
UserLogs.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  UserRole,
  Branch,
  Country,
  ShopDetails,
  User,
  ProductCategory,
  Tax,
  Product,
  Customer,
  PaymentMethod,
  Transaction,
  TransactionDetailsList,
  TransactionPaymentMethod,
  TransactionEmployee,
  Supplier,
  Stock,
  Shifts,
  StaffLeave,
  PayoutCategory,
  Payout,
  Banking,
  MinimamBanking,
  VoidHistory,
  SalesReport,
  PurchaseList,
  ProductDiscountType,
  ProductDiscount,
  EmployeeDiscount,
  DeviceAuth,
  ManagerToggle,
  PasswordResetToken,
  UserLogs
};
