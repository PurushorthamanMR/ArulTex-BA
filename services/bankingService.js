const { Op } = require('sequelize');
const { Banking, Branch } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../config/logger');

class BankingService {
  async getAllPage(pageNumber, pageSize, searchParams) {
    logger.info('BankingService.getAllPage() invoked');
    
    const where = {};

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Banking.findAndCountAll({
      where,
      include: [
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const bankingList = rows.map(banking => this.transformToDto(banking));

    return {
      content: bankingList,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async save(bankingDto) {
    logger.info('BankingService.save() invoked');
    
    const banking = await Banking.create({
      amount: bankingDto.amount,
      branchId: bankingDto.branchDto?.id || bankingDto.branchId
    });

    const bankingWithAssociations = await Banking.findByPk(banking.id, {
      include: [
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(bankingWithAssociations);
  }

  async getTotalBanking() {
    logger.info('BankingService.getTotalBanking() invoked');
    
    // Get all banking records ordered by ID
    const allBankingList = await Banking.findAll({
      order: [['id', 'ASC']]
    });
    
    if (!allBankingList || allBankingList.length === 0) {
      return 0.0;
    }
    
    // Check if any record has generatedDateTime
    const hasGeneratedDateTime = allBankingList.some(banking => banking.generatedDateTime != null);
    
    let totalAmount = 0.0;
    
    if (hasGeneratedDateTime) {
      // Find the last record with generatedDateTime
      let lastGeneratedIndex = -1;
      for (let i = 0; i < allBankingList.length; i++) {
        if (allBankingList[i].generatedDateTime != null) {
          lastGeneratedIndex = i;
        }
      }
      
      // Sum amounts from records after the last generatedDateTime
      for (let i = lastGeneratedIndex + 1; i < allBankingList.length; i++) {
        if (allBankingList[i].amount != null) {
          totalAmount += allBankingList[i].amount;
        }
      }
    } else {
      // Sum all amounts if no record has generatedDateTime
      for (const banking of allBankingList) {
        if (banking.amount != null) {
          totalAmount += banking.amount;
        }
      }
    }
    
    return totalAmount;
  }

  async getBankingCount(startDate, endDate) {
    logger.info('BankingService.getBankingCount() invoked');
    
    const count = await Banking.count({
      where: {
        dateTime: {
          [Op.between]: [startDate, endDate]
        },
        isActive: true
      }
    });
    
    return count;
  }

  transformToDto(banking) {
    if (!banking) return null;
    
    return {
      id: banking.id,
      amount: banking.amount,
      branchDto: banking.branch ? {
        id: banking.branch.id,
        branchName: banking.branch.branchName
      } : null
    };
  }
}

module.exports = new BankingService();
