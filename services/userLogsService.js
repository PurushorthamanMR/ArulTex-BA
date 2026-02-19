const { Op } = require('sequelize');
const { UserLogs, User } = require('../models');
const logger = require('../config/logger');

class UserLogsService {
  async login(userLogsDto) {
    logger.info('UserLogsService.login() invoked');
    
    const userLog = await UserLogs.create({
      userId: userLogsDto.userDto?.id || userLogsDto.userId,
      signOff: true,
      logIn: new Date(),
      logOut: null,
      description: 'Login'
    });

    const userLogWithAssociations = await UserLogs.findByPk(userLog.id, {
      include: [{ model: User, as: 'user' }]
    });

    return this.transformToDto(userLogWithAssociations);
  }

  async save(userLogsDto) {
    logger.info('UserLogsService.save() invoked');
    
    const userLog = await UserLogs.create({
      userId: userLogsDto.userDto?.id || userLogsDto.userId,
      signOff: userLogsDto.signOff !== undefined ? userLogsDto.signOff : false,
      logIn: userLogsDto.logIn ? new Date(userLogsDto.logIn) : new Date(),
      logOut: userLogsDto.logOut ? new Date(userLogsDto.logOut) : null,
      description: userLogsDto.description || ''
    });

    const userLogWithAssociations = await UserLogs.findByPk(userLog.id, {
      include: [{ model: User, as: 'user' }]
    });

    return this.transformToDto(userLogWithAssociations);
  }

  async getAllPageUserLogs(pageNumber, pageSize, status, searchParams) {
    logger.info('UserLogsService.getAllPageUserLogs() invoked');
    
    const where = {};
    
    // Filter by signOff status
    if (status !== undefined && status !== null) {
      where.signOff = status;
    }

    // Apply search filters
    if (searchParams) {
      if (searchParams.description) {
        where.description = { [Op.like]: `%${searchParams.description}%` };
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await UserLogs.findAndCountAll({
      where,
      include: [{ model: User, as: 'user' }],
      limit: pageSize,
      offset: offset,
      order: [['logIn', 'DESC']]
    });

    const userLogs = rows.map(log => this.transformToDto(log));

    return {
      content: userLogs,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(userLog) {
    if (!userLog) return null;
    
    return {
      id: userLog.id,
      signOff: userLog.signOff,
      logIn: userLog.logIn,
      logOut: userLog.logOut,
      description: userLog.description,
      userDto: userLog.user ? {
        id: userLog.user.id,
        firstName: userLog.user.firstName,
        lastName: userLog.user.lastName,
        emailAddress: userLog.user.emailAddress
      } : null
    };
  }
}

module.exports = new UserLogsService();
