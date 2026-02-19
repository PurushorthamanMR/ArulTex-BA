const { Op } = require('sequelize');
const { Customer } = require('../models');
const logger = require('../config/logger');

class CustomerService {
  /**
   * Save a new customer
   */
  async saveCustomer(customerDto) {
    logger.info('CustomerService.saveCustomer() invoked');
    
    const customer = await Customer.create({
      name: customerDto.name,
      mobileNumber: customerDto.mobileNumber,
      isActive: customerDto.isActive !== undefined ? customerDto.isActive : true,
      createdDate: new Date()
    });

    return this.transformToDto(customer);
  }

  /**
   * Get all customers with pagination
   */
  async getAllPageCustomer(pageNumber, pageSize, status, searchParams) {
    logger.info('CustomerService.getAllPageCustomer() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    // Apply search filters
    if (searchParams) {
      if (searchParams.name) {
        where.name = { [Op.like]: `%${searchParams.name}%` };
      }
      if (searchParams.mobileNumber) {
        where.mobileNumber = { [Op.like]: `%${searchParams.mobileNumber}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Customer.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['createdDate', 'DESC']]
    });

    const customers = rows.map(customer => this.transformToDto(customer));

    return {
      content: customers,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  /**
   * Get customer by search (name)
   */
  async getCustomerBySearch(name) {
    logger.info('CustomerService.getCustomerBySearch() invoked');
    
    const customers = await Customer.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        isActive: true
      },
      order: [['createdDate', 'DESC']]
    });

    return customers.map(customer => this.transformToDto(customer));
  }

  /**
   * Get customer by mobile number
   */
  async getCustomerByMobileNumber(mobileNumber) {
    logger.info('CustomerService.getCustomerByMobileNumber() invoked');
    
    const customers = await Customer.findAll({
      where: {
        mobileNumber: { [Op.like]: `%${mobileNumber}%` },
        isActive: true
      },
      order: [['createdDate', 'DESC']]
    });

    return customers.map(customer => this.transformToDto(customer));
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id) {
    logger.info('CustomerService.getCustomerById() invoked');
    
    const customer = await Customer.findByPk(id);
    return customer ? [this.transformToDto(customer)] : [];
  }

  /**
   * Get all customers
   */
  async getAllCustomer() {
    logger.info('CustomerService.getAllCustomer() invoked');
    
    const customers = await Customer.findAll({
      where: { isActive: true },
      order: [['createdDate', 'DESC']]
    });

    return customers.map(customer => this.transformToDto(customer));
  }

  /**
   * Update customer
   */
  async updateCustomer(customerDto) {
    logger.info('CustomerService.updateCustomer() invoked');
    
    const customer = await Customer.findByPk(customerDto.id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    await customer.update({
      name: customerDto.name,
      mobileNumber: customerDto.mobileNumber
    });

    return this.transformToDto(customer);
  }

  /**
   * Update customer status
   */
  async updateCustomerStatus(customerId, status) {
    logger.info('CustomerService.updateCustomerStatus() invoked');
    
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return null;
    }

    await customer.update({ isActive: status });
    return this.transformToDto(customer);
  }

  /**
   * Transform customer model to DTO
   */
  transformToDto(customer) {
    if (!customer) return null;
    
    return {
      id: customer.id,
      name: customer.name,
      mobileNumber: customer.mobileNumber,
      createdDate: customer.createdDate,
      isActive: customer.isActive
    };
  }
}

module.exports = new CustomerService();
