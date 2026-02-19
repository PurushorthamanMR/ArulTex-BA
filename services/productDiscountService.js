const { Op } = require('sequelize');
const { ProductDiscount, Product, ProductDiscountType } = require('../models');
const logger = require('../config/logger');

class ProductDiscountService {
  async save(productDiscountDto) {
    logger.info('ProductDiscountService.save() invoked');
    
    const productDiscount = await ProductDiscount.create({
      discountValue: productDiscountDto.discountValue,
      productId: productDiscountDto.productDto?.id || productDiscountDto.productId,
      productDiscountTypeId: productDiscountDto.productDiscountTypeDto?.id || productDiscountDto.productDiscountTypeId
    });

    const productDiscountWithAssociations = await ProductDiscount.findByPk(productDiscount.id, {
      include: [
        { model: Product, as: 'product' },
        { model: ProductDiscountType, as: 'productDiscountType' }
      ]
    });

    return this.transformToDto(productDiscountWithAssociations);
  }

  async update(productDiscountDto) {
    logger.info('ProductDiscountService.update() invoked');
    
    const productDiscount = await ProductDiscount.findByPk(productDiscountDto.id);
    if (!productDiscount) {
      throw new Error('Product discount not found');
    }

    await productDiscount.update({
      discountValue: productDiscountDto.discountValue !== undefined ? productDiscountDto.discountValue : productDiscount.discountValue,
      productId: productDiscountDto.productDto?.id || productDiscountDto.productId || productDiscount.productId,
      productDiscountTypeId: productDiscountDto.productDiscountTypeDto?.id || productDiscountDto.productDiscountTypeId || productDiscount.productDiscountTypeId
    });

    const updatedDiscount = await ProductDiscount.findByPk(productDiscount.id, {
      include: [
        { model: Product, as: 'product' },
        { model: ProductDiscountType, as: 'productDiscountType' }
      ]
    });

    return this.transformToDto(updatedDiscount);
  }

  async updateStatus(id, status) {
    logger.info('ProductDiscountService.updateStatus() invoked');
    // Note: ProductDiscount may not have isActive, implement based on your model
    const productDiscount = await ProductDiscount.findByPk(id);
    if (!productDiscount) {
      return null;
    }

    // If model has status field, update it
    const updatedDiscount = await ProductDiscount.findByPk(id, {
      include: [
        { model: Product, as: 'product' },
        { model: ProductDiscountType, as: 'productDiscountType' }
      ]
    });

    return this.transformToDto(updatedDiscount);
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('ProductDiscountService.getAllPage() invoked');
    
    const where = {};
    // Note: Implement status filtering based on your model structure

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await ProductDiscount.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product' },
        { model: ProductDiscountType, as: 'productDiscountType' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const discounts = rows.map(discount => this.transformToDto(discount));

    return {
      content: discounts,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(productDiscount) {
    if (!productDiscount) return null;
    
    return {
      id: productDiscount.id,
      discountValue: productDiscount.discountValue,
      productDto: productDiscount.product ? {
        id: productDiscount.product.id,
        name: productDiscount.product.name,
        barcode: productDiscount.product.barcode
      } : null,
      productDiscountTypeDto: productDiscount.productDiscountType ? {
        id: productDiscount.productDiscountType.id,
        type: productDiscount.productDiscountType.type,
        isActive: productDiscount.productDiscountType.isActive
      } : null
    };
  }
}

module.exports = new ProductDiscountService();
