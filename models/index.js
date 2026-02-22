const { sequelize } = require('../config/database');
const UserRole = require('./UserRole');
const User = require('./User');
const PasswordResetToken = require('./PasswordResetToken');
const UserLogs = require('./UserLogs');
const ProductCategory = require('./ProductCategory');
const Supplier = require('./Supplier');
const Product = require('./Product');
const Purchase = require('./Purchase');
const PurchaseItem = require('./PurchaseItem');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const InventoryTransaction = require('./InventoryTransaction');

// User associations
UserRole.hasMany(User, { foreignKey: 'userRoleId', as: 'users' });
User.belongsTo(UserRole, { foreignKey: 'userRoleId', as: 'userRole' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserLogs.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product category & product
ProductCategory.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(ProductCategory, { foreignKey: 'categoryId', as: 'category' });
Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

// Purchase
Supplier.hasMany(Purchase, { foreignKey: 'supplierId', as: 'purchases' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Purchase.hasMany(PurchaseItem, { foreignKey: 'purchaseId', as: 'items' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });
PurchaseItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(PurchaseItem, { foreignKey: 'productId', as: 'purchaseItems' });

// Sale
User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Sale.hasMany(SaleItem, { foreignKey: 'saleId', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });
SaleItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(SaleItem, { foreignKey: 'productId', as: 'saleItems' });

// Inventory
Product.hasMany(InventoryTransaction, { foreignKey: 'productId', as: 'inventoryTransactions' });
InventoryTransaction.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(InventoryTransaction, { foreignKey: 'userId', as: 'inventoryTransactions' });
InventoryTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  UserRole,
  User,
  PasswordResetToken,
  UserLogs,
  ProductCategory,
  Supplier,
  Product,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  InventoryTransaction
};
