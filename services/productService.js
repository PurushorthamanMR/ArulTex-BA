const { Op } = require('sequelize');
const { Product, ProductCategory, Supplier } = require('../models');
const logger = require('../config/logger');

/** Compute selling price from cost price and discount percentage: sellingPrice = costPrice * (1 - discountPercentage/100) */
function computeSellingPrice(costPrice, discountPercentage = 0) {
  const cost = Number(costPrice);
  const discount = Number(discountPercentage) || 0;
  const selling = cost * (1 - discount / 100);
  return Math.round(selling * 100) / 100;
}

function toDto(row) {
  if (!row) return null;
  const barCodeVal = row.barCode ?? row.barcode;
  const dto = {
    id: row.id,
    barCode: barCodeVal != null && String(barCodeVal).trim() !== '' ? String(barCodeVal).trim() : null,
    productName: row.productName,
    categoryId: row.categoryId,
    supplierId: row.supplierId,
    costPrice: row.costPrice != null ? Number(row.costPrice) : null,
    sellingPrice: row.sellingPrice != null ? Number(row.sellingPrice) : null,
    discountPercentage: row.discountPercentage != null ? Number(row.discountPercentage) : 0,
    stockQty: row.stockQty,
    minStockLevel: row.minStockLevel,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
  if (row.category) {
    dto.category = { id: row.category.id, categoryName: row.category.categoryName };
  }
  if (row.supplier) {
    dto.supplier = { id: row.supplier.id, supplierName: row.supplier.supplierName };
  } else {
    // When no supplier is set, expose a friendly default name
    dto.supplier = { id: null, supplierName: 'NoSupplier' };
  }
  return dto;
}

const includeAssoc = [
  { model: ProductCategory, as: 'category', attributes: ['id', 'categoryName'] },
  { model: Supplier, as: 'supplier', attributes: ['id', 'supplierName'], required: false }
];

/**
 * Barcode generation (backend only).
 *
 * Generating a barcode involves (1) a unique identification number for the product and
 * (2) converting that number into a scannable image. For retail products sold in stores,
 * this generally requires registration with GS1 (gs1.org) for a globally recognized
 * code (GTIN / EAN-13 / UPC).
 *
 * This implementation produces an internal 13-digit number (prefix 8901000 + product id)
 * for in-store POS and inventory. It is unique per product and suitable for local use.
 * If you need globally recognized barcodes, register with GS1, obtain official GTINs,
 * and store those in barCode (or a separate field). The app already converts any stored
 * barcode number into a scannable image on the Barcode label page.
 */
function generateBarcode(productId) {
  const id = Number(productId || 0);
  const suffix = String(id).padStart(6, '0').slice(-6);
  return `8901000${suffix}`;
}

async function save(body) {
  logger.info('ProductService.save() invoked');
  const costPrice = Number(body.costPrice);
  const discountPercentage = Number(body.discountPercentage) || 0;
  const sellingPrice = computeSellingPrice(costPrice, discountPercentage);
  const barCodeProvided = body.barCode != null && String(body.barCode).trim() !== '';
  const product = await Product.create({
    barCode: barCodeProvided ? String(body.barCode).trim() : null,
    productName: body.productName,
    categoryId: body.categoryId,
    supplierId: body.supplierId || null,
    costPrice,
    sellingPrice,
    discountPercentage,
    stockQty: body.stockQty ?? 0,
    minStockLevel: body.minStockLevel ?? 0,
    isActive: body.isActive !== undefined ? body.isActive : true
  });
  if (!barCodeProvided) {
    const generated = generateBarcode(product.id);
    const [affectedCount] = await Product.update(
      { barCode: generated },
      { where: { id: product.id } }
    );
    if (affectedCount === 0) logger.warn('ProductService.save: barcode update affected 0 rows for id=%s', product.id);
  }
  const withAssoc = await Product.findByPk(product.id, { include: includeAssoc });
  return toDto(withAssoc);
}

async function update(body) {
  logger.info('ProductService.update() invoked');
  const product = await Product.findByPk(body.id);
  if (!product) throw new Error('Product not found');
  const costPrice = body.costPrice != null ? Number(body.costPrice) : Number(product.costPrice);
  const discountPercentage = body.discountPercentage != null ? Number(body.discountPercentage) : Number(product.discountPercentage);
  const sellingPrice = computeSellingPrice(costPrice, discountPercentage);
  // Barcode: allow update only when explicitly provided (e.g. from Barcode Labels page); else keep existing or generate if missing
  const barCodeProvided = body.barCode != null && String(body.barCode).trim() !== '';
  const currentBarCode = product.barCode != null && String(product.barCode).trim() !== '' ? product.barCode : null;
  const barCodeToSet = barCodeProvided ? String(body.barCode).trim() : (currentBarCode || generateBarcode(product.id));
  await product.update({
    barCode: barCodeToSet,
    productName: body.productName ?? product.productName,
    categoryId: body.categoryId ?? product.categoryId,
    supplierId: body.supplierId !== undefined ? body.supplierId : product.supplierId,
    costPrice,
    sellingPrice,
    discountPercentage,
    stockQty: body.stockQty !== undefined ? body.stockQty : product.stockQty,
    minStockLevel: body.minStockLevel !== undefined ? body.minStockLevel : product.minStockLevel,
    isActive: body.isActive !== undefined ? body.isActive : product.isActive
  });
  const withAssoc = await Product.findByPk(product.id, { include: includeAssoc });
  return toDto(withAssoc);
}

async function getAll() {
  logger.info('ProductService.getAll() invoked');
  const list = await Product.findAll({ include: includeAssoc, order: [['productName', 'ASC']] });
  return list.map(toDto);
}

async function getAllPaginated(pageNumber = 1, pageSize = 10, filters = {}) {
  logger.info('ProductService.getAllPaginated() invoked');
  const where = {};
  if (filters.isActive !== undefined && filters.isActive !== '') {
    where.isActive = filters.isActive === 'true' || filters.isActive === true;
  }
  if (filters.productName) where.productName = { [Op.like]: `%${filters.productName}%` };
  if (filters.barCode) where.barCode = { [Op.like]: `%${filters.barCode}%` };
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.supplierId) where.supplierId = filters.supplierId;
  const offset = (pageNumber - 1) * pageSize;
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: includeAssoc,
    limit: pageSize,
    offset,
    order: [['productName', 'ASC']]
  });
  return {
    content: rows.map(toDto),
    totalElements: count,
    totalPages: Math.ceil(count / pageSize),
    pageNumber,
    pageSize
  };
}

