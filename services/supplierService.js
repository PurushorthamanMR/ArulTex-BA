const { Op } = require('sequelize');
const { Supplier } = require('../models');
const logger = require('../config/logger');

function toDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    supplierName: row.supplierName,
    phone: row.phone,
    email: row.email,
    address: row.address,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

async function save(body) {
  logger.info('SupplierService.save() invoked');
  const supplier = await Supplier.create({
    supplierName: body.supplierName,
    phone: body.phone,
    email: body.email || null,
    address: body.address || null,
    isActive: body.isActive !== undefined ? body.isActive : true
  });
  return toDto(supplier);
}

async function update(body) {
  logger.info('SupplierService.update() invoked');
  const supplier = await Supplier.findByPk(body.id);
  if (!supplier) throw new Error('Supplier not found');
  await supplier.update({
    supplierName: body.supplierName ?? supplier.supplierName,
    phone: body.phone ?? supplier.phone,
    email: body.email !== undefined ? body.email : supplier.email,
    address: body.address !== undefined ? body.address : supplier.address,
    isActive: body.isActive !== undefined ? body.isActive : supplier.isActive
  });
  return toDto(supplier);
}

async function getAll() {
  logger.info('SupplierService.getAll() invoked');
  const list = await Supplier.findAll({ order: [['supplierName', 'ASC']] });
  return list.map(toDto);
}

async function getById(id) {
  logger.info('SupplierService.getById() invoked');
  const supplier = await Supplier.findByPk(id);
  return toDto(supplier);
}

async function search(query) {
  logger.info('SupplierService.search() invoked');
  const where = {};
  if (query.supplierName) where.supplierName = { [Op.like]: `%${query.supplierName}%` };
  if (query.phone) where.phone = { [Op.like]: `%${query.phone}%` };
  if (query.email) where.email = { [Op.like]: `%${query.email}%` };
  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true' || query.isActive === true;
  }
  const list = await Supplier.findAll({ where, order: [['supplierName', 'ASC']] });
  return list.map(toDto);
}

async function deleteById(id) {
  logger.info('SupplierService.deleteById() invoked');
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error('Supplier not found');
  await supplier.destroy();
  return { id };
}

module.exports = {
  save,
  update,
  getAll,
  getById,
  search,
  deleteById
};
