const { Op } = require('sequelize');
const { ShopDetails } = require('../models');
const logger = require('../config/logger');

class ShopDetailsService {
  async save(shopDetailsDto) {
    logger.info('ShopDetailsService.save() invoked');
    
    const shopDetails = await ShopDetails.create({
      name: shopDetailsDto.name,
      address: shopDetailsDto.address,
      contactNumber: shopDetailsDto.contactNumber,
      whatsappNumber: shopDetailsDto.whatsappNumber,
      email: shopDetailsDto.email,
      isActive: shopDetailsDto.isActive !== undefined ? shopDetailsDto.isActive : true
    });

    return this.transformToDto(shopDetails);
  }

  async getAll() {
    logger.info('ShopDetailsService.getAll() invoked');
    
    const shopDetailsList = await ShopDetails.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return shopDetailsList.map(shop => this.transformToDto(shop));
  }

  async getByName(name) {
    logger.info('ShopDetailsService.getByName() invoked');
    
    const shopDetailsList = await ShopDetails.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        isActive: true
      }
    });

    return shopDetailsList.map(shop => this.transformToDto(shop));
  }

  async getAllPageShopDetails(pageNumber, pageSize, status, searchParams) {
    logger.info('ShopDetailsService.getAllPageShopDetails() invoked');
    
    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }

    if (searchParams && searchParams.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await ShopDetails.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const shopDetailsList = rows.map(shop => this.transformToDto(shop));

    return {
      content: shopDetailsList,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(shopDetails) {
    if (!shopDetails) return null;
    
    return {
      id: shopDetails.id,
      name: shopDetails.name,
      address: shopDetails.address,
      contactNumber: shopDetails.contactNumber,
      whatsappNumber: shopDetails.whatsappNumber,
      email: shopDetails.email,
      isActive: shopDetails.isActive
    };
  }
}

module.exports = new ShopDetailsService();
