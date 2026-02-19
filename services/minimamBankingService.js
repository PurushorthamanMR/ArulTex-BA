const { MinimamBanking, Branch } = require('../models');
const logger = require('../config/logger');

class MinimamBankingService {
  async save(minimamBankingDto) {
    logger.info('MinimamBankingService.save() invoked');
    
    const minimamBanking = await MinimamBanking.create({
      amount: minimamBankingDto.amount,
      branchId: minimamBankingDto.branchDto?.id || minimamBankingDto.branchId
    });

    const minimamBankingWithAssociations = await MinimamBanking.findByPk(minimamBanking.id, {
      include: [
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(minimamBankingWithAssociations);
  }

  async update(minimamBankingDto) {
    logger.info('MinimamBankingService.update() invoked');
    
    const minimamBanking = await MinimamBanking.findByPk(minimamBankingDto.id);
    if (!minimamBanking) {
      throw new Error('Minimam banking not found');
    }

    await minimamBanking.update({
      amount: minimamBankingDto.amount !== undefined ? minimamBankingDto.amount : minimamBanking.amount,
      branchId: minimamBankingDto.branchDto?.id || minimamBankingDto.branchId || minimamBanking.branchId
    });

    const updatedMinimamBanking = await MinimamBanking.findByPk(minimamBanking.id, {
      include: [
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedMinimamBanking);
  }

  async getAll() {
    logger.info('MinimamBankingService.getAll() invoked');
    
    const minimamBankingList = await MinimamBanking.findAll({
      include: [
        { model: Branch, as: 'branch' }
      ],
      order: [['id', 'DESC']]
    });

    return minimamBankingList.map(banking => this.transformToDto(banking));
  }

  transformToDto(minimamBanking) {
    if (!minimamBanking) return null;
    
    return {
      id: minimamBanking.id,
      amount: minimamBanking.amount,
      branchDto: minimamBanking.branch ? {
        id: minimamBanking.branch.id,
        branchName: minimamBanking.branch.branchName
      } : null
    };
  }
}

module.exports = new MinimamBankingService();
