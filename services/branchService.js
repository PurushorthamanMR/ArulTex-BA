const { Op } = require('sequelize');
const { Branch, Country, ShopDetails } = require('../models');
const logger = require('../config/logger');

class BranchService {
  async getAll(pageNumber, pageSize, searchParams) {
    logger.info('BranchService.getAll() invoked');
    
    const where = {};
    if (searchParams && searchParams.status) {
      where.isActive = searchParams.status === 'true';
    }

    if (searchParams) {
      if (searchParams.branchName) {
        where.branchName = { [Op.like]: `%${searchParams.branchName}%` };
      }
      if (searchParams.branchCode) {
        where.branchCode = { [Op.like]: `%${searchParams.branchCode}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Branch.findAndCountAll({
      where,
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const branches = rows.map(branch => this.transformToDto(branch));

    return {
      content: branches,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getAllBranches() {
    logger.info('BranchService.getAllBranches() invoked');
    
    const branches = await Branch.findAll({
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ],
      order: [['id', 'DESC']]
    });

    return branches.map(branch => this.transformToDto(branch));
  }

  async save(branchDto) {
    logger.info('BranchService.save() invoked');
    
    const branch = await Branch.create({
      branchName: branchDto.branchName,
      branchCode: branchDto.branchCode,
      address: branchDto.address,
      contactNumber: branchDto.contactNumber,
      emailAddress: branchDto.emailAddress,
      isActive: branchDto.isActive !== undefined ? branchDto.isActive : true,
      countryId: branchDto.countryDto?.id || branchDto.countryId,
      shopDetailsId: branchDto.shopDetailsDto?.id || branchDto.shopDetailsId
    });

    const branchWithAssociations = await Branch.findByPk(branch.id, {
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return this.transformToDto(branchWithAssociations);
  }

  async getAllBranchesBySbuId(sbuId) {
    logger.info('BranchService.getAllBranchesBySbuId() invoked');
    // Note: SBU functionality may need additional model/field
    const branches = await Branch.findAll({
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return branches.map(branch => this.transformToDto(branch));
  }

  async updateBranch(branchDto) {
    logger.info('BranchService.updateBranch() invoked');
    
    const branch = await Branch.findByPk(branchDto.id);
    if (!branch) {
      throw new Error('Branch not found');
    }

    await branch.update({
      branchName: branchDto.branchName,
      branchCode: branchDto.branchCode,
      address: branchDto.address,
      contactNumber: branchDto.contactNumber,
      emailAddress: branchDto.emailAddress,
      countryId: branchDto.countryDto?.id || branchDto.countryId || branch.countryId,
      shopDetailsId: branchDto.shopDetailsDto?.id || branchDto.shopDetailsId || branch.shopDetailsId
    });

    const updatedBranch = await Branch.findByPk(branch.id, {
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return this.transformToDto(updatedBranch);
  }

  async getBranchByName(branchName) {
    logger.info('BranchService.getBranchByName() invoked');
    
    const branches = await Branch.findAll({
      where: {
        branchName: { [Op.like]: `%${branchName}%` }
      },
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return branches.map(branch => this.transformToDto(branch));
  }

  async updateBranchStatus(branchId, status) {
    logger.info('BranchService.updateBranchStatus() invoked');
    
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return null;
    }

    await branch.update({ isActive: status });

    const updatedBranch = await Branch.findByPk(branchId, {
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return this.transformToDto(updatedBranch);
  }

  async getBranchById(id) {
    logger.info('BranchService.getBranchById() invoked');
    
    const branch = await Branch.findByPk(id, {
      include: [
        { model: Country, as: 'country' },
        { model: ShopDetails, as: 'shopDetails' }
      ]
    });

    return branch ? [this.transformToDto(branch)] : [];
  }

  transformToDto(branch) {
    if (!branch) return null;
    
    return {
      id: branch.id,
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      address: branch.address,
      contactNumber: branch.contactNumber,
      emailAddress: branch.emailAddress,
      isActive: branch.isActive,
      countryDto: branch.country ? {
        id: branch.country.id,
        countryName: branch.country.countryName,
        isActive: branch.country.isActive
      } : null,
      shopDetailsDto: branch.shopDetails ? {
        id: branch.shopDetails.id,
        name: branch.shopDetails.name,
        address: branch.shopDetails.address,
        contactNumber: branch.shopDetails.contactNumber,
        whatsappNumber: branch.shopDetails.whatsappNumber,
        email: branch.shopDetails.email,
        isActive: branch.shopDetails.isActive
      } : null
    };
  }
}

module.exports = new BranchService();
