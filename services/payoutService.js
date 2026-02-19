const { Op } = require('sequelize');
const { Payout, PayoutCategory, Branch, User } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../config/logger');

class PayoutService {
  async getAllPagePayout(pageNumber, pageSize, searchParams) {
    logger.info('PayoutService.getAllPagePayout() invoked');
    
    const where = {};

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Payout.findAndCountAll({
      where,
      include: [
        { model: PayoutCategory, as: 'payoutCategory' },
        { model: Branch, as: 'branch' },
        { model: User, as: 'user' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const payouts = rows.map(payout => this.transformToDto(payout));

    return {
      content: payouts,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getAllPayout() {
    logger.info('PayoutService.getAllPayout() invoked');
    
    const payouts = await Payout.findAll({
      include: [
        { model: PayoutCategory, as: 'payoutCategory' },
        { model: Branch, as: 'branch' },
        { model: User, as: 'user' }
      ],
      order: [['id', 'DESC']]
    });

    return payouts.map(payout => this.transformToDto(payout));
  }

  async save(payoutDto) {
    logger.info('PayoutService.save() invoked');
    
    const payout = await Payout.create({
      amount: payoutDto.amount,
      description: payoutDto.description,
      payoutCategoryId: payoutDto.payoutCategoryDto?.id || payoutDto.payoutCategoryId,
      branchId: payoutDto.branchDto?.id || payoutDto.branchId,
      userId: payoutDto.userDto?.id || payoutDto.userId
    });

    const payoutWithAssociations = await Payout.findByPk(payout.id, {
      include: [
        { model: PayoutCategory, as: 'payoutCategory' },
        { model: Branch, as: 'branch' },
        { model: User, as: 'user' }
      ]
    });

    return this.transformToDto(payoutWithAssociations);
  }

  async updatePayout(payoutDto) {
    logger.info('PayoutService.updatePayout() invoked');
    
    const payout = await Payout.findByPk(payoutDto.id);
    if (!payout) {
      throw new Error('Payout not found');
    }

    await payout.update({
      amount: payoutDto.amount !== undefined ? payoutDto.amount : payout.amount,
      description: payoutDto.description !== undefined ? payoutDto.description : payout.description,
      payoutCategoryId: payoutDto.payoutCategoryDto?.id || payoutDto.payoutCategoryId || payout.payoutCategoryId,
      branchId: payoutDto.branchDto?.id || payoutDto.branchId || payout.branchId,
      userId: payoutDto.userDto?.id || payoutDto.userId || payout.userId
    });

    const updatedPayout = await Payout.findByPk(payout.id, {
      include: [
        { model: PayoutCategory, as: 'payoutCategory' },
        { model: Branch, as: 'branch' },
        { model: User, as: 'user' }
      ]
    });

    return this.transformToDto(updatedPayout);
  }

  async updatePayoutStatus(id, status) {
    logger.info('PayoutService.updatePayoutStatus() invoked');
    // Note: Payout model may not have isActive, implement based on your model
    const payout = await Payout.findByPk(id);
    if (!payout) {
      return null;
    }

    // If payout has status field, update it
    const updatedPayout = await Payout.findByPk(id, {
      include: [
        { model: PayoutCategory, as: 'payoutCategory' },
        { model: Branch, as: 'branch' },
        { model: User, as: 'user' }
      ]
    });

    return this.transformToDto(updatedPayout);
  }

  async getTotalPayout() {
    logger.info('PayoutService.getTotalPayout() invoked');
    
    // Get all payout records ordered by ID
    const allPayoutList = await Payout.findAll({
      order: [['id', 'ASC']]
    });
    
    if (!allPayoutList || allPayoutList.length === 0) {
      return 0.0;
    }
    
    // Check if any record has generatedDateTime
    const hasGeneratedDateTime = allPayoutList.some(payout => payout.generatedDateTime != null);
    
    let totalAmount = 0.0;
    
    if (hasGeneratedDateTime) {
      // Find the last record with generatedDateTime
      let lastGeneratedIndex = -1;
      for (let i = 0; i < allPayoutList.length; i++) {
        if (allPayoutList[i].generatedDateTime != null) {
          lastGeneratedIndex = i;
        }
      }
      
      // Sum amounts from records after the last generatedDateTime
      for (let i = lastGeneratedIndex + 1; i < allPayoutList.length; i++) {
        if (allPayoutList[i].amount != null) {
          totalAmount += allPayoutList[i].amount;
        }
      }
    } else {
      // Sum all amounts if no record has generatedDateTime
      for (const payout of allPayoutList) {
        if (payout.amount != null) {
          totalAmount += payout.amount;
        }
      }
    }
    
    return totalAmount;
  }

  async getPayoutCount(startDate, endDate) {
    logger.info('PayoutService.getPayoutCount() invoked');
    
    const count = await Payout.count({
      where: {
        dateTime: {
          [Op.between]: [startDate, endDate]
        },
        isActive: true
      }
    });
    
    return count;
  }

  transformToDto(payout) {
    if (!payout) return null;
    
    return {
      id: payout.id,
      amount: payout.amount,
      description: payout.description,
      payoutCategoryDto: payout.payoutCategory ? {
        id: payout.payoutCategory.id,
        categoryName: payout.payoutCategory.categoryName,
        isActive: payout.payoutCategory.isActive
      } : null,
      branchDto: payout.branch ? {
        id: payout.branch.id,
        branchName: payout.branch.branchName
      } : null,
      userDto: payout.user ? {
        id: payout.user.id,
        firstName: payout.user.firstName,
        lastName: payout.user.lastName
      } : null
    };
  }
}

module.exports = new PayoutService();
