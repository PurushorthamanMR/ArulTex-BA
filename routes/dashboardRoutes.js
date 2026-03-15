const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken } = require('../middleware/authMiddleware');
const { isDummyManager, getDummyManagerFactor, applyRevenueFactor } = require('../utils/dummyManagerUtil');
const logger = require('../config/logger');

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    let summary = await dashboardService.getSummary();
    if (isDummyManager(req.userRole)) {
      summary = applyRevenueFactor(summary, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(summary));
  } catch (error) {
    logger.error('Error getting dashboard summary:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving dashboard summary', 500));
  }
});

module.exports = router;
