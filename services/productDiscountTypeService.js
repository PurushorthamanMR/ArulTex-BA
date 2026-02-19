const { ProductDiscountType } = require('../models');
const logger = require('../config/logger');

class ProductDiscountTypeService {
  async save(productDiscountTypeDto) {
    logger.info('ProductDiscountTypeService.save() invoked');
    
    const productDiscountType = await ProductDiscountType.create({
      type: productDiscountTypeDto.type,
      isActive: productDiscountTypeDto.isActive !== undefined ? productDiscountTypeDto.isActive : true
    });

    return this.transformToDto(productDiscountType);
  }

  async update(productDiscountTypeDto) {
    logger.info('ProductDiscountTypeService.update() invoked');
    
    const productDiscountType = await ProductDiscountType.findByPk(productDiscountTypeDto.id);
    if (!productDiscountType) {
      throw new Error('Product discount type not found');
    }

    await productDiscountType.update({
      type: productDiscountTypeDto.type
    });

    return this.transformToDto(productDiscountType);
  }

  async updateStatus(id, status) {
    logger.info('ProductDiscountTypeService.updateStatus() invoked');
    
    const productDiscountType = await ProductDiscountType.findByPk(id);
    if (!productDiscountType) {
      return null;
    }

    await productDiscountType.update({ isActive: status });
    return this.transformToDto(productDiscountType);
  }

  async getAll() {
    logger.info('ProductDiscountTypeService.getAll() invoked');
    
    const types = await ProductDiscountType.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return types.map(type => this.transformToDto(type));
  }

  transformToDto(productDiscountType) {
    if (!productDiscountType) return null;
    
    return {
      id: productDiscountType.id,
      type: productDiscountType.type,
      isActive: productDiscountType.isActive
    };
  }
}

module.exports = new ProductDiscountTypeService();
