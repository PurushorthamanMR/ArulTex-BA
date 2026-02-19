const { Country } = require('../models');
const logger = require('../config/logger');

class CountryService {
  async save(countryDto) {
    logger.info('CountryService.save() invoked');
    
    const country = await Country.create({
      countryName: countryDto.countryName,
      isActive: countryDto.isActive !== undefined ? countryDto.isActive : true
    });

    return this.transformToDto(country);
  }

  async getAll() {
    logger.info('CountryService.getAll() invoked');
    
    const countries = await Country.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    return countries.map(country => this.transformToDto(country));
  }

  async getAllPage(pageNumber, pageSize) {
    logger.info('CountryService.getAllPage() invoked');
    
    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Country.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const countries = rows.map(country => this.transformToDto(country));

    return {
      content: countries,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(country) {
    if (!country) return null;
    
    return {
      id: country.id,
      countryName: country.countryName,
      isActive: country.isActive
    };
  }
}

module.exports = new CountryService();
