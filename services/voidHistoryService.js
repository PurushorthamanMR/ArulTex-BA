const { Op } = require('sequelize');
const { VoidHistory, Transaction, User } = require('../models');
const logger = require('../config/logger');

class VoidHistoryService {
  async save(voidHistoryDto) {
    logger.info('VoidHistoryService.save() invoked');
    
    const voidHistory = await VoidHistory.create({
      reason: voidHistoryDto.reason,
      transactionId: voidHistoryDto.transactionDto?.id || voidHistoryDto.transactionId,
      userId: voidHistoryDto.userDto?.id || voidHistoryDto.userId
    });

    const voidHistoryWithAssociations = await VoidHistory.findByPk(voidHistory.id, {
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'user' }
      ]
    });

    return this.transformToDto(voidHistoryWithAssociations);
  }

  async getAll() {
    logger.info('VoidHistoryService.getAll() invoked');
    
    const voidHistories = await VoidHistory.findAll({
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'user' }
      ],
      order: [['id', 'DESC']]
    });

    return voidHistories.map(history => this.transformToDto(history));
  }

  async getAllPage(pageNumber, pageSize, searchParams) {
    logger.info('VoidHistoryService.getAllPage() invoked');
    
    const where = {};

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await VoidHistory.findAndCountAll({
      where,
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'user' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const voidHistories = rows.map(history => this.transformToDto(history));

    return {
      content: voidHistories,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getAllPageByDate(pageNumber, pageSize, date, searchParams) {
    logger.info('VoidHistoryService.getAllPageByDate() invoked');
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const where = {};
    // Filter by transaction date if transaction has dateTime field
    // This would require joining with Transaction table

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await VoidHistory.findAndCountAll({
      where,
      include: [
        { 
          model: Transaction, 
          as: 'transaction',
          where: {
            dateTime: {
              [Op.between]: [startDate, endDate]
            }
          },
          required: true
        },
        { model: User, as: 'user' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const voidHistories = rows.map(history => this.transformToDto(history));

    return {
      content: voidHistories,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getAllPageByUserId(pageNumber, pageSize, userId, searchParams) {
    logger.info('VoidHistoryService.getAllPageByUserId() invoked');
    
    const where = {
      userId: userId
    };

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await VoidHistory.findAndCountAll({
      where,
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'user' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const voidHistories = rows.map(history => this.transformToDto(history));

    return {
      content: voidHistories,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(voidHistory) {
    if (!voidHistory) return null;
    
    return {
      id: voidHistory.id,
      reason: voidHistory.reason,
      transactionDto: voidHistory.transaction ? {
        id: voidHistory.transaction.id,
        totalAmount: voidHistory.transaction.totalAmount,
        dateTime: voidHistory.transaction.dateTime
      } : null,
      userDto: voidHistory.user ? {
        id: voidHistory.user.id,
        firstName: voidHistory.user.firstName,
        lastName: voidHistory.user.lastName
      } : null
    };
  }
}

module.exports = new VoidHistoryService();
