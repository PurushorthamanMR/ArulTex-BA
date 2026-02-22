const { Op } = require('sequelize');
const { ProductCategory } = require('../models');
const logger = require('../config/logger');

function toDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    categoryName: row.categoryName,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

async function save(body) {
  logger.info('ProductCategoryService.save() invoked');
  const category = await ProductCategory.create({
    categoryName: body.categoryName,
    isActive: body.isActive !== undefined ? body.isActive : true
  });
  return toDto(category);
}

async function update(body) {
  logger.info('ProductCategoryService.update() invoked');
  const category = await ProductCategory.findByPk(body.id);
  if (!category) throw new Error('Category not found');
  await category.update({
    categoryName: body.categoryName ?? category.categoryName,
    isActive: body.isActive !== undefined ? body.isActive : category.isActive
  });
  return toDto(category);
}

async function getAll() {
  logger.info('ProductCategoryService.getAll() invoked');
  const list = await ProductCategory.findAll({ order: [['categoryName', 'ASC']] });
  return list.map(toDto);
}

async function getById(id) {
  logger.info('ProductCategoryService.getById() invoked');
  const category = await ProductCategory.findByPk(id);
  return toDto(category);
}

async function search(query) {
  logger.info('ProductCategoryService.search() invoked');
  const where = {};
  if (query.categoryName) {
    where.categoryName = { [Op.like]: `%${query.categoryName}%` };
  }
  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true' || query.isActive === true;
  }
  const list = await ProductCategory.findAll({ where, order: [['categoryName', 'ASC']] });
  return list.map(toDto);
}

async function deleteById(id) {
  logger.info('ProductCategoryService.deleteById() invoked');
  const category = await ProductCategory.findByPk(id);
  if (!category) throw new Error('Category not found');
  await category.destroy();
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
