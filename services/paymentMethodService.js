const { PaymentMethod } = require('../models');
const logger = require('../config/logger');

class PaymentMethodService {
  async save(paymentMethodDto) {
    logger.info('PaymentMethodService.save() invoked');
    
    const paymentMethod = await PaymentMethod.create({
      type: paymentMethodDto.type,
      isActive: paymentMethodDto.isActive !== undefined ? paymentMethodDto.isActive : true
    });

    return this.transformToDto(paymentMethod);
  }

  async getAll() {
    logger.info('PaymentMethodService.getAll() invoked');
    
    const paymentMethods = await PaymentMethod.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return paymentMethods.map(pm => this.transformToDto(pm));
  }

  transformToDto(paymentMethod) {
    if (!paymentMethod) return null;
    
    return {
      id: paymentMethod.id,
      type: paymentMethod.type,
      isActive: paymentMethod.isActive
    };
  }
}

module.exports = new PaymentMethodService();
