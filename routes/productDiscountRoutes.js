const express = require('express');
const router = express.Router();
const productDiscountService = require('../services/productDiscountService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountController.save() invoked');
    const productDiscountDto = await productDiscountService.save(req.body);
    res.json(responseUtil.getServiceResponse(productDiscountDto));
  } catch (error) {
    logger.error('Error saving product discount:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving product discount details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountController.update() invoked');
    const productDiscountDto = await productDiscountService.update(req.body);
    res.json(responseUtil.getServiceResponse(productDiscountDto));
  } catch (error) {
    logger.error('Error updating product discount:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating product discount details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountController.updateStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const productDiscountDto = await productDiscountService.updateStatus(id, status);
    if (productDiscountDto) {
      res.json(responseUtil.getServiceResponse(productDiscountDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Product discount not found', 404));
    }
  } catch (error) {
    logger.error('Error updating product discount status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating product discount status', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};

    const result = await productDiscountService.getAllPage(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving product discounts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product discount details', 500));
  }
});

module.exports = router;
