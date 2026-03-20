const { Shift, User } = require('../models');

async function getOpenShift() {
  return Shift.findOne({
    where: { closedAt: null },
    order: [['openedAt', 'DESC']],
    include: [{ model: User, as: 'opener', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }]
  });
}

/**
 * Open a new shift. Only one open shift allowed (shop register).
 */
async function openShift(userId) {
  const existing = await Shift.findOne({ where: { closedAt: null } });
  if (existing) {
    throw new Error('A shift is already open. Run Z Report to close it before opening a new shift.');
  }
  const row = await Shift.create({
    openedByUserId: userId,
    openedAt: new Date()
  });
  return Shift.findByPk(row.id, {
    include: [{ model: User, as: 'opener', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }]
  });
}

/**
 * Close shift after Z report is stored (logical register reset).
 */
async function closeShift(shiftId, closedByUserId, zReportId) {
  const shift = await Shift.findByPk(shiftId);
  if (!shift) throw new Error('Shift not found');
  if (shift.closedAt) throw new Error('Shift already closed');
  await shift.update({
    closedAt: new Date(),
    closedByUserId,
    zReportId
  });
  return shift;
}

function shiftToDto(row) {
  if (!row) return null;
  return {
    id: row.id,
    openedAt: row.openedAt,
    openedByUserId: row.openedByUserId,
    openedBy: row.opener
      ? {
          id: row.opener.id,
          firstName: row.opener.firstName,
          lastName: row.opener.lastName,
          emailAddress: row.opener.emailAddress
        }
      : null,
    closedAt: row.closedAt,
    closedByUserId: row.closedByUserId,
    closedBy: row.closer
      ? {
          id: row.closer.id,
          firstName: row.closer.firstName,
          lastName: row.closer.lastName,
          emailAddress: row.closer.emailAddress
        }
      : null,
    zReportId: row.zReportId
  };
}

/**
 * Recent shifts (newest first). Includes open shift if any.
 */
async function listShifts(limit = 50) {
  const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const rows = await Shift.findAll({
    limit: lim,
    order: [['openedAt', 'DESC']],
    include: [
      { model: User, as: 'opener', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] },
      { model: User, as: 'closer', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }
    ]
  });
  return rows;
}

module.exports = {
  getOpenShift,
  openShift,
  closeShift,
  shiftToDto,
  listShifts
};
