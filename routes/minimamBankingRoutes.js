const express = require('express');
const router = express.Router();
const minimamBankingService = require('../services/minimamBankingService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('MinimamBankingController.save() invoked');
    const minimamBankingDto = await minimamBankingService.save(req.body);
    res.json(responseUtil.getServiceResponse(minimamBankingDto));
  } catch (error) {
    logger.error('Error saving minimam banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving minimam banking details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('MinimamBankingController.update() invoked');
    const minimamBankingDto = await minimamBankingService.update(req.body);
    res.json(responseUtil.getServiceResponse(minimamBankingDto));
  } catch (error) {
    logger.error('Error updating minimam banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating minimam banking details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('MinimamBankingController.getAll() invoked');
    const minimamBankingList = await minimamBankingService.getAll();
    res.json(responseUtil.getServiceResponse(minimamBankingList));
  } catch (error) {
    logger.error('Error retrieving minimam banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all minimam banking details', 500));
  }
});

module.exports = router;
