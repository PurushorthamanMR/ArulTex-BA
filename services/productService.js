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
  const dto = {
    id: row.id,
    barCode: row.barCode,
    productName: row.productName,
    categoryId: row.categoryId,
    supplierId: row.supplierId,
    costPrice: row.costPrice != null ? Number(row.costPrice) : null,
    sellingPrice: row.sellingPrice != null ? Number(row.sellingPrice) : null,
    discountPercentage: row.discountPercentage != null ? Number(row.discountPercentage) : 0,
    stockQty: row.stockQty,
    minStockLevel: row.minStockLevel,
    unit: row.unit || 'pcs',
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
  if (row.category) {
    dto.category = { id: row.category.id, categoryName: row.category.categoryName };
  }
  if (row.supplier) {
    dto.supplier = { id: row.supplier.id, supplierName: row.supplier.supplierName };
  }
  return dto;
}

const includeAssoc = [
  { model: ProductCategory, as: 'category', attributes: ['id', 'categoryName'] },
  { model: Supplier, as: 'supplier', attributes: ['id', 'supplierName'], required: false }
];

async function save(body) {
  logger.info('ProductService.save() invoked');
  const costPrice = Number(body.costPrice);
  const discountPercentage = Number(body.discountPercentage) || 0;
  const sellingPrice = body.sellingPrice != null ? Number(body.sellingPrice) : computeSellingPrice(costPrice, discountPercentage);
  const product = await Product.create({
    barCode: body.barCode || null,
    productName: body.productName,
    categoryId: body.categoryId,
    supplierId: body.supplierId || null,
    costPrice,
    sellingPrice,
    discountPercentage,
    stockQty: body.stockQty ?? 0,
    minStockLevel: body.minStockLevel ?? 0,
    unit: body.unit || 'pcs',
    isActive: body.isActive !== undefined ? body.isActive : true
  });
  const withAssoc = await Product.findByPk(product.id, { include: includeAssoc });
  return toDto(withAssoc);
}

async function update(body) {
  logger.info('ProductService.update() invoked');
  const product = await Product.findByPk(body.id);
  if (!product) throw new Error('Product not found');
  const costPrice = body.costPrice != null ? Number(body.costPrice) : Number(product.costPrice);
  const discountPercentage = body.discountPercentage != null ? Number(body.discountPercentage) : Number(product.discountPercentage);
  const sellingPrice = body.sellingPrice != null ? Number(body.sellingPrice) : computeSellingPrice(costPrice, discountPercentage);
  await product.update({
    barCode: body.barCode !== undefined ? body.barCode : product.barCode,
    productName: body.productName ?? product.productName,
    categoryId: body.categoryId ?? product.categoryId,
    supplierId: body.supplierId !== undefined ? body.supplierId : product.supplierId,
    costPrice,
    sellingPrice,
    discountPercentage,
    stockQty: body.stockQty !== undefined ? body.stockQty : product.stockQty,
    minStockLevel: body.minStockLevel !== undefined ? body.minStockLevel : product.minStockLevel,
    unit: body.unit ?? product.unit,
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
  if (query.supplierId) where.supplierId = query.supplierId;
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
  await product.destroy();
  return { id };
}

module.exports = {
  save,
  update,
  getAll,
  getAllPaginated,
  getById,
  search,
  getByCategory,
  getByPrice,
  deleteById,
  computeSellingPrice
};
