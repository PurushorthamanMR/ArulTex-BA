const { Op } = require('sequelize');
const { DeviceAuth } = require('../models');
const logger = require('../config/logger');

class DeviceAuthService {
  async registerDeviceAuth(deviceAuthDto) {
    logger.info('DeviceAuthService.registerDeviceAuth() invoked');
    
    const deviceAuth = await DeviceAuth.create({
      tillId: deviceAuthDto.tillId,
      tillName: deviceAuthDto.tillName,
      approveStatus: 'Pending',
      loginStatus: 'False',
      isActive: '1'
    });

    return this.transformToDto(deviceAuth);
  }

  async approveDeviceAuth(id) {
    logger.info('DeviceAuthService.approveDeviceAuth() invoked');
    
    const deviceAuth = await DeviceAuth.findByPk(id);
    if (!deviceAuth) {
      throw new Error('Device auth not found');
    }

    await deviceAuth.update({
      approveStatus: 'Approved',
      loginStatus: 'True'
    });

    return this.transformToDto(deviceAuth);
  }

  async declineDeviceAuth(id) {
    logger.info('DeviceAuthService.declineDeviceAuth() invoked');
    
    const deviceAuth = await DeviceAuth.findByPk(id);
    if (!deviceAuth) {
      throw new Error('Device auth not found');
    }

    await deviceAuth.update({
      approveStatus: 'Declined',
      loginStatus: 'False',
      isActive: '0'
    });

    return this.transformToDto(deviceAuth);
  }

  async blockDeviceAuth(id) {
    logger.info('DeviceAuthService.blockDeviceAuth() invoked');
    
    const deviceAuth = await DeviceAuth.findByPk(id);
    if (!deviceAuth) {
      throw new Error('Device auth not found');
    }

    await deviceAuth.update({
      loginStatus: 'False'
    });

    return this.transformToDto(deviceAuth);
  }

  async loginDeviceAuth(tillId) {
    logger.info('DeviceAuthService.loginDeviceAuth() invoked');
    
    const deviceAuth = await DeviceAuth.findOne({
      where: { tillId }
    });

    if (!deviceAuth) {
      throw new Error('Device auth not found');
    }

    if (deviceAuth.approveStatus !== 'Approved') {
      throw new Error('Device not approved');
    }

    if (deviceAuth.loginStatus !== 'True') {
      throw new Error('Device is blocked');
    }

    return this.transformToDto(deviceAuth);
  }

  async getAllPending() {
    logger.info('DeviceAuthService.getAllPending() invoked');
    
    const deviceAuths = await DeviceAuth.findAll({
      where: {
        approveStatus: 'Pending'
      },
      order: [['id', 'DESC']]
    });

    return deviceAuths.map(auth => this.transformToDto(auth));
  }

  async getAll() {
    logger.info('DeviceAuthService.getAll() invoked');
    
    const deviceAuths = await DeviceAuth.findAll({
      where: {
        approveStatus: {
          [Op.in]: ['Approved', 'Declined']
        }
      },
      order: [['id', 'DESC']]
    });

    return deviceAuths.map(auth => this.transformToDto(auth));
  }

  async getByTillName(tillName) {
    logger.info('DeviceAuthService.getByTillName() invoked');
    
    const deviceAuths = await DeviceAuth.findAll({
      where: {
        tillName: { [Op.like]: `%${tillName}%` }
      }
    });

    return deviceAuths.map(auth => this.transformToDto(auth));
  }

  async getByTillId(tillId) {
    logger.info('DeviceAuthService.getByTillId() invoked');
    
    const deviceAuths = await DeviceAuth.findAll({
      where: { tillId }
    });

    return deviceAuths.map(auth => this.transformToDto(auth));
  }

  async updateTillName(id, tillName) {
    logger.info('DeviceAuthService.updateTillName() invoked');
    
    const deviceAuth = await DeviceAuth.findByPk(id);
    if (!deviceAuth) {
      throw new Error('Device auth not found');
    }

    await deviceAuth.update({ tillName });
    return this.transformToDto(deviceAuth);
  }

  transformToDto(deviceAuth) {
    if (!deviceAuth) return null;
    
    return {
      id: deviceAuth.id,
      tillId: deviceAuth.tillId,
      tillName: deviceAuth.tillName,
      approveStatus: deviceAuth.approveStatus,
      loginStatus: deviceAuth.loginStatus,
      isActive: deviceAuth.isActive
    };
  }
}

module.exports = new DeviceAuthService();
