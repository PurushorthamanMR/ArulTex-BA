const { Op } = require('sequelize');
const { InventoryTransaction, Product, User } = require('../models');
const { recordInventoryChange } = require('./inventoryHelper');
const logger = require('../config/logger');

function toDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    productId: row.productId,
    transactionType: row.transactionType,
    referenceId: row.referenceId,
    quantity: row.quantity,
    previousStock: row.previousStock,
    newStock: row.newStock,
    userId: row.userId,
    note: row.note,
    createdAt: row.createdAt,
    product: row.product ? { id: row.product.id, productName: row.product.productName } : null,
    user: row.user ? { id: row.user.id, firstName: row.user.firstName, lastName: row.user.lastName } : null
  };
}

async function save(body) {
  logger.info('InventoryService.save() invoked');
  const { productId, transactionType, quantity, referenceId, userId, note } = body;
  const result = await recordInventoryChange({
    productId,
    transactionType,
    quantity: Number(quantity),
    referenceId,
    userId,
    note
  });
  const tx = await InventoryTransaction.findOne({
    where: { productId, transactionType, referenceId: referenceId || null },
    order: [['id', 'DESC']],
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }]
  });
  return toDto(tx);
}

async function update(body) {
  logger.info('InventoryService.update() invoked');
  const tx = await InventoryTransaction.findByPk(body.id);
  if (!tx) throw new Error('Inventory transaction not found');
  await tx.update({
    note: body.note !== undefined ? body.note : tx.note
  });
  const withAssoc = await InventoryTransaction.findByPk(tx.id, {
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }]
  });
  return toDto(withAssoc);
}

async function getAll() {
  const list = await InventoryTransaction.findAll({
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }],
    order: [['createdAt', 'DESC']]
  });
  return list.map(toDto);
}

async function getById(id) {
  const tx = await InventoryTransaction.findByPk(id, {
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }]
  });
  return toDto(tx);
}

async function search(query) {
  const where = {};
  if (query.productId) where.productId = query.productId;
  if (query.transactionType) where.transactionType = query.transactionType;
  if (query.userId) where.userId = query.userId;
  if (query.fromDate) where.createdAt = { ...where.createdAt, [Op.gte]: new Date(query.fromDate) };
  if (query.toDate) where.createdAt = { ...where.createdAt, [Op.lte]: new Date(query.toDate) };
  const list = await InventoryTransaction.findAll({
    where,
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }],
    order: [['createdAt', 'DESC']]
  });
  return list.map(toDto);
}

async function deleteById(id) {
  const tx = await InventoryTransaction.findByPk(id);
  if (!tx) throw new Error('Inventory transaction not found');
  await tx.destroy();
  return { id };
}

/** POST /adjust: body { productId, quantity (signed), userId, note } - manual stock adjustment */
async function adjust(body) {
  logger.info('InventoryService.adjust() invoked');
  const result = await recordInventoryChange({
    productId: body.productId,
    transactionType: 'Adjustment',
    quantity: Number(body.quantity),
    referenceId: null,
    userId: body.userId,
    note: body.note || 'Manual adjustment'
  });
  const tx = await InventoryTransaction.findOne({
    where: { productId: body.productId },
    order: [['id', 'DESC']],
    include: [{ model: Product, as: 'product' }, { model: User, as: 'user' }]
  });
  return toDto(tx);
}

module.exports = {
  save,
  update,
  getAll,
  getById,
  search,
  deleteById,
  adjust
};
