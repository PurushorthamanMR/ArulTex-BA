const { EmployeeDiscount, User, Product } = require('../models');
const logger = require('../config/logger');

class EmployeeDiscountService {
  async save(employeeDiscountDto) {
    logger.info('EmployeeDiscountService.save() invoked');
    
    const employeeDiscount = await EmployeeDiscount.create({
      discountPercentage: employeeDiscountDto.discountPercentage,
      userId: employeeDiscountDto.userDto?.id || employeeDiscountDto.userId,
      productId: employeeDiscountDto.productDto?.id || employeeDiscountDto.productId
    });

    const employeeDiscountWithAssociations = await EmployeeDiscount.findByPk(employeeDiscount.id, {
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' }
      ]
    });

    return this.transformToDto(employeeDiscountWithAssociations);
  }

  async update(employeeDiscountDto) {
    logger.info('EmployeeDiscountService.update() invoked');
    
    const employeeDiscount = await EmployeeDiscount.findByPk(employeeDiscountDto.id);
    if (!employeeDiscount) {
      throw new Error('Employee discount not found');
    }

    await employeeDiscount.update({
      discountPercentage: employeeDiscountDto.discountPercentage !== undefined ? employeeDiscountDto.discountPercentage : employeeDiscount.discountPercentage,
      userId: employeeDiscountDto.userDto?.id || employeeDiscountDto.userId || employeeDiscount.userId,
      productId: employeeDiscountDto.productDto?.id || employeeDiscountDto.productId || employeeDiscount.productId
    });

    const updatedDiscount = await EmployeeDiscount.findByPk(employeeDiscount.id, {
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' }
      ]
    });

    return this.transformToDto(updatedDiscount);
  }

  async getAll() {
    logger.info('EmployeeDiscountService.getAll() invoked');
    
    const employeeDiscounts = await EmployeeDiscount.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' }
      ],
      order: [['id', 'DESC']]
    });

    return employeeDiscounts.map(discount => this.transformToDto(discount));
  }

  transformToDto(employeeDiscount) {
    if (!employeeDiscount) return null;
    
    return {
      id: employeeDiscount.id,
      discountPercentage: employeeDiscount.discountPercentage,
      userDto: employeeDiscount.user ? {
        id: employeeDiscount.user.id,
        firstName: employeeDiscount.user.firstName,
        lastName: employeeDiscount.user.lastName
      } : null,
      productDto: employeeDiscount.product ? {
        id: employeeDiscount.product.id,
        name: employeeDiscount.product.name,
        barcode: employeeDiscount.product.barcode
      } : null
    };
  }
}

module.exports = new EmployeeDiscountService();
