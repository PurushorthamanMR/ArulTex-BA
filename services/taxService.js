const { Op } = require('sequelize');
const { Tax } = require('../models');
const logger = require('../config/logger');

class TaxService {
  async save(taxDto) {
    logger.info('TaxService.save() invoked');
    
    const tax = await Tax.create({
      taxPercentage: taxDto.taxPercentage,
      isActive: taxDto.isActive !== undefined ? taxDto.isActive : true
    });

    return this.transformToDto(tax);
  }

  async update(taxDto) {
    logger.info('TaxService.update() invoked');
    
    const tax = await Tax.findByPk(taxDto.id);
    if (!tax) {
      throw new Error('Tax not found');
    }

    await tax.update({
      taxPercentage: taxDto.taxPercentage
    });

    return this.transformToDto(tax);
  }

  async updateTaxStatus(id, status) {
    logger.info('TaxService.updateTaxStatus() invoked');
    
    const tax = await Tax.findByPk(id);
    if (!tax) {
      return null;
    }

    await tax.update({ isActive: status });
    return this.transformToDto(tax);
  }

  async getTaxByName(taxPercentage) {
    logger.info('TaxService.getTaxByName() invoked');
    
    const taxes = await Tax.findAll({
      where: {
        taxPercentage: taxPercentage,
        isActive: true
      }
    });

    return taxes.map(tax => this.transformToDto(tax));
  }

  async getAll() {
    logger.info('TaxService.getAll() invoked');
    
    const taxes = await Tax.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return taxes.map(tax => this.transformToDto(tax));
  }

  async getAllPageTax(pageNumber, pageSize, status, searchParams) {
    logger.info('TaxService.getAllPageTax() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Tax.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const taxes = rows.map(tax => this.transformToDto(tax));

    return {
      content: taxes,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(tax) {
    if (!tax) return null;
    
    return {
      id: tax.id,
      taxPercentage: tax.taxPercentage,
      isActive: tax.isActive
    };
  }
}

module.exports = new TaxService();
