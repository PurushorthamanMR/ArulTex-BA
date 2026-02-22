const express = require('express');
const router = express.Router();
const purchaseService = require('../services/purchaseService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await purchaseService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving purchase:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving purchase', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await purchaseService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating purchase:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating purchase', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await purchaseService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting purchases:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving purchases', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await purchaseService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting purchase by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving purchase', 500));
  }
});

router.get('/getByProductId', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.query.productId);
    const list = await purchaseService.getByProductId(productId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting purchase items by product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving purchase items', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await purchaseService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching purchases:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching purchases', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await purchaseService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting purchase:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting purchase', 500));
  }
});

module.exports = router;
