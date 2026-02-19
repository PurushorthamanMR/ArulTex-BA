const { Op } = require('sequelize');
const { Supplier } = require('../models');
const logger = require('../config/logger');

class SupplierService {
  async saveSupplier(supplierDto) {
    logger.info('SupplierService.saveSupplier() invoked');
    
    const supplier = await Supplier.create({
      name: supplierDto.name,
      contactNumber: supplierDto.contactNumber,
      emailAddress: supplierDto.emailAddress,
      address: supplierDto.address,
      isActive: supplierDto.isActive !== undefined ? supplierDto.isActive : true
    });

    return this.transformToDto(supplier);
  }

  async getSupplierByName(name) {
    logger.info('SupplierService.getSupplierByName() invoked');
    
    const suppliers = await Supplier.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        isActive: true
      }
    });

    return suppliers.map(supplier => this.transformToDto(supplier));
  }

  async updateSupplier(supplierDto) {
    logger.info('SupplierService.updateSupplier() invoked');
    
    const supplier = await Supplier.findByPk(supplierDto.id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    await supplier.update({
      name: supplierDto.name,
      contactNumber: supplierDto.contactNumber,
      emailAddress: supplierDto.emailAddress,
      address: supplierDto.address
    });

    return this.transformToDto(supplier);
  }

  async updateSupplierStatus(supplierId, status) {
    logger.info('SupplierService.updateSupplierStatus() invoked');
    
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return null;
    }

    await supplier.update({ isActive: status });
    return this.transformToDto(supplier);
  }

  async getSupplierById(id) {
    logger.info('SupplierService.getSupplierById() invoked');
    
    const supplier = await Supplier.findByPk(id);
    return supplier ? [this.transformToDto(supplier)] : [];
  }

  async getAllSupplier() {
    logger.info('SupplierService.getAllSupplier() invoked');
    
    const suppliers = await Supplier.findAll({
      where: { isActive: true },
      order: [['id', 'DESC']]
    });

    return suppliers.map(supplier => this.transformToDto(supplier));
  }

  async getAllPageSupplier(pageNumber, pageSize, status, searchParams) {
    logger.info('SupplierService.getAllPageSupplier() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    if (searchParams) {
      if (searchParams.name) {
        where.name = { [Op.like]: `%${searchParams.name}%` };
      }
      if (searchParams.contactNumber) {
        where.contactNumber = { [Op.like]: `%${searchParams.contactNumber}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Supplier.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const suppliers = rows.map(supplier => this.transformToDto(supplier));

    return {
      content: suppliers,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(supplier) {
    if (!supplier) return null;
    
    return {
      id: supplier.id,
      name: supplier.name,
      contactNumber: supplier.contactNumber,
      emailAddress: supplier.emailAddress,
      address: supplier.address,
      isActive: supplier.isActive
    };
  }
}

module.exports = new SupplierService();
