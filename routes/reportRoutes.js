const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/profit-loss', authenticateToken, async (req, res) => {
  try {
    const result = await reportService.getProfitLoss(req.query.fromDate, req.query.toDate);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting profit-loss report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving profit-loss report', 500));
  }
});

module.exports = router;
