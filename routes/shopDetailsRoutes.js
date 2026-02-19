const express = require('express');
const router = express.Router();
const shopDetailsService = require('../services/shopDetailsService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.save() invoked');
    const shopDetailsDto = await shopDetailsService.save(req.body);
    res.json(responseUtil.getServiceResponse(shopDetailsDto));
  } catch (error) {
    logger.error('Error saving shop details:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving shop details', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.getAll() invoked');
    const shopDetailsList = await shopDetailsService.getAll();
    res.json(responseUtil.getServiceResponse(shopDetailsList));
  } catch (error) {
    logger.error('Error retrieving shop details:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all shop details', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.getAllShopDetailsByName() invoked');
    const name = req.query.name;
    const shopDetailsList = await shopDetailsService.getByName(name);
    res.json(responseUtil.getServiceResponse(shopDetailsList));
  } catch (error) {
    logger.error('Error retrieving shop details by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving shop details by name', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;

    const result = await shopDetailsService.getAllPageShopDetails(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving shop details:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all shop details', 500));
  }
});

module.exports = router;
