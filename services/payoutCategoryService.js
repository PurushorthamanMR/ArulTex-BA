const { Op } = require('sequelize');
const { PayoutCategory } = require('../models');
const logger = require('../config/logger');

class PayoutCategoryService {
  async save(payoutCategoryDto) {
    logger.info('PayoutCategoryService.save() invoked');
    
    const payoutCategory = await PayoutCategory.create({
      categoryName: payoutCategoryDto.categoryName,
      isActive: payoutCategoryDto.isActive !== undefined ? payoutCategoryDto.isActive : true
    });

    return this.transformToDto(payoutCategory);
  }

  async updatePayoutCategory(payoutCategoryDto) {
    logger.info('PayoutCategoryService.updatePayoutCategory() invoked');
    
    const payoutCategory = await PayoutCategory.findByPk(payoutCategoryDto.id);
    if (!payoutCategory) {
      throw new Error('Payout category not found');
    }

    await payoutCategory.update({
      categoryName: payoutCategoryDto.categoryName
    });

    return this.transformToDto(payoutCategory);
  }

  async updatePayoutCategoryStatus(id, status) {
    logger.info('PayoutCategoryService.updatePayoutCategoryStatus() invoked');
    
    const payoutCategory = await PayoutCategory.findByPk(id);
    if (!payoutCategory) {
      return null;
    }

    await payoutCategory.update({ isActive: status });
    return this.transformToDto(payoutCategory);
  }

  async getAllPayoutCategory() {
    logger.info('PayoutCategoryService.getAllPayoutCategory() invoked');
    
    const categories = await PayoutCategory.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return categories.map(cat => this.transformToDto(cat));
  }

  async getAllPagePayoutCategory(pageNumber, pageSize, status, searchParams) {
    logger.info('PayoutCategoryService.getAllPagePayoutCategory() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    if (searchParams && searchParams.categoryName) {
      where.categoryName = { [Op.like]: `%${searchParams.categoryName}%` };
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await PayoutCategory.findAndCountAll({
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

  async getAllByName(payoutCategory) {
    logger.info('PayoutCategoryService.getAllByName() invoked');
    
    const categories = await PayoutCategory.findAll({
      where: {
        categoryName: { [Op.like]: `%${payoutCategory}%` },
        isActive: true
      }
    });

    return categories.map(cat => this.transformToDto(cat));
  }

  transformToDto(payoutCategory) {
    if (!payoutCategory) return null;
    
    return {
      id: payoutCategory.id,
      categoryName: payoutCategory.categoryName,
      isActive: payoutCategory.isActive
    };
  }
}

module.exports = new PayoutCategoryService();
