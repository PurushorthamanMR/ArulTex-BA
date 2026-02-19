const { Op } = require('sequelize');
const { ManagerToggle } = require('../models');
const logger = require('../config/logger');

class ManagerToggleService {
  async save(managerToggleDto) {
    logger.info('ManagerToggleService.save() invoked');
    
    const managerToggle = await ManagerToggle.create({
      action: managerToggleDto.action,
      isActive: managerToggleDto.isActive !== undefined ? managerToggleDto.isActive : true,
      adminActive: managerToggleDto.adminActive !== undefined ? managerToggleDto.adminActive : true
    });

    return this.transformToDto(managerToggle);
  }

  async update(managerToggleDto) {
    logger.info('ManagerToggleService.update() invoked');
    
    const managerToggle = await ManagerToggle.findByPk(managerToggleDto.id);
    if (!managerToggle) {
      throw new Error('Manager toggle not found');
    }

    await managerToggle.update({
      action: managerToggleDto.action !== undefined ? managerToggleDto.action : managerToggle.action,
      isActive: managerToggleDto.isActive !== undefined ? managerToggleDto.isActive : managerToggle.isActive,
      adminActive: managerToggleDto.adminActive !== undefined ? managerToggleDto.adminActive : managerToggle.adminActive
    });

    return this.transformToDto(managerToggle);
  }

  async updateStatus(id, status) {
    logger.info('ManagerToggleService.updateStatus() invoked');
    
    const managerToggle = await ManagerToggle.findByPk(id);
    if (!managerToggle) {
      return null;
    }

    await managerToggle.update({ isActive: status });
    return this.transformToDto(managerToggle);
  }

  async updateAdminStatus(id, status) {
    logger.info('ManagerToggleService.updateAdminStatus() invoked');
    
    const managerToggle = await ManagerToggle.findByPk(id);
    if (!managerToggle) {
      return null;
    }

    await managerToggle.update({ adminActive: status });
    return this.transformToDto(managerToggle);
  }

  async getAll() {
    logger.info('ManagerToggleService.getAll() invoked');
    
    const toggles = await ManagerToggle.findAll({
      order: [['id', 'ASC']]
    });

    return toggles.map(toggle => this.transformToDto(toggle));
  }

  async getByName(action) {
    logger.info('ManagerToggleService.getByName() invoked');
    
    const toggles = await ManagerToggle.findAll({
      where: {
        action: { [Op.like]: `%${action}%` }
      }
    });

    return toggles.map(toggle => this.transformToDto(toggle));
  }

  transformToDto(managerToggle) {
    if (!managerToggle) return null;
    
    return {
      id: managerToggle.id,
      action: managerToggle.action,
      isActive: managerToggle.isActive,
      adminActive: managerToggle.adminActive
    };
  }
}

module.exports = new ManagerToggleService();
