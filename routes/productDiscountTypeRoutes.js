const express = require('express');
const router = express.Router();
const productDiscountTypeService = require('../services/productDiscountTypeService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountTypeController.save() invoked');
    const productDiscountTypeDto = await productDiscountTypeService.save(req.body);
    res.json(responseUtil.getServiceResponse(productDiscountTypeDto));
  } catch (error) {
    logger.error('Error saving product discount type:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving product discount type details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountTypeController.update() invoked');
    const productDiscountTypeDto = await productDiscountTypeService.update(req.body);
    res.json(responseUtil.getServiceResponse(productDiscountTypeDto));
  } catch (error) {
    logger.error('Error updating product discount type:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating product discount type details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountTypeController.updateStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const productDiscountTypeDto = await productDiscountTypeService.updateStatus(id, status);
    if (productDiscountTypeDto) {
      res.json(responseUtil.getServiceResponse(productDiscountTypeDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Product discount type not found', 404));
    }
  } catch (error) {
    logger.error('Error updating product discount type status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating product discount type status', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductDiscountTypeController.getAll() invoked');
    const types = await productDiscountTypeService.getAll();
    res.json(responseUtil.getServiceResponse(types));
  } catch (error) {
    logger.error('Error retrieving product discount types:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product discount type details', 500));
  }
});

module.exports = router;
