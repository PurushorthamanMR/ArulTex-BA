const { Op } = require('sequelize');
const { Supplier } = require('../models');

const DEFAULT_NO_SUPPLIER_NAME = 'Nosupplier';

/**
 * Resolves missing/invalid supplier id to the seeded "Nosupplier" row (same as purchases).
 */
async function resolveDefaultSupplierId(supplierId) {
  const n = Number(supplierId);
  if (Number.isFinite(n) && n > 0) return n;
  const fallback = await Supplier.findOne({
    where: {
      [Op.or]: [{ email: 'nosupplier@gmail.com' }, { supplierName: DEFAULT_NO_SUPPLIER_NAME }]
    }
  });
  if (!fallback) {
    throw new Error('Default supplier (Nosupplier) is not configured. Restart the server.');
  }
  return fallback.id;
}

function mapSupplierNameForDisplay(supplierRow) {
  if (!supplierRow) return null;
  const rawName = supplierRow.supplierName;
  return {
    id: supplierRow.id,
    supplierName: rawName === DEFAULT_NO_SUPPLIER_NAME ? 'No supplier' : rawName
  };
}

module.exports = {
  resolveDefaultSupplierId,
  mapSupplierNameForDisplay,
  DEFAULT_NO_SUPPLIER_NAME
};
