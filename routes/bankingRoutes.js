const express = require('express');
const router = express.Router();
const bankingService = require('../services/bankingService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, async (req, res) => {
  try {
    logger.info('BankingController.save() invoked');
    const bankingDto = await bankingService.save(req.body);
    res.json(responseUtil.getServiceResponse(bankingDto));
  } catch (error) {
    logger.error('Error saving banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving banking details', 500));
  }
});

router.get('/getAllPage', authenticateToken, async (req, res) => {
  try {
    logger.info('BankingController.getAll() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};

    const result = await bankingService.getAllPage(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all banking details', 500));
  }
});

router.get('/getTotalBanking', authenticateToken, async (req, res) => {
  try {
    logger.info('BankingController.getTotalBanking() invoked');
    const total = await bankingService.getTotalBanking();
    res.json(responseUtil.getServiceResponse(total));
  } catch (error) {
    logger.error('Error retrieving total banking:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving total banking', 500));
  }
});

module.exports = router;
