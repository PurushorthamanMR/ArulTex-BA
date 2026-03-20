const express = require('express');
const router = express.Router();
const shiftService = require('../services/shiftService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

const POS_ROLES = ['ADMIN', 'MANAGER', 'STAFF', 'Dummy Manager'];

/** Current open shift (null if none) */
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const row = await shiftService.getOpenShift();
    res.json(responseUtil.getServiceResponse(shiftService.shiftToDto(row)));
  } catch (error) {
    logger.error('Error getting current shift:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving shift', 500));
  }
});

/** Recent shifts (history + current) */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const rows = await shiftService.listShifts(req.query.limit);
    const list = rows.map((r) => shiftService.shiftToDto(r));
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error listing shifts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving shifts', 500));
  }
});

/** Open register shift */
router.post('/open', authenticateToken, authorize(...POS_ROLES), async (req, res) => {
  try {
    const row = await shiftService.openShift(req.user.id);
    res.json(responseUtil.getServiceResponse(shiftService.shiftToDto(row)));
  } catch (error) {
    logger.error('Error opening shift:', error);
    res.status(400).json(responseUtil.getErrorServiceResponse(error.message || 'Cannot open shift', 400));
  }
});

module.exports = router;
