const express = require('express');
const router = express.Router();
const taxService = require('../services/taxService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.save() invoked');
    const taxDto = await taxService.save(req.body);
    res.json(responseUtil.getServiceResponse(taxDto));
  } catch (error) {
    logger.error('Error saving tax:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving tax details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.update() invoked');
    const taxDto = await taxService.update(req.body);
    res.json(responseUtil.getServiceResponse(taxDto));
  } catch (error) {
    logger.error('Error updating tax:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating tax details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.updateTaxStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const taxDto = await taxService.updateTaxStatus(id, status);
    if (taxDto) {
      res.json(responseUtil.getServiceResponse(taxDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Tax not found', 404));
    }
  } catch (error) {
    logger.error('Error updating tax status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating tax status', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.getTaxByPercentage() invoked');
    const taxPercentage = parseFloat(req.query.taxPercentage);
    const taxes = await taxService.getTaxByName(taxPercentage);
    res.json(responseUtil.getServiceResponse(taxes));
  } catch (error) {
    logger.error('Error retrieving tax by percentage:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving tax by percentage', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.getAll() invoked');
    const taxes = await taxService.getAll();
    res.json(responseUtil.getServiceResponse(taxes));
  } catch (error) {
    logger.error('Error retrieving taxes:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all tax details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TaxController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};

    const result = await taxService.getAllPageTax(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving taxes:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all tax details', 500));
  }
});

module.exports = router;
