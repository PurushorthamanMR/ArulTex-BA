const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const summary = await dashboardService.getSummary();
    res.json(responseUtil.getServiceResponse(summary));
  } catch (error) {
    logger.error('Error getting dashboard summary:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving dashboard summary', 500));
  }
});

module.exports = router;
