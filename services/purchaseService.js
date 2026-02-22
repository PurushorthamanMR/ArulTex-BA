const { Op } = require('sequelize');
const { Purchase, PurchaseItem, Product, Supplier, User } = require('../models');
const { recordInventoryChange } = require('./inventoryHelper');
const logger = require('../config/logger');

function purchaseToDto(row, items = []) {
  if (!row) return null;
  const dto = {
    id: row.id,
    purchaseNo: row.purchaseNo,
    supplierId: row.supplierId,
    totalAmount: row.totalAmount != null ? Number(row.totalAmount) : null,
    purchaseDate: row.purchaseDate,
    userId: row.userId,
    status: row.status,
    createdAt: row.createdAt
  };
  if (row.supplier) dto.supplier = { id: row.supplier.id, supplierName: row.supplier.supplierName };
  if (row.user) dto.user = { id: row.user.id, firstName: row.user.firstName, lastName: row.user.lastName };
  if (items.length) dto.items = items.map(itemToDto);
  else if (row.items) dto.items = row.items.map(itemToDto);
  return dto;
}

function itemToDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    purchaseId: row.purchaseId,
    productId: row.productId,
    quantity: row.quantity,
    costPrice: row.costPrice != null ? Number(row.costPrice) : null,
    totalPrice: row.totalPrice != null ? Number(row.totalPrice) : null,
    product: row.product ? { id: row.product.id, productName: row.product.productName } : null
  };
}

async function save(body) {
  logger.info('PurchaseService.save() invoked');
  const { supplierId, userId, items } = body;
  if (!items || !items.length) throw new Error('Purchase must have at least one item');
  const purchaseNo = body.purchaseNo || `PUR-${Date.now()}`;
  let totalAmount = 0;
  const itemRows = items.map(it => {
    const qty = parseInt(it.quantity);
    const costPrice = Number(it.costPrice);
    const totalPrice = qty * costPrice;
    totalAmount += totalPrice;
    return { productId: it.productId, quantity: qty, costPrice, totalPrice };
  });
  const purchase = await Purchase.create({
    purchaseNo,
    supplierId,
    totalAmount,
    purchaseDate: body.purchaseDate || new Date(),
    userId: userId || body.userId,
    status: body.status || 'Completed'
  });
  for (const it of itemRows) {
    const pi = await PurchaseItem.create({
      purchaseId: purchase.id,
      productId: it.productId,
      quantity: it.quantity,
      costPrice: it.costPrice,
      totalPrice: it.totalPrice
    });
    if (purchase.status === 'Completed') {
      await recordInventoryChange({
        productId: it.productId,
        transactionType: 'Purchase',
        quantity: it.quantity,
        referenceId: purchase.id,
        userId: purchase.userId,
        note: `Purchase ${purchase.purchaseNo}`
      });
    }
  }
  const withItems = await Purchase.findByPk(purchase.id, {
    include: [
      { model: Supplier, as: 'supplier' },
      { model: User, as: 'user' },
      { model: PurchaseItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'productName'] }] }
    ]
  });
  return purchaseToDto(withItems);
}

async function update(body) {
  logger.info('PurchaseService.update() invoked');
  const purchase = await Purchase.findByPk(body.id, {
    include: [{ model: PurchaseItem, as: 'items' }]
  });
  if (!purchase) throw new Error('Purchase not found');
  const newStatus = body.status ?? purchase.status;
  const newItems = body.items;
  if (newItems && newItems.length) {
    await PurchaseItem.destroy({ where: { purchaseId: purchase.id } });
    let totalAmount = 0;
    for (const it of newItems) {
      const qty = parseInt(it.quantity);
      const costPrice = Number(it.costPrice);
      const totalPrice = qty * costPrice;
      totalAmount += totalPrice;
      await PurchaseItem.create({
        purchaseId: purchase.id,
        productId: it.productId,
        quantity: qty,
        costPrice,
        totalPrice
      });
      if (newStatus === 'Completed') {
        await recordInventoryChange({
          productId: it.productId,
          transactionType: 'Purchase',
          quantity: qty,
          referenceId: purchase.id,
          userId: body.userId || purchase.userId,
          note: `Purchase update ${purchase.purchaseNo}`
        });
      }
    }
    await purchase.update({
      supplierId: body.supplierId ?? purchase.supplierId,
      totalAmount,
      status: newStatus
    });
  } else {
    await purchase.update({
      supplierId: body.supplierId ?? purchase.supplierId,
      status: newStatus
    });
  }
  const withItems = await Purchase.findByPk(purchase.id, {
    include: [
      { model: Supplier, as: 'supplier' },
      { model: User, as: 'user' },
      { model: PurchaseItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'productName'] }] }
    ]
  });
  return purchaseToDto(withItems);
}

async function getAll() {
  const list = await Purchase.findAll({
    include: [
      { model: Supplier, as: 'supplier' },
      { model: User, as: 'user' },
      { model: PurchaseItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ],
    order: [['createdAt', 'DESC']]
  });
  return list.map(p => purchaseToDto(p));
}

async function getById(id) {
  const purchase = await Purchase.findByPk(id, {
    include: [
      { model: Supplier, as: 'supplier' },
      { model: User, as: 'user' },
      { model: PurchaseItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ]
  });
  return purchaseToDto(purchase);
}

async function getByProductId(productId) {
  const items = await PurchaseItem.findAll({
    where: { productId },
    include: [
      { model: Purchase, as: 'purchase' },
      { model: Product, as: 'product' }
    ],
    order: [[{ model: Purchase, as: 'purchase' }, 'createdAt', 'DESC']]
  });
  return items.map(itemToDto);
}

async function search(query) {
  const where = {};
  if (query.purchaseNo) where.purchaseNo = { [Op.like]: `%${query.purchaseNo}%` };
  if (query.supplierId) where.supplierId = query.supplierId;
  if (query.status) where.status = query.status;
  if (query.fromDate) where.purchaseDate = { ...where.purchaseDate, [Op.gte]: query.fromDate };
  if (query.toDate) where.purchaseDate = { ...where.purchaseDate, [Op.lte]: query.toDate };
  const list = await Purchase.findAll({
    where,
    include: [
      { model: Supplier, as: 'supplier' },
      { model: User, as: 'user' },
      { model: PurchaseItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ],
    order: [['createdAt', 'DESC']]
  });
  return list.map(p => purchaseToDto(p));
}

async function deleteById(id) {
  const purchase = await Purchase.findByPk(id, { include: [{ model: PurchaseItem, as: 'items' }] });
  if (!purchase) throw new Error('Purchase not found');
  await PurchaseItem.destroy({ where: { purchaseId: id } });
  await purchase.destroy();
  return { id };
}

module.exports = {
  save,
  update,
  getAll,
  getById,
  getByProductId,
  search,
  deleteById
};
