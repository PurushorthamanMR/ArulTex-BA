const { Product, InventoryTransaction } = require('../models');
const logger = require('../config/logger');

/**
 * Record inventory transaction and update product stock.
 * @param {Object} params - { productId, transactionType: 'Purchase'|'Sale'|'Return'|'Adjustment', quantity (signed: + add, - subtract), referenceId, userId, note }
 * @returns {Object} { product, previousStock, newStock }
 */
async function recordInventoryChange(params) {
  const { productId, transactionType, quantity, referenceId, userId, note } = params;
  const product = await Product.findByPk(productId);
  if (!product) throw new Error(`Product not found: ${productId}`);
  const previousStock = product.stockQty || 0;
  const qtyChange = Number(quantity);
  const newStock = Math.max(0, previousStock + qtyChange);
  await product.update({ stockQty: newStock });
  await InventoryTransaction.create({
    productId,
    transactionType,
    referenceId: referenceId || null,
    quantity: qtyChange,
    previousStock,
    newStock,
    userId: userId || null,
    note: note || null
  });
  logger.info(`Inventory: ${transactionType} productId=${productId} qty=${qtyChange} prev=${previousStock} new=${newStock}`);
  return { product, previousStock, newStock };
}

module.exports = { recordInventoryChange };
