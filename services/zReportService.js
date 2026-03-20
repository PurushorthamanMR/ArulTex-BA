const { ZReport, User } = require('../models');
const saleService = require('./saleService');
const shiftService = require('./shiftService');

function rowToDto(row) {
  const u = row.closer;
  const snap = row.snapshot && typeof row.snapshot === 'object' ? { ...row.snapshot } : {};
  return {
    ...snap,
    id: row.id,
    shiftId: row.shiftId != null ? row.shiftId : snap.shiftId,
    closedAt: row.createdAt,
    closedByUserId: row.closedByUserId,
    closedBy: u
      ? {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          emailAddress: u.emailAddress
        }
      : null,
    filterUserId: row.filterUserId
  };
}

/**
 * Z Report close: snapshot current open shift, save archive, close shift (register reset).
 * One Z per shift (enforced by shift closure + unique shiftId on z_reports).
 */
async function closeAndSave(closedByUserId) {
  const openShiftRow = await shiftService.getOpenShift();
  if (!openShiftRow) {
    throw new Error('No open shift. Open a shift on POS, then run Z Report to close the register.');
  }
  if (openShiftRow.closedAt) {
    throw new Error('Shift is already closed.');
  }

  const raw = await saleService.reportZ(null, null, null, openShiftRow.id);
  const openedDay = new Date(openShiftRow.openedAt).toISOString().slice(0, 10);
  const closedDay = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();
  const snapshot = {
    ...raw,
    shiftId: openShiftRow.id,
    shiftOpenedAt: openShiftRow.openedAt,
    shiftClosedAt: nowIso
  };

  const row = await ZReport.create({
    closedByUserId,
    filterUserId: null,
    shiftId: openShiftRow.id,
    fromDate: openedDay,
    toDate: closedDay,
    grandTotal: raw.grandTotal,
    transactionCount: raw.transactionCount,
    snapshot
  });

  await shiftService.closeShift(openShiftRow.id, closedByUserId, row.id);

  const withUser = await ZReport.findByPk(row.id, {
    include: [
      {
        model: User,
        as: 'closer',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  });
  return rowToDto(withUser);
}

async function listArchives(limit = 50) {
  const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const rows = await ZReport.findAll({
    limit: lim,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'closer',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  });
  return rows.map(rowToDto);
}

async function getArchiveById(id) {
  const row = await ZReport.findByPk(id, {
    include: [
      {
        model: User,
        as: 'closer',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  });
  if (!row) throw new Error('Z Report not found');
  return rowToDto(row);
}

module.exports = {
  closeAndSave,
  listArchives,
  getArchiveById,
  rowToDto
};
