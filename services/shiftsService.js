const { Op } = require('sequelize');
const { Shifts, User, Branch } = require('../models');
const logger = require('../config/logger');

class ShiftsService {
  async save(shiftsDto) {
    logger.info('ShiftsService.save() invoked');
    
    const shift = await Shifts.create({
      startTime: shiftsDto.startTime ? new Date(shiftsDto.startTime) : new Date(),
      endTime: shiftsDto.endTime ? new Date(shiftsDto.endTime) : null,
      userId: shiftsDto.userDto?.id || shiftsDto.userId,
      branchId: shiftsDto.branchDto?.id || shiftsDto.branchId
    });

    const shiftWithAssociations = await Shifts.findByPk(shift.id, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(shiftWithAssociations);
  }

  async update(shiftsDto) {
    logger.info('ShiftsService.update() invoked');
    
    const shift = await Shifts.findByPk(shiftsDto.id);
    if (!shift) {
      throw new Error('Shift not found');
    }

    await shift.update({
      startTime: shiftsDto.startTime ? new Date(shiftsDto.startTime) : shift.startTime,
      endTime: shiftsDto.endTime ? new Date(shiftsDto.endTime) : shift.endTime,
      userId: shiftsDto.userDto?.id || shiftsDto.userId || shift.userId,
      branchId: shiftsDto.branchDto?.id || shiftsDto.branchId || shift.branchId
    });

    const updatedShift = await Shifts.findByPk(shift.id, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedShift);
  }

  async updateStatus(shiftId, status) {
    logger.info('ShiftsService.updateStatus() invoked');
    // Note: Shifts model may not have isActive, implement based on your model
    const shift = await Shifts.findByPk(shiftId);
    if (!shift) {
      return null;
    }

    // If shifts have status field, update it
    // Otherwise, you might need to add endTime to mark as completed
    if (status === false && !shift.endTime) {
      await shift.update({ endTime: new Date() });
    }

    const updatedShift = await Shifts.findByPk(shiftId, {
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ]
    });

    return this.transformToDto(updatedShift);
  }

  async getAllPageShifts(pageNumber, pageSize, status, searchParams) {
    logger.info('ShiftsService.getAllPageShifts() invoked');
    
    const where = {};
    // Filter by endTime presence for status
    if (status !== undefined && status !== null) {
      if (status === false) {
        where.endTime = { [Op.ne]: null };
      } else {
        where.endTime = null;
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    
    const { count, rows } = await Shifts.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ],
      limit: pageSize,
      offset: offset,
      order: [['startTime', 'DESC']]
    });

    const shifts = rows.map(shift => this.transformToDto(shift));

    return {
      content: shifts,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  async getAllByDateRange(startDate, endDate) {
    logger.info('ShiftsService.getAllByDateRange() invoked');
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day

    const shifts = await Shifts.findAll({
      where: {
        startTime: {
          [Op.between]: [start, end]
        }
      },
      include: [
        { model: User, as: 'user' },
        { model: Branch, as: 'branch' }
      ],
      order: [['startTime', 'ASC']]
    });

    return shifts.map(shift => this.transformToDto(shift));
  }

  transformToDto(shift) {
    if (!shift) return null;
    
    return {
      id: shift.id,
      startTime: shift.startTime,
      endTime: shift.endTime,
      userDto: shift.user ? {
        id: shift.user.id,
        firstName: shift.user.firstName,
        lastName: shift.user.lastName,
        emailAddress: shift.user.emailAddress
      } : null,
      branchDto: shift.branch ? {
        id: shift.branch.id,
        branchName: shift.branch.branchName
      } : null
    };
  }
}

module.exports = new ShiftsService();