async function getById(id) {
  logger.info('ProductService.getById() invoked');
  const product = await Product.findByPk(id, { include: includeAssoc });
  return toDto(product);
}

async function search(query) {
  logger.info('ProductService.search() invoked');
  const where = {};
  if (query.productName) where.productName = { [Op.like]: `%${query.productName}%` };
  if (query.barCode) where.barCode = { [Op.like]: `%${query.barCode}%` };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true' || query.isActive === true;
  }
  const list = await Product.findAll({ where, include: includeAssoc, order: [['productName', 'ASC']] });
  return list.map(toDto);
}

async function getByCategory(categoryId) {
  logger.info('ProductService.getByCategory() invoked');
  const list = await Product.findAll({
    where: { categoryId },
    include: includeAssoc,
    order: [['productName', 'ASC']]
  });
  return list.map(toDto);
}

async function getByPrice(minPrice, maxPrice) {
  logger.info('ProductService.getByPrice() invoked');
  const where = {};
  if (minPrice != null) where.sellingPrice = { ...where.sellingPrice, [Op.gte]: Number(minPrice) };
  if (maxPrice != null) where.sellingPrice = { ...where.sellingPrice, [Op.lte]: Number(maxPrice) };
  const list = await Product.findAll({ where, include: includeAssoc, order: [['sellingPrice', 'ASC']] });
  return list.map(toDto);
}

