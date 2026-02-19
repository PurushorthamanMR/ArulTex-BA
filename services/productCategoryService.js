const { Op } = require('sequelize');
const { ProductCategory } = require('../models');
const logger = require('../config/logger');

class ProductCategoryService {
  async getAll() {
    logger.info('ProductCategoryService.getAll() invoked');
    
    const categories = await ProductCategory.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return categories.map(cat => this.transformToDto(cat));
  }

  async getAllPageProductCategory(pageNumber, pageSize, status, searchParams) {
    logger.info('ProductCategoryService.getAllPageProductCategory() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    if (searchParams && searchParams.productCategoryName) {
      where.productCategoryName = { [Op.like]: `%${searchParams.productCategoryName}%` };
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await ProductCategory.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const categories = rows.map(cat => this.transformToDto(cat));

    return {
      content: categories,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async save(productCategoryDto) {
    logger.info('ProductCategoryService.save() invoked');
    
    const category = await ProductCategory.create({
      productCategoryName: productCategoryDto.productCategoryName,
      isActive: productCategoryDto.isActive !== undefined ? productCategoryDto.isActive : true,
      agevalidation: productCategoryDto.agevalidation !== undefined ? productCategoryDto.agevalidation : false
    });

    return this.transformToDto(category);
  }

  async update(productCategoryDto) {
    logger.info('ProductCategoryService.update() invoked');
    
    const category = await ProductCategory.findByPk(productCategoryDto.id);
    if (!category) {
      throw new Error('Product category not found');
    }

    await category.update({
      productCategoryName: productCategoryDto.productCategoryName,
      agevalidation: productCategoryDto.agevalidation !== undefined ? productCategoryDto.agevalidation : category.agevalidation
    });

    return this.transformToDto(category);
  }

  async getAllByName(productCategoryName) {
    logger.info('ProductCategoryService.getAllByName() invoked');
    
    const categories = await ProductCategory.findAll({
      where: {
        productCategoryName: { [Op.like]: `%${productCategoryName}%` },
        isActive: true
      }
    });

    return categories.map(cat => this.transformToDto(cat));
  }

  async updateProductCategoryStatus(id, status) {
    logger.info('ProductCategoryService.updateProductCategoryStatus() invoked');
    
    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return null;
    }

    await category.update({ isActive: status });
    return this.transformToDto(category);
  }

  transformToDto(category) {
    if (!category) return null;
    
    return {
      id: category.id,
      productCategoryName: category.productCategoryName,
      isActive: category.isActive,
      agevalidation: category.agevalidation
    };
  }
}

module.exports = new ProductCategoryService();
