const { Op } = require('sequelize');
const { StaffLeave, User, Branch } = require('../models');
const emailService = require('./emailService');
const logger = require('../config/logger');

class StaffLeaveService {
  async save(staffLeaveDto) {
    logger.info('StaffLeaveService.save() invoked');
    
    const staffLeave = await StaffLeave.create({
      startDate: staffLeaveDto.startDate ? new Date(staffLeaveDto.startDate) : new Date(),
      endDate: staffLeaveDto.endDate ? new Date(staffLeaveDto.endDate) : null,
      reason: staffLeaveDto.reason,
      userId: staffLeaveDto.userDto?.id || staffLeaveDto.userId,
      branchId: staffLeaveDto.branchDto?.id || staffLeaveDto.branchId
    });

    const staffLeaveWithAssociations = await StaffLeave.findByPk(staffLeave.id, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(staffLeaveWithAssociations);
  }

  async getAll() {
    logger.info('StaffLeaveService.getAll() invoked');
    
    const staffLeaves = await StaffLeave.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ],
      order: [['startDate', 'DESC']]
    });

    return staffLeaves.map(leave => this.transformToDto(leave));
  }

  async update(staffLeaveDto) {
    logger.info('StaffLeaveService.update() invoked');
    
    const staffLeave = await StaffLeave.findByPk(staffLeaveDto.id);
    if (!staffLeave) {
      throw new Error('Staff leave not found');
    }

    await staffLeave.update({
      startDate: staffLeaveDto.startDate ? new Date(staffLeaveDto.startDate) : staffLeave.startDate,
      endDate: staffLeaveDto.endDate ? new Date(staffLeaveDto.endDate) : staffLeave.endDate,
      reason: staffLeaveDto.reason !== undefined ? staffLeaveDto.reason : staffLeave.reason,
      userId: staffLeaveDto.userDto?.id || staffLeaveDto.userId || staffLeave.userId,
      branchId: staffLeaveDto.branchDto?.id || staffLeaveDto.branchId || staffLeave.branchId
    });

    const updatedLeave = await StaffLeave.findByPk(staffLeave.id, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedLeave);
  }

  async updateStatus(id, status) {
    logger.info('StaffLeaveService.updateStatus() invoked');
    // Note: StaffLeave may not have isActive field, implement based on your model
    const staffLeave = await StaffLeave.findByPk(id);
    if (!staffLeave) {
      return null;
    }

    // If model has status field, update it
    // Otherwise, you might track status differently
    const updatedLeave = await StaffLeave.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedLeave);
  }

  async getAllPageStaffLeave(pageNumber, pageSize, status, searchParams) {
    logger.info('StaffLeaveService.getAllPageStaffLeave() invoked');
    
    const where = {};
    // Note: Implement status filtering based on your model structure

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await StaffLeave.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['startDate', 'DESC']]
    });

    const staffLeaves = rows.map(leave => this.transformToDto(leave));

    return {
      content: staffLeaves,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async sendEmail(to, subject, body) {
    logger.info('StaffLeaveService.sendEmail() invoked');
    
    try {
      await emailService.sendEmail(to, subject, body);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  transformToDto(staffLeave) {
    if (!staffLeave) return null;
    
    return {
      id: staffLeave.id,
      startDate: staffLeave.startDate,
      endDate: staffLeave.endDate,
      reason: staffLeave.reason,
      userDto: staffLeave.user ? {
        id: staffLeave.user.id,
        firstName: staffLeave.user.firstName,
        lastName: staffLeave.user.lastName
      } : null,
      branchDto: staffLeave.branch ? {
        id: staffLeave.branch.id,
        branchName: staffLeave.branch.branchName
      } : null
    };
  }
}

module.exports = new StaffLeaveService();