async function deleteById(id) {
  logger.info('ProductService.deleteById() invoked');
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  // Soft delete: mark as inactive instead of removing the row
  await product.update({ isActive: false });
  return { id, isActive: false };
}

/** Update only barcode for a product (e.g. from Barcode Labels page). No other fields are changed. */
async function updateBarcodeOnly(body) {
  const id = body.id != null ? Number(body.id) : null;
  if (id == null || isNaN(id)) throw new Error('Product id is required');
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  const barCode = body.barCode != null && String(body.barCode).trim() !== '' ? String(body.barCode).trim() : null;
  await product.update({ barCode });
  const updated = await Product.findByPk(id, { attributes: ['id', 'productName', 'barCode'] });
  return { id: updated.id, productName: updated.productName, barCode: updated.barCode != null ? String(updated.barCode).trim() : null };
}

/** List products with id, productName, barCode for barcode label page (active only). */
async function listForBarcode() {
  logger.info('ProductService.listForBarcode() invoked');
  const rows = await Product.findAll({
    where: { isActive: true },
    attributes: ['id', 'productName', 'barCode'],
    order: [['productName', 'ASC']]
  });
  return rows.map((r) => ({
    id: r.id,
    productName: r.productName,
    barCode: r.barCode != null ? String(r.barCode).trim() : null
  }));
}

/** Products where stockQty <= minStockLevel (for GET /product/getLowStock). */
async function getLowStock(activeOnly = true) {
  logger.info('ProductService.getLowStock() invoked');
  const where = { isActive: activeOnly !== false };
  const rows = await Product.findAll({
    where,
    include: [{ model: ProductCategory, as: 'category', attributes: ['id', 'categoryName'] }],
    order: [['productName', 'ASC']]
  });
  const filtered = rows.filter((p) => (Number(p.stockQty) || 0) <= (Number(p.minStockLevel) || 0));
  return filtered.map((r) => toDto(r));
}

/** Paginated low-stock products (for GET /product/getLowStockPaginated). */
async function getLowStockPaginated(pageNumber = 1, pageSize = 10, filters = {}) {
  logger.info('ProductService.getLowStockPaginated() invoked');
  const where = { isActive: true };
  const all = await Product.findAll({
    where,
    include: includeAssoc,
    order: [['productName', 'ASC']]
  });
  const filtered = all.filter((p) => (Number(p.stockQty) || 0) <= (Number(p.minStockLevel) || 0));
  const total = filtered.length;
  const start = (pageNumber - 1) * pageSize;
  const page = filtered.slice(start, start + pageSize);
  return {
    content: page.map(toDto),
    totalElements: total,
    totalPages: Math.ceil(total / pageSize) || 1,
    pageNumber,
    pageSize
  };
}

/** Paginated high/non-low stock products (for GET /product/getHighStockPaginated). */
async function getHighStockPaginated(pageNumber = 1, pageSize = 10, filters = {}) {
  logger.info('ProductService.getHighStockPaginated() invoked');
  const where = { isActive: true };
  const all = await Product.findAll({
    where,
    include: includeAssoc,
    order: [['productName', 'ASC']]
  });
  // High/non-low stock: stockQty > minStockLevel
  const filtered = all.filter((p) => (Number(p.stockQty) || 0) > (Number(p.minStockLevel) || 0));
  const total = filtered.length;
  const start = (pageNumber - 1) * pageSize;
  const page = filtered.slice(start, start + pageSize);
  return {
    content: page.map(toDto),
    totalElements: total,
    totalPages: Math.ceil(total / pageSize) || 1,
    pageNumber,
    pageSize
  };
}

module.exports = {
  save,
  update,
  updateBarcodeOnly,
  getAll,
  getAllPaginated,
  getById,
  search,
  getByCategory,
  getByPrice,
  deleteById,
  listForBarcode,
  getLowStock,
  getLowStockPaginated,
  getHighStockPaginated,
  computeSellingPrice
};
