const { Op } = require('sequelize');
const { Customer } = require('../models');
const logger = require('../config/logger');

function toDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customerName,
    phone: row.phone ?? null,
    email: row.email ?? null,
    address: row.address ?? null,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

async function save(body) {
  logger.info('CustomerService.save() invoked');
  const customer = await Customer.create({
    customerName: body.customerName,
    phone: body.phone ?? null,
    email: body.email ?? null,
    address: body.address ?? null,
    isActive: body.isActive !== undefined ? body.isActive : true
  });
  return toDto(customer);
}

async function update(body) {
  logger.info('CustomerService.update() invoked');
  const customer = await Customer.findByPk(body.id);
  if (!customer) throw new Error('Customer not found');
  await customer.update({
    customerName: body.customerName ?? customer.customerName,
    phone: body.phone !== undefined ? body.phone : customer.phone,
    email: body.email !== undefined ? body.email : customer.email,
    address: body.address !== undefined ? body.address : customer.address,
    isActive: body.isActive !== undefined ? body.isActive : customer.isActive
  });
  return toDto(customer);
}

async function getAll() {
  logger.info('CustomerService.getAll() invoked');
  const list = await Customer.findAll({ order: [['customerName', 'ASC']] });
  return list.map(toDto);
}

async function getById(id) {
  logger.info('CustomerService.getById() invoked');
  const customer = await Customer.findByPk(id);
  return toDto(customer);
}

async function search(query) {
  logger.info('CustomerService.search() invoked');
  const where = {};
  if (query.customerName && String(query.customerName).trim()) {
    where.customerName = { [Op.like]: `%${String(query.customerName).trim()}%` };
  }
  if (query.phone && String(query.phone).trim()) {
    where.phone = { [Op.like]: `%${String(query.phone).trim()}%` };
  }
  if (query.email && String(query.email).trim()) {
    where.email = { [Op.like]: `%${String(query.email).trim()}%` };
  }
  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true' || query.isActive === true;
  }
  const list = await Customer.findAll({ where, order: [['customerName', 'ASC']] });
  return list.map(toDto);
}

async function deleteById(id) {
  logger.info('CustomerService.deleteById() invoked');
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error('Customer not found');
  await customer.destroy();
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
