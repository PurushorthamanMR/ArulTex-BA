const express = require('express');
const router = express.Router();
const countryService = require('../services/countryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CountryController.save() invoked');
    const countryDto = await countryService.save(req.body);
    res.json(responseUtil.getServiceResponse(countryDto));
  } catch (error) {
    logger.error('Error saving country:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving country details', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CountryController.getAll() invoked');
    const countries = await countryService.getAll();
    res.json(responseUtil.getServiceResponse(countries));
  } catch (error) {
    logger.error('Error retrieving countries:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all country details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CountryController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const result = await countryService.getAllPage(pageNumber, pageSize);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving countries:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all country details', 500));
  }
});

module.exports = router;
