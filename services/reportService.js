const { Sale, Purchase, SaleItem, PurchaseItem, Product } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * Profit & loss: sales revenue - purchase cost (based on completed sales and related cost).
 * Simplified: total sales amount - total purchases amount for the period, or overall.
 */
async function getProfitLoss(fromDate, toDate) {
  logger.info('ReportService.getProfitLoss() invoked');
  const whereSale = { status: 'Completed' };
  const wherePurchase = { status: 'Completed' };
  if (fromDate) {
    whereSale.saleDate = { ...whereSale.saleDate, [Op.gte]: new Date(fromDate) };
    wherePurchase.purchaseDate = { ...wherePurchase.purchaseDate, [Op.gte]: new Date(fromDate) };
  }
  if (toDate) {
    whereSale.saleDate = { ...whereSale.saleDate, [Op.lte]: new Date(toDate) };
    wherePurchase.purchaseDate = { ...wherePurchase.purchaseDate, [Op.lte]: new Date(toDate) };
  }

  const [totalSalesAmount, totalPurchaseAmount] = await Promise.all([
    Sale.sum('totalAmount', { where: whereSale }),
    Purchase.sum('totalAmount', { where: wherePurchase })
  ]);

  const sales = totalSalesAmount != null ? Number(totalSalesAmount) : 0;
  const purchases = totalPurchaseAmount != null ? Number(totalPurchaseAmount) : 0;
  const profitLoss = sales - purchases;

  return {
    fromDate: fromDate || null,
    toDate: toDate || null,
    totalSales: sales,
    totalPurchases: purchases,
    profitLoss
  };
}

module.exports = { getProfitLoss };
