const { Sale, Purchase, Product } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

async function getSummary() {
  logger.info('DashboardService.getSummary() invoked');
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalSalesResult, totalPurchasesResult, todaySales, monthSales, products] = await Promise.all([
    Sale.sum('totalAmount', { where: { status: 'Completed' } }),
    Purchase.sum('totalAmount', { where: { status: 'Completed' } }),
    Sale.sum('totalAmount', { where: { status: 'Completed', saleDate: { [Op.gte]: startOfDay } } }),
    Sale.sum('totalAmount', { where: { status: 'Completed', saleDate: { [Op.gte]: startOfMonth } } }),
    Product.findAll({ where: { isActive: true }, attributes: ['stockQty', 'minStockLevel'] })
  ]);

  const lowStockCount = products.filter(p => (p.stockQty || 0) <= (p.minStockLevel || 0)).length;
  const totalSales = totalSalesResult != null ? Number(totalSalesResult) : 0;
  const totalPurchases = totalPurchasesResult != null ? Number(totalPurchasesResult) : 0;

  return {
    totalSales,
    totalPurchases,
    lowStockCount,
    todaySales: todaySales != null ? Number(todaySales) : 0,
    monthSales: monthSales != null ? Number(monthSales) : 0
  };
}

module.exports = { getSummary };
